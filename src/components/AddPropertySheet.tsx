import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
});
type PropertyFormData = z.infer<typeof propertySchema>;
export function AddPropertySheet() {
  const isSheetOpen = usePropertyStore(s => s.isSheetOpen);
  const closeSheet = usePropertyStore(s => s.closeSheet);
  const selectedProperty = usePropertyStore(s => s.selectedProperty);
  const addProperty = usePropertyStore(s => s.addProperty);
  const updateProperty = usePropertyStore(s => s.updateProperty);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
  });
  useEffect(() => {
    if (selectedProperty) {
      reset(selectedProperty);
    } else {
      reset({
        name: '', address: '', type: 'Apartment', status: 'For Rent', imageUrl: '',
        price: 0, bedrooms: 0, bathrooms: 0, areaSqft: 0, latitude: 0, longitude: 0,
      });
    }
  }, [selectedProperty, reset]);
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
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{selectedProperty ? 'Edit Property' : 'Add New Property'}</SheetTitle>
            <SheetDescription>
              {selectedProperty ? 'Update the details of your property.' : 'Fill in the details to add a new property to your portfolio.'}
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ScrollArea className="h-[calc(100vh-150px)] pr-4">
              <div className="space-y-4 py-4">
                {Object.keys(propertySchema.shape).map((key) => (
                  <div key={key} className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={key} className="text-right capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </Label>
                    {key === 'type' || key === 'status' ? (
                      <Select name={key} onValueChange={(value) => control.setValue(key as any, value)} defaultValue={selectedProperty?.[key]}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder={`Select ${key}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {(key === 'type' ? ['Apartment', 'House', 'Villa', 'Office', 'Land'] : ['For Sale', 'For Rent', 'Sold', 'Rented']).map((option) => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id={key}
                        {...register(key as keyof PropertyFormData)}
                        type={['price', 'bedrooms', 'bathrooms', 'areaSqft', 'latitude', 'longitude'].includes(key) ? 'number' : 'text'}
                        className="col-span-3"
                      />
                    )}
                    {errors[key as keyof PropertyFormData] && (
                      <p className="col-span-4 text-red-500 text-sm text-right">{errors[key as keyof PropertyFormData]?.message}</p>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="pt-4">
              <Button type="button" variant="outline" onClick={closeSheet}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Property'}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
      <Toaster richColors closeButton />
    </>
  );
}