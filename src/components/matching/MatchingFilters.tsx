
import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Home, 
  DollarSign, 
  Filter, 
  Clock, 
  X 
} from "lucide-react";

interface FilterValues {
  presupuesto?: [number, number];
  ubicacion?: string;
  intereses?: string[];
  horario?: string;
  ordenado?: boolean;
  mascotas?: boolean;
  fumador?: boolean;
}

interface MatchingFiltersProps {
  onApplyFilters: (filters: FilterValues) => void;
  onClearFilters: () => void;
  className?: string;
}

const MatchingFilters: React.FC<MatchingFiltersProps> = ({
  onApplyFilters,
  onClearFilters,
  className
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [presupuesto, setPresupuesto] = useState<[number, number]>([300, 900]);
  const [ubicacion, setUbicacion] = useState<string>('');
  const [intereses, setIntereses] = useState<string[]>([]);
  const [horario, setHorario] = useState<string>('');
  const [ordenado, setOrdenado] = useState<boolean>(false);
  const [mascotas, setMascotas] = useState<boolean>(false);
  const [fumador, setFumador] = useState<boolean>(false);
  
  const toggleFilter = () => {
    setShowFilters(!showFilters);
  };
  
  const handleApplyFilters = () => {
    onApplyFilters({
      presupuesto,
      ubicacion: ubicacion || undefined,
      intereses: intereses.length > 0 ? intereses : undefined,
      horario: horario || undefined,
      ordenado,
      mascotas,
      fumador
    });
  };
  
  const handleClearFilters = () => {
    setPresupuesto([300, 900]);
    setUbicacion('');
    setIntereses([]);
    setHorario('');
    setOrdenado(false);
    setMascotas(false);
    setFumador(false);
    onClearFilters();
  };
  
  const handleInterestToggle = (interest: string) => {
    if (intereses.includes(interest)) {
      setIntereses(intereses.filter(item => item !== interest));
    } else {
      setIntereses([...intereses, interest]);
    }
  };
  
  return (
    <div className={className}>
      <Button 
        onClick={toggleFilter} 
        variant="outline" 
        className="mb-4 w-full"
      >
        <Filter size={16} className="mr-2" />
        {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
      </Button>
      
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 animate-fade-in border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Presupuesto */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <DollarSign size={16} />
                Presupuesto: {presupuesto[0]}€ - {presupuesto[1]}€
              </label>
              <div className="px-2">
                <Slider 
                  value={presupuesto} 
                  min={100} 
                  max={1500}
                  step={50}
                  onValueChange={(value) => setPresupuesto(value as [number, number])}
                />
              </div>
            </div>
            
            {/* Ubicación */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Home size={16} />
                Ubicación
              </label>
              <Select value={ubicacion} onValueChange={setUbicacion}>
                <SelectTrigger>
                  <SelectValue placeholder="Cualquier ubicación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Cualquier ubicación</SelectItem>
                  <SelectItem value="Madrid">Madrid</SelectItem>
                  <SelectItem value="Barcelona">Barcelona</SelectItem>
                  <SelectItem value="Valencia">Valencia</SelectItem>
                  <SelectItem value="Sevilla">Sevilla</SelectItem>
                  <SelectItem value="Bilbao">Bilbao</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Horario */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Clock size={16} />
                Horario
              </label>
              <Select value={horario} onValueChange={setHorario}>
                <SelectTrigger>
                  <SelectValue placeholder="Cualquier horario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Cualquier horario</SelectItem>
                  <SelectItem value="diurno">Diurno</SelectItem>
                  <SelectItem value="nocturno">Nocturno</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Intereses */}
            <div className="col-span-1 md:col-span-2 space-y-2">
              <label className="text-sm font-medium">Intereses</label>
              <div className="flex flex-wrap gap-2">
                {['deporte', 'música', 'lectura', 'viajes', 'cine', 'gaming', 'cocina', 'arte'].map(interest => (
                  <Button
                    key={interest}
                    variant={intereses.includes(interest) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInterestToggle(interest)}
                    className="text-xs capitalize"
                  >
                    {interest}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Checkboxes para otras preferencias */}
            <div className="col-span-1 md:col-span-2 space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="ordenado" 
                  checked={ordenado} 
                  onCheckedChange={(checked) => setOrdenado(checked as boolean)} 
                />
                <label htmlFor="ordenado" className="text-sm font-medium cursor-pointer">
                  Persona ordenada
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="mascotas" 
                  checked={mascotas} 
                  onCheckedChange={(checked) => setMascotas(checked as boolean)} 
                />
                <label htmlFor="mascotas" className="text-sm font-medium cursor-pointer">
                  Acepta mascotas
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="fumador" 
                  checked={fumador} 
                  onCheckedChange={(checked) => setFumador(checked as boolean)} 
                />
                <label htmlFor="fumador" className="text-sm font-medium cursor-pointer">
                  Acepta fumadores
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handleClearFilters}>
              <X size={16} className="mr-2" />
              Limpiar filtros
            </Button>
            <Button onClick={handleApplyFilters}>
              <Filter size={16} className="mr-2" />
              Aplicar filtros
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchingFilters;
