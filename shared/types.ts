export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// Minimal real-world chat example types (shared by frontend and worker)
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number; // epoch millis
}
// PropVista Property Types
export type PropertyStatus = "For Sale" | "For Rent" | "Sold" | "Rented";
export type PropertyType = "Apartment" | "House" | "Villa" | "Office" | "Land";
export type MaintenanceStatus = "Pending" | "In Progress" | "Completed";
export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  leaseStartDate: number; // epoch millis
  leaseEndDate: number; // epoch millis
}
export interface MaintenanceRequest {
  id: string;
  issue: string;
  reportedDate: number; // epoch millis
  status: MaintenanceStatus;
  cost?: number;
}
export interface Property {
  id: string;
  name: string;
  address: string;
  description?: string;
  type: PropertyType;
  status: PropertyStatus;
  imageUrl: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  latitude: number;
  longitude: number;
  createdAt: number; // epoch millis
  tenants?: Tenant[];
  maintenanceRequests?: MaintenanceRequest[];
}