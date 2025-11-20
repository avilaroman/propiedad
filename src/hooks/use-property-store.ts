import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Property } from '@shared/types';
import { api } from '@/lib/api-client';
type PropertyState = {
  properties: Property[];
  isLoading: boolean;
  error: string | null;
  selectedProperty: Property | null;
  isSheetOpen: boolean;
};
type PropertyActions = {
  fetchProperties: () => Promise<void>;
  addProperty: (property: Omit<Property, 'id' | 'createdAt'>) => Promise<Property | undefined>;
  updateProperty: (id: string, property: Partial<Property>) => Promise<Property | undefined>;
  deleteProperty: (id: string) => Promise<void>;
  selectProperty: (property: Property | null) => void;
  openSheet: (property?: Property) => void;
  closeSheet: () => void;
};
export const usePropertyStore = create<PropertyState & PropertyActions>()(
  immer((set, get) => ({
    properties: [],
    isLoading: false,
    error: null,
    selectedProperty: null,
    isSheetOpen: false,
    fetchProperties: async () => {
      set({ isLoading: true, error: null });
      try {
        const result = await api<{ items: Property[] }>('/api/properties');
        set({ properties: result.items, isLoading: false });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch properties';
        set({ error: errorMessage, isLoading: false });
        console.error(errorMessage);
      }
    },
    addProperty: async (propertyData) => {
      try {
        const newProperty = await api<Property>('/api/properties', {
          method: 'POST',
          body: JSON.stringify(propertyData),
        });
        set((state) => {
          state.properties.push(newProperty);
        });
        get().closeSheet();
        return newProperty;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to add property';
        set({ error: errorMessage });
        console.error(errorMessage);
        return undefined;
      }
    },
    updateProperty: async (id, propertyData) => {
      try {
        const updatedProperty = await api<Property>(`/api/properties/${id}`, {
          method: 'PUT',
          body: JSON.stringify(propertyData),
        });
        set((state) => {
          const index = state.properties.findIndex((p) => p.id === id);
          if (index !== -1) {
            state.properties[index] = updatedProperty;
          }
        });
        get().closeSheet();
        return updatedProperty;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update property';
        set({ error: errorMessage });
        console.error(errorMessage);
        return undefined;
      }
    },
    deleteProperty: async (id: string) => {
      try {
        await api(`/api/properties/${id}`, { method: 'DELETE' });
        set((state) => {
          state.properties = state.properties.filter((p) => p.id !== id);
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete property';
        set({ error: errorMessage });
        console.error(errorMessage);
      }
    },
    selectProperty: (property) => {
      set({ selectedProperty: property });
    },
    openSheet: (property) => {
      set({ isSheetOpen: true, selectedProperty: property || null });
    },
    closeSheet: () => {
      set({ isSheetOpen: false, selectedProperty: null });
    },
  }))
);