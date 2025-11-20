import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, PropertyEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { Property } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'CF Workers Demo' }}));
  // USERS
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await UserEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/users', async (c) => {
    const { name } = (await c.req.json()) as { name?: string };
    if (!name?.trim()) return bad(c, 'name required');
    return ok(c, await UserEntity.create(c.env, { id: crypto.randomUUID(), name: name.trim() }));
  });
  // CHATS
  app.get('/api/chats', async (c) => {
    await ChatBoardEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await ChatBoardEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/chats', async (c) => {
    const { title } = (await c.req.json()) as { title?: string };
    if (!title?.trim()) return bad(c, 'title required');
    const created = await ChatBoardEntity.create(c.env, { id: crypto.randomUUID(), title: title.trim(), messages: [] });
    return ok(c, { id: created.id, title: created.title });
  });
  // MESSAGES
  app.get('/api/chats/:chatId/messages', async (c) => {
    const chat = new ChatBoardEntity(c.env, c.req.param('chatId'));
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.listMessages());
  });
  app.post('/api/chats/:chatId/messages', async (c) => {
    const chatId = c.req.param('chatId');
    const { userId, text } = (await c.req.json()) as { userId?: string; text?: string };
    if (!isStr(userId) || !text?.trim()) return bad(c, 'userId and text required');
    const chat = new ChatBoardEntity(c.env, chatId);
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.sendMessage(userId, text.trim()));
  });
  // PROPERTIES
  app.get('/api/properties', async (c) => {
    await PropertyEntity.ensureSeed(c.env);
    const page = await PropertyEntity.list(c.env);
    return ok(c, page);
  });
  app.get('/api/properties/:id', async (c) => {
    const id = c.req.param('id');
    const property = new PropertyEntity(c.env, id);
    if (!(await property.exists())) return notFound(c, 'Property not found');
    return ok(c, await property.getState());
  });
  app.post('/api/properties', async (c) => {
    const body = await c.req.json<Omit<Property, 'id' | 'createdAt'>>();
    if (!body.name || !body.address) return bad(c, 'Name and address are required');
    const newProperty: Property = {
      ...PropertyEntity.initialState,
      ...body,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    await PropertyEntity.create(c.env, newProperty);
    return ok(c, newProperty);
  });
  app.put('/api/properties/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json<Partial<Property>>();
    const property = new PropertyEntity(c.env, id);
    if (!(await property.exists())) return notFound(c, 'Property not found');
    const currentState = await property.getState();
    const updatedState = { ...currentState, ...body, id }; // Ensure ID is not changed
    await property.save(updatedState);
    return ok(c, updatedState);
  });
  app.delete('/api/properties/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await PropertyEntity.delete(c.env, id);
    if (!deleted) return notFound(c, 'Property not found');
    return ok(c, { id, deleted });
  });
  // DELETE: Users
  app.delete('/api/users/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await UserEntity.delete(c.env, c.req.param('id')) }));
  app.post('/api/users/deleteMany', async (c) => {
    const { ids } = (await c.req.json()) as { ids?: string[] };
    const list = ids?.filter(isStr) ?? [];
    if (list.length === 0) return bad(c, 'ids required');
    return ok(c, { deletedCount: await UserEntity.deleteMany(c.env, list), ids: list });
  });
  // DELETE: Chats
  app.delete('/api/chats/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await ChatBoardEntity.delete(c.env, c.req.param('id')) }));
  app.post('/api/chats/deleteMany', async (c) => {
    const { ids } = (await c.req.json()) as { ids?: string[] };
    const list = ids?.filter(isStr) ?? [];
    if (list.length === 0) return bad(c, 'ids required');
    return ok(c, { deletedCount: await ChatBoardEntity.deleteMany(c.env, list), ids: list });
  });
}