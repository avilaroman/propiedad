import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { PropertiesDataTable } from '@/components/PropertiesDataTable';
import { AddPropertySheet } from '@/components/AddPropertySheet';
import { usePropertyStore } from '@/hooks/use-property-store';
import { Skeleton } from '@/components/ui/skeleton';
export function PropertiesPage() {
  const fetchProperties = usePropertyStore(s => s.fetchProperties);
  const properties = usePropertyStore(s => s.properties);
  const isLoading = usePropertyStore(s => s.isLoading);
  const error = usePropertyStore(s => s.error);
  const openSheet = usePropertyStore(s => s.openSheet);
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">Manage your real estate portfolio.</p>
        </div>
        <Button onClick={() => openSheet()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>
      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      )}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!isLoading && !error && <PropertiesDataTable properties={properties} />}
      <AddPropertySheet />
    </div>
  );
}