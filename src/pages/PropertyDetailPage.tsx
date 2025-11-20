import React, { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePropertyStore } from '@/hooks/use-property-store';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Bath, BedDouble, Building, Calendar, DollarSign, Home, MapPin, RulerSquare, Wrench, Users } from 'lucide-react';
import { format } from 'date-fns';
import type { Property, PropertyStatus, Tenant, MaintenanceRequest } from '@shared/types';
const statusColors: Record<PropertyStatus, string> = {
  'For Sale': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'For Rent': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Sold': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'Rented': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
};
function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-muted-foreground mt-1">{icon}</div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const fetchPropertyById = usePropertyStore(s => s.fetchPropertyById);
  const properties = usePropertyStore(s => s.properties);
  const isLoading = usePropertyStore(s => s.isLoading);
  const error = usePropertyStore(s => s.error);
  const property = useMemo(() => properties.find(p => p.id === id), [properties, id]);
  useEffect(() => {
    if (id && !property) {
      fetchPropertyById(id);
    }
  }, [id, property, fetchPropertyById]);
  if (isLoading && !property) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-lg" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }
  if (!property) {
    return <div className="text-center text-muted-foreground">Property not found.</div>;
  }
  return (
    <div className="space-y-8">
      <div>
        <Button asChild variant="ghost" className="mb-4 -ml-4">
          <Link to="/properties">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Link>
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{property.name}</h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <MapPin className="h-4 w-4" /> {property.address}
            </p>
          </div>
          <Badge className={`mt-2 sm:mt-0 text-base ${statusColors[property.status]}`}>{property.status}</Badge>
        </div>
      </div>
      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          <img src={property.imageUrl} alt={property.name} className="w-full h-auto object-cover rounded-lg shadow-lg aspect-video" />
        </div>
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Property Details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-x-4 gap-y-6">
              <DetailItem icon={<DollarSign size={20} />} label="Price" value={
                <>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(property.price)}
                  {property.status === 'For Rent' && <span className="text-sm text-muted-foreground">/mo</span>}
                </>
              } />
              <DetailItem icon={<Home size={20} />} label="Type" value={property.type} />
              <DetailItem icon={<BedDouble size={20} />} label="Bedrooms" value={property.bedrooms} />
              <DetailItem icon={<Bath size={20} />} label="Bathrooms" value={property.bathrooms} />
              <DetailItem icon={<RulerSquare size={20} />} label="Area" value={`${property.areaSqft} sqft`} />
              <DetailItem icon={<Calendar size={20} />} label="Listed On" value={format(new Date(property.createdAt), 'MMM d, yyyy')} />
            </CardContent>
          </Card>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Description</h2>
        <p className="mt-2 text-muted-foreground">{property.description || 'No description available.'}</p>
      </div>
      <Tabs defaultValue="tenants">
        <TabsList>
          <TabsTrigger value="tenants"><Users className="mr-2 h-4 w-4" />Tenants</TabsTrigger>
          <TabsTrigger value="maintenance"><Wrench className="mr-2 h-4 w-4" />Maintenance</TabsTrigger>
        </TabsList>
        <TabsContent value="tenants" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Tenant Information</CardTitle></CardHeader>
            <CardContent>
              {property.tenants && property.tenants.length > 0 ? (
                <Table>
                  <TableBody>
                    {property.tenants.map(tenant => (
                      <React.Fragment key={tenant.id}>
                        <TableRow><TableCell className="font-medium">Name</TableCell><TableCell>{tenant.name}</TableCell></TableRow>
                        <TableRow><TableCell className="font-medium">Contact</TableCell><TableCell>{tenant.email} / {tenant.phone}</TableCell></TableRow>
                        <TableRow><TableCell className="font-medium">Lease Period</TableCell><TableCell>{format(new Date(tenant.leaseStartDate), 'PP')} - {format(new Date(tenant.leaseEndDate), 'PP')}</TableCell></TableRow>
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No tenant information available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="maintenance" className="mt-4">
          <Card>
            <CardHeader><CardTitle>Maintenance Log</CardTitle></CardHeader>
            <CardContent>
              {property.maintenanceRequests && property.maintenanceRequests.length > 0 ? (
                <Table>
                  <TableBody>
                    {property.maintenanceRequests.map(req => (
                      <TableRow key={req.id}>
                        <TableCell>
                          <p className="font-medium">{req.issue}</p>
                          <p className="text-sm text-muted-foreground">Reported: {format(new Date(req.reportedDate), 'PP')}</p>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={req.status === 'Completed' ? 'default' : 'secondary'}>{req.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No maintenance requests found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}