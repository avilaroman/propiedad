import type { User, Chat, ChatMessage, Property } from './types';
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'User A' },
  { id: 'u2', name: 'User B' }
];
export const MOCK_CHATS: Chat[] = [
  { id: 'c1', title: 'General' },
];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', chatId: 'c1', userId: 'u1', text: 'Hello', ts: Date.now() },
];
export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'p1',
    name: 'Modern Downtown Loft',
    address: '123 Main St, Anytown, USA',
    type: 'Apartment',
    status: 'For Rent',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop',
    price: 2500,
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1200,
    latitude: 34.0522,
    longitude: -118.2437,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: 'p2',
    name: 'Suburban Family Home',
    address: '456 Oak Ave, Suburbia, USA',
    type: 'House',
    status: 'For Sale',
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop',
    price: 750000,
    bedrooms: 4,
    bathrooms: 3,
    areaSqft: 2500,
    latitude: 34.1522,
    longitude: -118.3437,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: 'p3',
    name: 'Luxury Beachfront Villa',
    address: '789 Ocean Blvd, Beachtown, USA',
    type: 'Villa',
    status: 'For Sale',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop',
    price: 3500000,
    bedrooms: 5,
    bathrooms: 6,
    areaSqft: 5000,
    latitude: 33.9522,
    longitude: -118.4437,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
  },
  {
    id: 'p4',
    name: 'Cozy Studio Apartment',
    address: '321 Pine Ln, Metroville, USA',
    type: 'Apartment',
    status: 'Rented',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop',
    price: 1500,
    bedrooms: 1,
    bathrooms: 1,
    areaSqft: 500,
    latitude: 34.0822,
    longitude: -118.2137,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
  },
];