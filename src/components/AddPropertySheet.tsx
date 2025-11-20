import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePropertyStore } from '@/hooks/use-property-store';
import type { Property, PropertyStatus, PropertyType } from '@shared/types';
import { Toaster, toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
const propertySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  type: z.enum(['Apartment', 'House', 'Villa', 'Office', 'Land']),
  status: z.enum(['For Sale', 'For Rent', 'Sold', 'Rented']),
  imageUrl: z.string().url('Must be a valid URL'),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  bedrooms: z.coerce.number().int().min(0, 'Must be a positive number'),
  bathrooms: z.coerce.number().int().min(0, 'Must be a positive number'),
  areaSqft: z.coerce.number().int().min(0, 'Must be a positive number'),
  latitude: z.coerce.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
  longitude: z.coerce.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
});
type PropertyFormData = z.infer<typeof propertySchema>;
const propertyTypes: PropertyType[] = ['Apartment', 'House', 'Villa', 'Office', 'Land'];
const propertyStatuses: PropertyStatus[] = ['For Sale', 'For Rent', 'Sold', 'Rented'];
export function AddPropertySheet() {
  const isSheetOpen = usePropertyStore(s => s.isSheetOpen);
  const closeSheet = usePropertyStore(s => s.closeSheet);
  const selectedProperty = usePropertyStore(s => s.selectedProperty);
  const addProperty = usePropertyStore(s => s.addProperty);
  const updateProperty = usePropertyStore(s => s.updateProperty);
  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: '', address: '', type: 'Apartment', status: 'For Rent', imageUrl: '',
      price: 0, bedrooms: 0, bathrooms: 0, areaSqft: 0, latitude: 0, longitude: 0,
    }
  });
  useEffect(() => {
    if (selectedProperty) {
      form.reset(selectedProperty);
    } else {
      form.reset({
        name: '', address: '', type: 'Apartment', status: 'For Rent', imageUrl: '',
        price: 0, bedrooms: 0, bathrooms: 0, areaSqft: 0, latitude: 0, longitude: 0,
      });
    }
  }, [selectedProperty, form.reset, isSheetOpen]);
  const onSubmit = async (data: PropertyFormData) => {
    const promise = selectedProperty
      ? updateProperty(selectedProperty.id, data)
      : addProperty(data);
    toast.promise(promise, {
      loading: selectedProperty ? 'Updating property...' : 'Adding property...',
      success: (prop) => `Property "${prop?.name}" was ${selectedProperty ? 'updated' : 'added'} successfully!`,
      error: `Failed to ${selectedProperty ? 'update' : 'add'} property.`,
    });
  };
  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={closeSheet}>
        <SheetContent className="w-full sm:max-w-lg flex flex-col">
          <SheetHeader>
            <SheetTitle>{selectedProperty ? 'Edit Property' : 'Add New Property'}</SheetTitle>
            <SheetDescription>
              {selectedProperty ? 'Update the details of your property.' : 'Fill in the details to add a new property to your portfolio.'}
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 pr-4 -mr-4">
                <div className="space-y-4 py-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="imageUrl" render={({ field }) => (
                    <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="type" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                          <SelectContent>{propertyTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="status" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                          <SelectContent>{propertyStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-3 gap-4">
                    <FormField control={form.control} name="bedrooms" render={({ field }) => (
                      <FormItem><FormLabel>Bedrooms</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="bathrooms" render={({ field }) => (
                      <FormItem><FormLabel>Bathrooms</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="areaSqft" render={({ field }) => (
                      <FormItem><FormLabel>Area (sqft)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="latitude" render={({ field }) => (
                      <FormItem><FormLabel>Latitude</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="longitude" render={({ field }) => (
                      <FormItem><FormLabel>Longitude</FormLabel><FormControl><Input type="number" step="any" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                </div>
              </ScrollArea>
              <SheetFooter className="pt-4 mt-auto">
                <Button type="button" variant="outline" onClick={closeSheet}>Cancel</Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Saving...' : 'Save Property'}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
      <Toaster richColors closeButton />
    </>
  );
}