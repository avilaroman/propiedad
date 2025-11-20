import React, { useEffect } from 'react';
import { PropertyMap } from '@/components/PropertyMap';
import { usePropertyStore } from '@/hooks/use-property-store';
import { Skeleton } from '@/components/ui/skeleton';
export function MapPage() {
  const fetchProperties = usePropertyStore(s => s.fetchProperties);
  const properties = usePropertyStore(s => s.properties);
  const isLoading = usePropertyStore(s => s.isLoading);
  const error = usePropertyStore(s => s.error);
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);
  return (
    <div className="space-y-8 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Map View</h1>
        <p className="text-muted-foreground">A geographical overview of your property portfolio.</p>
      </div>
      <div className="flex-1 rounded-lg border overflow-hidden">
        {isLoading && <Skeleton className="h-full w-full" />}
        {error && <div className="h-full w-full flex items-center justify-center"><p className="text-red-500">Error: {error}</p></div>}
        {!isLoading && !error && <PropertyMap properties={properties} />}
      </div>
    </div>
  );
}