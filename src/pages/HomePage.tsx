import React, { useEffect, useMemo } from 'react';
import { DollarSign, Home, KeyRound, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { PropertiesDataTable } from '@/components/PropertiesDataTable';
import { usePropertyStore } from '@/hooks/use-property-store';
import { Skeleton } from '@/components/ui/skeleton';
import { AddPropertySheet } from '@/components/AddPropertySheet';
export function HomePage() {
  const fetchProperties = usePropertyStore(s => s.fetchProperties);
  const properties = usePropertyStore(s => s.properties);
  const isLoading = usePropertyStore(s => s.isLoading);
  const error = usePropertyStore(s => s.error);
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);
  const stats = useMemo(() => {
    const totalValue = properties.reduce((acc, prop) => acc + (prop.status === 'For Sale' ? prop.price : 0), 0);
    const occupancyRate = properties.length > 0
      ? (properties.filter(p => p.status === 'Rented').length / properties.length) * 100
      : 0;
    const forRent = properties.filter(p => p.status === 'For Rent').length;
    return {
      totalProperties: properties.length,
      portfolioValue: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(totalValue),
      occupancyRate: `${occupancyRate.toFixed(1)}%`,
      forRent,
    };
  }, [properties]);
  const recentProperties = useMemo(() => {
    return [...properties].sort((a, b) => b.createdAt - a.createdAt);
  }, [properties]);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">An overview of your property portfolio.</p>
      </div>
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Properties" value={String(stats.totalProperties)} icon={<Home className="h-5 w-5" />} />
          <StatCard title="Portfolio Value" value={stats.portfolioValue} icon={<DollarSign className="h-5 w-5" />} />
          <StatCard title="Occupancy Rate" value={stats.occupancyRate} icon={<TrendingUp className="h-5 w-5" />} />
          <StatCard title="Available for Rent" value={String(stats.forRent)} icon={<KeyRound className="h-5 w-5" />} />
        </div>
      )}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">Recently Added Properties</h2>
        {isLoading ? (
          <Skeleton className="h-48 w-full" />
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <PropertiesDataTable properties={recentProperties} limit={5} />
        )}
      </div>
      <AddPropertySheet />
    </div>
  );
}