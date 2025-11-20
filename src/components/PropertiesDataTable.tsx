import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import type { Property, PropertyStatus } from '@shared/types';
import { usePropertyStore } from '@/hooks/use-property-store';
import { Toaster, toast } from 'sonner';
interface PropertiesDataTableProps {
  properties: Property[];
  limit?: number;
}
const statusColors: Record<PropertyStatus, string> = {
  'For Sale': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'For Rent': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'Sold': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'Rented': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
};
export function PropertiesDataTable({ properties, limit }: PropertiesDataTableProps) {
  const navigate = useNavigate();
  const openSheet = usePropertyStore(s => s.openSheet);
  const deleteProperty = usePropertyStore(s => s.deleteProperty);
  const displayedProperties = limit ? properties.slice(0, limit) : properties;
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    toast.promise(deleteProperty(id), {
      loading: 'Deleting property...',
      success: 'Property deleted successfully!',
      error: 'Failed to delete property.',
    });
  };
  const handleEdit = (e: React.MouseEvent, prop: Property) => {
    e.stopPropagation();
    openSheet(prop);
  };
  const handleRowClick = (id: string) => {
    navigate(`/properties/${id}`);
  };
  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden lg:table-cell">Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedProperties.length > 0 ? (
              displayedProperties.map((prop) => (
                <TableRow key={prop.id} onClick={() => handleRowClick(prop.id)} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <img
                        src={prop.imageUrl}
                        alt={prop.name}
                        className="h-12 w-16 rounded-md object-cover"
                      />
                      <div>
                        <div className="font-medium">{prop.name}</div>
                        <div className="text-sm text-muted-foreground">{prop.address}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusColors[prop.status]}>
                      {prop.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{prop.type}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(prop.price)}
                    {prop.status === 'For Rent' && <span className="text-muted-foreground">/mo</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => handleEdit(e, prop)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => handleDelete(e, prop.id)} className="text-red-600 focus:text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No properties found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Toaster richColors closeButton />
    </>
  );
}