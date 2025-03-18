
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
  X,
  Heart,
  BookOpen,
  Music,
  Plane,
  Film,
  Gamepad,
  Utensils,
  Palette
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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

const interestIcons: { [key: string]: React.ReactNode } = {
  'deporte': <Heart size={14} />,
  'música': <Music size={14} />,
  'lectura': <BookOpen size={14} />,
  'viajes': <Plane size={14} />,
  'cine': <Film size={14} />,
  'gaming': <Gamepad size={14} />,
  'cocina': <Utensils size={14} />,
  'arte': <Palette size={14} />
};

const MatchingFilters: React.FC<MatchingFiltersProps> = ({
  onApplyFilters,
  onClearFilters,
  className
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [presupuesto, setPresupuesto] = useState<[number, number]>([300, 900]);
  const [ubicacion, setUbicacion] = useState<string>('cualquiera');
  const [intereses, setIntereses] = useState<string[]>([]);
  const [horario, setHorario] = useState<string>('cualquiera');
  const [ordenado, setOrdenado] = useState<boolean>(false);
  const [mascotas, setMascotas] = useState<boolean>(false);
  const [fumador, setFumador] = useState<boolean>(false);
  
  const toggleFilter = () => {
    setShowFilters(!showFilters);
  };
  
  const handleApplyFilters = () => {
    onApplyFilters({
      presupuesto,
      ubicacion: ubicacion !== 'cualquiera' ? ubicacion : undefined,
      intereses: intereses.length > 0 ? intereses : undefined,
      horario: horario !== 'cualquiera' ? horario : undefined,
      ordenado,
      mascotas,
      fumador
    });
  };
  
  const handleClearFilters = () => {
    setPresupuesto([300, 900]);
    setUbicacion('cualquiera');
    setIntereses([]);
    setHorario('cualquiera');
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
        className="mb-4 w-full flex items-center justify-center"
      >
        <Filter size={16} className="mr-2" />
        {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
      </Button>
      
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 animate-in fade-in-50 border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Presupuesto */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <DollarSign size={16} />
                Presupuesto: {presupuesto[0]}€ - {presupuesto[1]}€
              </label>
              <div className="px-2 py-4">
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
                  <SelectItem value="cualquiera">Cualquier ubicación</SelectItem>
                  <SelectItem value="Madrid">Madrid</SelectItem>
                  <SelectItem value="Barcelona">Barcelona</SelectItem>
                  <SelectItem value="Valencia">Valencia</SelectItem>
                  <SelectItem value="Sevilla">Sevilla</SelectItem>
                  <SelectItem value="Bilbao">Bilbao</SelectItem>
                  <SelectItem value="Zaragoza">Zaragoza</SelectItem>
                  <SelectItem value="Málaga">Málaga</SelectItem>
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
                  <SelectItem value="cualquiera">Cualquier horario</SelectItem>
                  <SelectItem value="diurno">Diurno</SelectItem>
                  <SelectItem value="nocturno">Nocturno</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Intereses con toggles mejorados */}
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
                    {interestIcons[interest]}
                    <span className="ml-1">{interest}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Checkboxes para otras preferencias */}
            <div className="col-span-1 md:col-span-2 space-y-3">
              <div className="border p-4 rounded-lg space-y-4">
                <h3 className="font-medium text-sm">Preferencias de estilo de vida</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="ordenado" 
                      checked={ordenado} 
                      onCheckedChange={(checked) => setOrdenado(checked as boolean)} 
                    />
                    <label htmlFor="ordenado" className="text-sm font-medium cursor-pointer">
                      Persona ordenada
                    </label>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {ordenado ? "Sí" : "No"}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="mascotas" 
                      checked={mascotas} 
                      onCheckedChange={(checked) => setMascotas(checked as boolean)} 
                    />
                    <label htmlFor="mascotas" className="text-sm font-medium cursor-pointer">
                      Acepta mascotas
                    </label>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {mascotas ? "Sí" : "No"}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="fumador" 
                      checked={fumador} 
                      onCheckedChange={(checked) => setFumador(checked as boolean)} 
                    />
                    <label htmlFor="fumador" className="text-sm font-medium cursor-pointer">
                      Acepta fumadores
                    </label>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {fumador ? "Sí" : "No"}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <div className="text-xs text-muted-foreground">
              {intereses.length > 0 || ubicacion !== 'cualquiera' || horario !== 'cualquiera' || ordenado || mascotas || fumador ? 
                `Filtros activos: ${[
                  ubicacion !== 'cualquiera' ? `Ubicación: ${ubicacion}` : '',
                  horario !== 'cualquiera' ? `Horario: ${horario}` : '',
                  intereses.length > 0 ? `Intereses: ${intereses.join(', ')}` : '',
                  ordenado ? 'Persona ordenada' : '',
                  mascotas ? 'Acepta mascotas' : '',
                  fumador ? 'Acepta fumadores' : ''
                ].filter(Boolean).join(', ')}` : 
                'Sin filtros activos'}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClearFilters} size="sm">
                <X size={16} className="mr-2" />
                Limpiar filtros
              </Button>
              <Button onClick={handleApplyFilters} size="sm">
                <Filter size={16} className="mr-2" />
                Aplicar filtros
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchingFilters;
