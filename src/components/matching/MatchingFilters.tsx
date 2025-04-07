import React, { useState, useEffect } from 'react';
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
import { 
  Home, 
  DollarSign, 
  Filter, 
  Clock, 
  X, 
  Calendar,
  User,
  HeartHandshake
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface FilterValues {
  presupuesto?: [number, number];
  ubicacion?: string;
  rangoEdad?: string;
  fechaMudanza?: string;
  estiloVida?: string[];
  intereses?: string[];
  nivelLimpieza?: string;
  nivelRuido?: string;
  horarioHabitual?: string;
  invitados?: string;
  fumar?: string;
  mascotas?: string;
}

interface MatchingFiltersProps {
  onApplyFilters: (filters: FilterValues) => void;
  onClearFilters: () => void;
  className?: string;
  activeTab?: 'filtros' | 'preferencias';
}

const MatchingFilters: React.FC<MatchingFiltersProps> = ({
  onApplyFilters,
  onClearFilters,
  className,
  activeTab = 'filtros'
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [presupuesto, setPresupuesto] = useState<[number, number]>([300, 800]);
  const [ubicacion, setUbicacion] = useState<string>('todas');
  const [rangoEdad, setRangoEdad] = useState<string>('todas');
  const [fechaMudanza, setFechaMudanza] = useState<string>('cualquiera');
  const [estiloVida, setEstiloVida] = useState<string[]>([]);
  const [intereses, setIntereses] = useState<string[]>([]);
  
  const [nivelLimpieza, setNivelLimpieza] = useState<string>('alta');
  const [nivelRuido, setNivelRuido] = useState<string>('bajo');
  const [horarioHabitual, setHorarioHabitual] = useState<string>('madrugador');
  const [invitados, setInvitados] = useState<string>('frecuente');
  const [fumar, setFumar] = useState<string>('no');
  const [mascotas, setMascotas] = useState<string>('si');
  
  const [mostrarPreferencias, setMostrarPreferencias] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    setShowFilters(false);
    setMostrarPreferencias(false);
  }, [activeTab]);
  
  const toggleFilter = () => {
    setShowFilters(!showFilters);
  };
  
  const togglePreferencias = () => {
    setMostrarPreferencias(!mostrarPreferencias);
  };
  
  const handleApplyFilters = () => {
    onApplyFilters({
      presupuesto,
      ubicacion: ubicacion !== 'todas' ? ubicacion : undefined,
      rangoEdad: rangoEdad !== 'todas' ? rangoEdad : undefined,
      fechaMudanza: fechaMudanza !== 'cualquiera' ? fechaMudanza : undefined,
      estiloVida: estiloVida.length > 0 ? estiloVida : undefined,
      intereses: intereses.length > 0 ? intereses : undefined,
      nivelLimpieza,
      nivelRuido,
      horarioHabitual,
      invitados,
      fumar,
      mascotas
    });
  };
  
  const handleClearFilters = () => {
    setPresupuesto([300, 800]);
    setUbicacion('todas');
    setRangoEdad('todas');
    setFechaMudanza('cualquiera');
    setEstiloVida([]);
    setIntereses([]);
    setNivelLimpieza('alta');
    setNivelRuido('bajo');
    setHorarioHabitual('madrugador');
    setInvitados('frecuente');
    setFumar('no');
    setMascotas('si');
    onClearFilters();
  };
  
  const handleEstiloVidaToggle = (estilo: string) => {
    if (estiloVida.includes(estilo)) {
      setEstiloVida(estiloVida.filter(item => item !== estilo));
    } else {
      setEstiloVida([...estiloVida, estilo]);
    }
  };
  
  const handleInteresToggle = (interes: string) => {
    if (intereses.includes(interes)) {
      setIntereses(intereses.filter(item => item !== interes));
    } else {
      setIntereses([...intereses, interes]);
    }
  };
  
  return (
    <div className={className}>
      <div className="space-y-4 relative">
        {activeTab === 'filtros' && (
          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Filtros de búsqueda</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Ubicación</Label>
                    <Select value={ubicacion} onValueChange={setUbicacion}>
                      <SelectTrigger className="w-full bg-background h-9 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Home className="h-4 w-4" />
                          <SelectValue placeholder="Todas las ciudades" />
                        </div>
                      </SelectTrigger>
                      <SelectContent position="popper" className="bg-background z-50">
                        <SelectItem value="todas">Todas las ciudades</SelectItem>
                        <SelectItem value="Madrid">Madrid</SelectItem>
                        <SelectItem value="Barcelona">Barcelona</SelectItem>
                        <SelectItem value="Valencia">Valencia</SelectItem>
                        <SelectItem value="Sevilla">Sevilla</SelectItem>
                        <SelectItem value="Bilbao">Bilbao</SelectItem>
                        <SelectItem value="Málaga">Málaga</SelectItem>
                        <SelectItem value="Zaragoza">Zaragoza</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Rango de edad</Label>
                    <Select value={rangoEdad} onValueChange={setRangoEdad}>
                      <SelectTrigger className="w-full bg-background h-9 text-sm">
                        <div className="flex items-center gap-1.5">
                          <User className="h-4 w-4" />
                          <SelectValue placeholder="Todas las edades" />
                        </div>
                      </SelectTrigger>
                      <SelectContent position="popper" className="bg-background z-50">
                        <SelectItem value="todas">Todas las edades</SelectItem>
                        <SelectItem value="18-25">18-25 años</SelectItem>
                        <SelectItem value="26-30">26-30 años</SelectItem>
                        <SelectItem value="31-40">31-40 años</SelectItem>
                        <SelectItem value="41+">Más de 41 años</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Fecha de mudanza</Label>
                    <Select value={fechaMudanza} onValueChange={setFechaMudanza}>
                      <SelectTrigger className="w-full bg-background h-9 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          <SelectValue placeholder="Cualquier fecha" />
                        </div>
                      </SelectTrigger>
                      <SelectContent position="popper" className="bg-background z-50">
                        <SelectItem value="cualquiera">Cualquier fecha</SelectItem>
                        <SelectItem value="inmediata">Inmediata</SelectItem>
                        <SelectItem value="1-mes">Próximo mes</SelectItem>
                        <SelectItem value="3-meses">Próximos 3 meses</SelectItem>
                        <SelectItem value="6-meses">Próximos 6 meses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs font-medium flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4" />
                    Presupuesto: {presupuesto[0]}€ - {presupuesto[1]}€
                  </Label>
                  <div className="px-2 py-2">
                    <Slider 
                      value={presupuesto} 
                      min={100} 
                      max={1500} 
                      step={50} 
                      onValueChange={(value) => setPresupuesto(value as [number, number])}
                      className="bg-purple-100"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Estilo de vida</Label>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {[
                      { id: 'ordenado', label: 'Ordenado' },
                      { id: 'tranquilo', label: 'Tranquilo' },
                      { id: 'sociable', label: 'Sociable' },
                      { id: 'deportista', label: 'Deportista' },
                      { id: 'nocturno', label: 'Nocturno' },
                      { id: 'madrugador', label: 'Madrugador' },
                      { id: 'no-fumador', label: 'No fumador' },
                      { id: 'vegano', label: 'Vegano' }
                    ].map(estilo => (
                      <div key={estilo.id} className="inline-flex items-center justify-center">
                        <label className={`
                          flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs
                          ${estiloVida.includes(estilo.id) 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary text-secondary-foreground border border-input'}
                          cursor-pointer transition-colors
                        `}>
                          <input 
                            type="checkbox" 
                            className="sr-only" 
                            checked={estiloVida.includes(estilo.id)}
                            onChange={() => handleEstiloVidaToggle(estilo.id)}
                          />
                          {estilo.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-1">
                  <Button variant="outline" onClick={handleClearFilters} size="md">
                    Limpiar
                  </Button>
                  <Button onClick={handleApplyFilters} size="md" className="bg-violet-600 hover:bg-violet-700">
                    Aplicar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {activeTab === 'preferencias' && (
          <Card className="w-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-1.5">
                <HeartHandshake className="h-5 w-5 text-homi-purple" />
                Mis preferencias de convivencia
              </CardTitle>
              <CardDescription className="text-xs">
                Configura tus preferencias para mejorar tus coincidencias.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="font-medium text-sm">Estilo de vida</h3>
                    
                    <div className="space-y-1">
                      <Label className="text-xs">Nivel de limpieza</Label>
                      <Select value={nivelLimpieza} onValueChange={setNivelLimpieza}>
                        <SelectTrigger className="bg-background h-9 text-sm">
                          <SelectValue placeholder="Selecciona nivel de limpieza" />
                        </SelectTrigger>
                        <SelectContent position="popper" className="bg-background z-50">
                          <SelectItem value="alta">Alta - Me gusta tener todo muy limpio</SelectItem>
                          <SelectItem value="media">Media - Limpio con regularidad</SelectItem>
                          <SelectItem value="baja">Baja - No soy muy estricto con la limpieza</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs">Nivel de ruido</Label>
                      <Select value={nivelRuido} onValueChange={setNivelRuido}>
                        <SelectTrigger className="bg-background h-9 text-sm">
                          <SelectValue placeholder="Selecciona nivel de ruido" />
                        </SelectTrigger>
                        <SelectContent position="popper" className="bg-background z-50">
                          <SelectItem value="bajo">Bajo - Prefiero ambiente tranquilo</SelectItem>
                          <SelectItem value="moderado">Moderado - Algo de ruido no me molesta</SelectItem>
                          <SelectItem value="alto">Alto - No me importa el ruido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs">Horario habitual</Label>
                      <Select value={horarioHabitual} onValueChange={setHorarioHabitual}>
                        <SelectTrigger className="bg-background h-9 text-sm">
                          <SelectValue placeholder="Selecciona tu horario habitual" />
                        </SelectTrigger>
                        <SelectContent position="popper" className="bg-background z-50">
                          <SelectItem value="madrugador">Madrugador - Me levanto temprano</SelectItem>
                          <SelectItem value="normal">Normal - Horarios estándar</SelectItem>
                          <SelectItem value="nocturno">Nocturno - Soy más de noche</SelectItem>
                          <SelectItem value="flexible">Flexible - No tengo un horario fijo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium text-sm">Preferencias de vivienda</h3>
                    
                    <div className="space-y-1">
                      <Label className="text-xs">Invitados</Label>
                      <Select value={invitados} onValueChange={setInvitados}>
                        <SelectTrigger className="bg-background h-9 text-sm">
                          <SelectValue placeholder="Frecuencia de invitados" />
                        </SelectTrigger>
                        <SelectContent position="popper" className="bg-background z-50">
                          <SelectItem value="frecuente">Frecuente - Me gusta invitar amigos</SelectItem>
                          <SelectItem value="ocasional">Ocasional - De vez en cuando</SelectItem>
                          <SelectItem value="raro">Raro - Casi nunca tengo invitados</SelectItem>
                          <SelectItem value="nunca">Nunca - Prefiero no tener invitados</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs">Fumar</Label>
                      <Select value={fumar} onValueChange={setFumar}>
                        <SelectTrigger className="bg-background h-9 text-sm">
                          <SelectValue placeholder="Preferencia sobre fumar" />
                        </SelectTrigger>
                        <SelectContent position="popper" className="bg-background z-50">
                          <SelectItem value="no">No - Prefiero ambientes sin humo</SelectItem>
                          <SelectItem value="exterior">Exterior - Solo en terrazas o balcones</SelectItem>
                          <SelectItem value="si">Sí - No me importa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs">Mascotas</Label>
                      <Select value={mascotas} onValueChange={setMascotas}>
                        <SelectTrigger className="bg-background h-9 text-sm">
                          <SelectValue placeholder="Preferencia sobre mascotas" />
                        </SelectTrigger>
                        <SelectContent position="popper" className="bg-background z-50">
                          <SelectItem value="si">Me encantan - No hay problema</SelectItem>
                          <SelectItem value="algunas">Algunas - Depende del tipo</SelectItem>
                          <SelectItem value="no">No - Prefiero sin mascotas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs font-medium flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4" />
                    Presupuesto: {presupuesto[0]}€ - {presupuesto[1]}€
                  </Label>
                  <div className="px-2 py-2">
                    <Slider 
                      value={presupuesto} 
                      min={100} 
                      max={1500} 
                      step={50} 
                      onValueChange={(value) => setPresupuesto(value as [number, number])}
                      className="bg-purple-100"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs font-medium">Intereses personales</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 mt-1">
                    {[
                      { id: 'musica', label: 'Música' },
                      { id: 'cine', label: 'Cine' },
                      { id: 'lectura', label: 'Lectura' },
                      { id: 'deportes', label: 'Deportes' },
                      { id: 'cocina', label: 'Cocina' },
                      { id: 'videojuegos', label: 'Videojuegos' },
                      { id: 'arte', label: 'Arte' },
                      { id: 'viajes', label: 'Viajes' },
                      { id: 'tecnologia', label: 'Tecnología' },
                      { id: 'fotografia', label: 'Fotografía' }
                    ].map(interes => (
                      <div key={interes.id} className="inline-flex items-center">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <Checkbox 
                            id={`interes-${interes.id}`}
                            checked={intereses.includes(interes.id)}
                            onCheckedChange={() => handleInteresToggle(interes.id)}
                            className="h-3.5 w-3.5"
                          />
                          <span className="text-xs">{interes.label}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-1">
                  <Button variant="outline" onClick={handleClearFilters} size="md">
                    Restaurar
                  </Button>
                  <Button onClick={handleApplyFilters} size="md" className="bg-violet-600 hover:bg-violet-700">
                    Guardar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MatchingFilters;
