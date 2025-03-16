
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { PropertyFilter as PropertyFilterType } from '@/types/property';
import PropertyFilter from './PropertyFilter';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface MobileFilterDrawerProps {
  onFilterChange: (filters: PropertyFilterType) => void;
  initialFilters?: PropertyFilterType;
}

const MobileFilterDrawer = ({ 
  onFilterChange, 
  initialFilters = {} 
}: MobileFilterDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (filters: PropertyFilterType) => {
    onFilterChange(filters);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="md:hidden fixed bottom-6 right-6 z-30 rounded-full shadow-lg" 
        >
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-xl pt-6 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtros de búsqueda</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <PropertyFilter 
            onFilterChange={handleFilterChange} 
            initialFilters={initialFilters} 
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilterDrawer;
