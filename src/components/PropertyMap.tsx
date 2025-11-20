import React from 'react';
import { MapPin } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import type { Property, PropertyStatus } from '@shared/types';
import { cn } from '@/lib/utils';
interface PropertyMapProps {
  properties: Property[];
}
// Define approximate bounding box for continental USA for mapping demo coordinates
const MAP_BOUNDS = {
  latMin: 24.396308, // Key West, FL
  latMax: 49.384358, // Northwest Angle, MN
  lonMin: -125.000000, // Cape Alava, WA
  lonMax: -66.934570, // West Quoddy Head, ME
};
function normalizeCoordinates(lat: number, lon: number) {
  const x = ((lon - MAP_BOUNDS.lonMin) / (MAP_BOUNDS.lonMax - MAP_BOUNDS.lonMin)) * 100;
  const y = ((MAP_BOUNDS.latMax - lat) / (MAP_BOUNDS.latMax - MAP_BOUNDS.latMin)) * 100;
  return { x, y };
}
const statusColors: Record<PropertyStatus, string> = {
  'For Sale': 'bg-blue-500 border-blue-700',
  'For Rent': 'bg-green-500 border-green-700',
  'Sold': 'bg-red-500 border-red-700',
  'Rented': 'bg-yellow-500 border-yellow-700',
};
export function PropertyMap({ properties }: PropertyMapProps) {
  return (
    <div className="relative w-full h-full bg-muted/50 overflow-hidden">
      {/* A simple visual representation of a map */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iaHNsKDIxMCA0MCUgOTYuMSUpIj48L3JlY3Q+CjxwYXRoIGQ9Ik0gMTAsMCAwLDEwIE0gMjAsMTAgMTAsMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iaHNsKDIxMCA0MCUgOTAuMSUpIiBzdHJva2Utd2lkdGg9IjIiPjwvcGF0aD4KPC9zdmc+')] opacity-50"></div>
      <div className="dark:absolute dark:inset-0 dark:bg-background/80"></div>
      {properties.map((prop) => {
        const { x, y } = normalizeCoordinates(prop.latitude, prop.longitude);
        if (x < 0 || x > 100 || y < 0 || y > 100) return null;
        return (
          <HoverCard key={prop.id}>
            <HoverCardTrigger asChild>
              <div
                className="absolute -translate-x-1/2 -translate-y-full cursor-pointer transition-transform hover:scale-125"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <MapPin className={cn("h-6 w-6 text-white drop-shadow-lg", statusColors[prop.status])} fill="currentColor" />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex space-x-4">
                <img src={prop.imageUrl} alt={prop.name} className="h-20 w-20 rounded-md object-cover" />
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">{prop.name}</h4>
                  <p className="text-sm text-muted-foreground">{prop.address}</p>
                  <div className="flex items-center pt-2">
                    <span className="text-xs text-muted-foreground">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(prop.price)}
                      {prop.status === 'For Rent' && '/mo'}
                    </span>
                    <Badge variant="secondary" className="ml-auto">{prop.status}</Badge>
                  </div>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        );
      })}
       <div className="absolute bottom-4 right-4 bg-background/80 p-2 rounded-lg shadow-md text-xs text-muted-foreground">
        Built with ❤️ at Cloudflare
      </div>
    </div>
  );
}