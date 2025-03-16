
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BrainCircuit, 
  Users, 
  Building, 
  Target, 
  PieChart, 
  TrendingUp, 
  CheckCircle, 
  Sparkles, 
  UserRound, 
  BarChart3,
  Rocket,
  ChevronDown,
  ChevronUp,
  ChevronRight
} from 'lucide-react';

const Presentation = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = document.querySelectorAll('[data-section-id]');
      sectionElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const sectionId = el.getAttribute('data-section-id');
        
        if (rect.top < window.innerHeight * 0.75 && rect.bottom > 0 && sectionId) {
          setVisibleSections(prev => new Set([...prev, sectionId]));
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleSection = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
      // Scroll to section
      const element = document.querySelector(`[data-section-id="${section}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };
  
  // Style variations by section
  const getSectionStyle = (sectionId: string) => {
    const styles: Record<string, string> = {
      problema: "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/20",
      solucion: "bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/20",
      producto: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/20",
      mercado: "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20",
      modelo: "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/20",
      competencia: "bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-950/30 dark:to-fuchsia-950/20",
      plan: "bg-gradient-to-br from-green-50 to-lime-50 dark:from-green-950/30 dark:to-lime-950/20",
      validacion: "bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/20",
      necesidades: "bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/20",
      equipo: "bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/20",
      vision: "bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/20",
    };
    
    return styles[sectionId] || "bg-white dark:bg-black/20";
  };
  
  // Accent color variations by section
  const getSectionAccentColor = (sectionId: string) => {
    const colors: Record<string, string> = {
      problema: "text-red-600 dark:text-red-400",
      solucion: "text-purple-600 dark:text-purple-400",
      producto: "text-blue-600 dark:text-blue-400",
      mercado: "text-emerald-600 dark:text-emerald-400",
      modelo: "text-amber-600 dark:text-amber-400",
      competencia: "text-violet-600 dark:text-violet-400",
      plan: "text-green-600 dark:text-green-400",
      validacion: "text-sky-600 dark:text-sky-400",
      necesidades: "text-rose-600 dark:text-rose-400",
      equipo: "text-teal-600 dark:text-teal-400",
      vision: "text-indigo-600 dark:text-indigo-400",
    };
    
    return colors[sectionId] || "text-homi-purple";
  };
  
  // Border color variations by section
  const getSectionBorderColor = (sectionId: string) => {
    const colors: Record<string, string> = {
      problema: "border-red-200 dark:border-red-800/50",
      solucion: "border-purple-200 dark:border-purple-800/50",
      producto: "border-blue-200 dark:border-blue-800/50",
      mercado: "border-emerald-200 dark:border-emerald-800/50",
      modelo: "border-amber-200 dark:border-amber-800/50",
      competencia: "border-violet-200 dark:border-violet-800/50",
      plan: "border-green-200 dark:border-green-800/50",
      validacion: "border-sky-200 dark:border-sky-800/50",
      necesidades: "border-rose-200 dark:border-rose-800/50",
      equipo: "border-teal-200 dark:border-teal-800/50",
      vision: "border-indigo-200 dark:border-indigo-800/50",
    };
    
    return colors[sectionId] || "border-gray-200 dark:border-gray-800/50";
  };
  
  // Display styles for sections
  const getSectionDisplayStyle = (sectionId: string) => {
    switch (sectionId) {
      case 'problema':
        return 'grid-section';
      case 'solucion':
        return 'feature-section';
      case 'producto':
        return 'list-section';
      case 'mercado':
        return 'stats-section';
      case 'modelo':
        return 'table-section';
      case 'competencia':
        return 'comparison-section';
      case 'plan':
        return 'timeline-section';
      case 'validacion':
        return 'grid-section';
      case 'necesidades':
        return 'card-section';
      case 'equipo':
        return 'profile-section';
      case 'vision':
        return 'vision-section';
      default:
        return 'standard-section';
    }
  };
  
  return (
    <section id="presentation" className="py-20 bg-gradient-to-b from-white to-homi-ultraLightPurple/30 dark:from-homi-dark dark:to-homi-dark/80">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nuestra <span className="homi-gradient-text">Propuesta</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Descubre cómo Homi está revolucionando el mercado de alquiler para estudiantes y jóvenes profesionales.
          </p>
        </div>
        
        {/* Navigation Pills - Horizontal scrolling on mobile */}
        <div className="flex overflow-x-auto pb-4 mb-12 -mx-4 px-4 snap-x scroll-px-4 scrollbar-hide">
          <div className="flex gap-3 mx-auto">
            {sections.map((section) => (
              <div key={section.id} className="snap-start">
                <Button
                  variant={activeSection === section.id ? "default" : "outline"}
                  className={`whitespace-nowrap rounded-full transition-all ${
                    activeSection === section.id 
                      ? `bg-${section.id === "solucion" ? "homi-purple" : getSectionAccentColor(section.id).replace('text-', 'bg-').replace('dark:', '')} text-white` 
                      : `hover:bg-${getSectionAccentColor(section.id).replace('text-', 'bg-').replace('dark:', '')}/10`
                  }`}
                  onClick={() => toggleSection(section.id)}
                >
                  <section.icon className="mr-2 h-4 w-4" />
                  {section.title}
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Content Sections */}
        <div className="space-y-32">
          {sections.map((section) => {
            const isVisible = visibleSections.has(section.id);
            const isCurrent = activeSection === section.id;
            
            return (
              <div 
                key={section.id}
                data-section-id={section.id}
                className={`transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                {/* Section header with unique styling */}
                <div className={`rounded-3xl overflow-hidden shadow-lg mb-12 border ${getSectionBorderColor(section.id)}`}>
                  <div className={`${getSectionStyle(section.id)} p-8 transition-all duration-300`}>
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                      <div className={`rounded-full h-20 w-20 flex items-center justify-center ${getSectionAccentColor(section.id).replace('text-', 'bg-').replace('dark:', '')} bg-opacity-20 dark:bg-opacity-30 shrink-0`}>
                        <section.icon className={`h-10 w-10 ${getSectionAccentColor(section.id)}`} />
                      </div>
                      
                      <div className="text-center md:text-left">
                        <h2 className={`text-3xl font-bold mb-2 ${getSectionAccentColor(section.id)}`}>
                          {section.title}
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                          {section.subtitle}
                        </p>
                      </div>
                      
                      <div className="md:ml-auto flex items-center">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className={`rounded-full ${getSectionAccentColor(section.id)} hover:bg-opacity-20`}
                          onClick={() => toggleSection(section.id)}
                        >
                          {isCurrent ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Section content with different display styles */}
                <div className={`transition-all duration-500 overflow-hidden ${
                  isCurrent || activeSection === null
                    ? "max-h-[5000px] opacity-100" 
                    : "max-h-0 opacity-0"
                }`}>
                  <div className={`py-6 px-4 md:px-8 ${getSectionDisplayStyle(section.id)}`}>
                    {section.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Call to Action */}
        <div className="mt-32 text-center animate-on-scroll bg-gradient-to-r from-homi-purple/90 to-homi-lightPurple/90 p-12 rounded-3xl shadow-xl text-white">
          <h3 className="text-3xl font-bold mb-4">
            ¿Quieres saber más sobre <span className="text-white">Homi</span>?
          </h3>
          <p className="text-white/80 text-lg mb-6 max-w-2xl mx-auto">
            Estamos transformando la forma en que los estudiantes y jóvenes profesionales encuentran su hogar ideal.
          </p>
          <Button 
            size="lg"
            className="bg-white text-homi-purple hover:bg-white/90 rounded-full px-8 py-6 text-lg mt-4 shadow-md hover:shadow-lg transition-all"
          >
            Contáctanos <ChevronRight className="ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

// Section data
const sections = [
  {
    id: "problema",
    title: "Problema",
    subtitle: "¿Qué problema real solucionamos a nuestros clientes?",
    icon: Users,
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">📌 Para los Inquilinos (Estudiantes y Jóvenes Profesionales):</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-red-200 dark:border-red-800/30 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <Badge variant="destructive" className="mb-3">Problema</Badge>
                <p className="text-base">Dificultad para encontrar compañeros de piso compatibles.</p>
              </CardContent>
            </Card>
            <Card className="border-red-200 dark:border-red-800/30 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <Badge variant="destructive" className="mb-3">Problema</Badge>
                <p className="text-base">Pérdida de tiempo y esfuerzo en la búsqueda de vivienda.</p>
              </CardContent>
            </Card>
            <Card className="border-red-200 dark:border-red-800/30 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <Badge variant="destructive" className="mb-3">Problema</Badge>
                <p className="text-base">Falta de seguridad y confianza en los procesos de alquiler.</p>
              </CardContent>
            </Card>
            <Card className="border-red-200 dark:border-red-800/30 hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <Badge variant="destructive" className="mb-3">Problema</Badge>
                <p className="text-base">Gestión manual de pagos y contratos.</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Card className="border-homi-purple/20 bg-red-50/50 dark:bg-red-950/10 shadow-md">
          <CardContent className="p-8">
            <p className="font-medium text-lg flex items-center">
              <span className="text-red-600 bg-red-100 dark:bg-red-900/30 rounded-full p-2 mr-3 flex-shrink-0">👉</span> 
              <span>El proceso de alquiler es ineficiente, inseguro y requiere múltiples plataformas.</span>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  },
  {
    id: "solucion",
    title: "Solución",
    subtitle: "¿Cuál es la USP (Propuesta Única de Valor)?",
    icon: Sparkles,
    content: (
      <div className="space-y-8">
        <Card className="border-homi-purple/20 bg-homi-ultraLightPurple/20 shadow-md">
          <CardContent className="p-8">
            <p className="font-semibold text-xl text-center">
              <span className="homi-gradient-text text-xl">🚀</span> Homi es la plataforma todo-en-uno para estudiantes y jóvenes que simplifica el proceso de alquiler y convivencia.
            </p>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-purple-200 dark:border-purple-800/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-4">
                  <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-purple-600 dark:text-purple-400">Matching Inteligente</h4>
                  <p className="text-base text-muted-foreground">Encuentra compañeros de piso compatibles basados en intereses y hábitos de convivencia.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-purple-200 dark:border-purple-800/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-4">
                  <Building className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-purple-600 dark:text-purple-400">Búsqueda Personalizada</h4>
                  <p className="text-base text-muted-foreground">Homi actúa como agencia y filtra las mejores opciones para el grupo.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-purple-200 dark:border-purple-800/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-4">
                  <CheckCircle className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-purple-600 dark:text-purple-400">Intermediación Segura</h4>
                  <p className="text-base text-muted-foreground">Validación de perfiles y mediación con propietarios para garantizar seguridad.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-purple-200 dark:border-purple-800/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-4">
                  <BrainCircuit className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2 text-purple-600 dark:text-purple-400">Contrato Digital</h4>
                  <p className="text-base text-muted-foreground">Automatización de procesos clave para eliminar fricciones.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="border-green-200 dark:border-green-800/30 bg-green-50/50 dark:bg-green-950/10 shadow-md">
          <CardContent className="p-8 flex items-center">
            <span className="text-green-600 bg-green-100 dark:bg-green-900/30 rounded-full p-3 mr-4 flex-shrink-0">
              <CheckCircle className="h-6 w-6" />
            </span>
            <p className="font-medium text-lg">Homi revoluciona el alquiler para inquilinos, asegurando rapidez, seguridad y comodidad.</p>
          </CardContent>
        </Card>
      </div>
    )
  },
  {
    id: "producto",
    title: "Producto",
    subtitle: "¿En qué consiste esa solución? (MVP)",
    icon: BrainCircuit,
    content: (
      <div className="space-y-6">
        <Card className="border-blue-200 dark:border-blue-800/30 bg-blue-50/50 dark:bg-blue-950/10 shadow-md mb-8">
          <CardContent className="p-8">
            <p className="font-semibold text-xl flex items-center justify-center">
              <span className="text-blue-600 bg-blue-100 dark:bg-blue-900/30 rounded-full p-3 mr-3 flex-shrink-0">
                <Target className="h-6 w-6" />
              </span>
              <span>Homi integra en una sola plataforma:</span>
            </p>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { num: "1️⃣", title: "Matching entre compañeros", desc: "Encuentra roommates ideales según compatibilidad." },
            { num: "2️⃣", title: "Propiedades sugeridas", desc: "Homi encuentra y recomienda pisos según el grupo." },
            { num: "3️⃣", title: "Intermediación segura", desc: "Validación de perfiles y negociación con propietarios." },
            { num: "4️⃣", title: "Firma de contrato digital", desc: "Todo el proceso es legal, digital y automatizado." },
            { num: "5️⃣", title: "Gestión de pagos", desc: "Automatización del pago del alquiler y división de gastos." },
            { num: "6️⃣", title: "Servicios adicionales", desc: "Acceso a seguros, mudanzas, internet y limpieza." }
          ].map((item, i) => (
            <div key={i} className="flex flex-col p-6 rounded-xl bg-white dark:bg-gray-900/50 border border-blue-100 dark:border-blue-900/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="text-blue-600 dark:text-blue-400 text-3xl font-bold">{item.num}</div>
                <h4 className="text-xl font-semibold text-blue-700 dark:text-blue-300">{item.title}</h4>
              </div>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
        
        <Card className="border-green-200 dark:border-green-800/30 bg-green-50/50 dark:bg-green-950/10 shadow-md mt-6">
          <CardContent className="p-8 flex items-center justify-center">
            <span className="text-green-600 bg-green-100 dark:bg-green-900/30 rounded-full p-3 mr-4 flex-shrink-0">
              <CheckCircle className="h-6 w-6" />
            </span>
            <p className="font-medium text-lg">MVP validado en pilotos con usuarios reales.</p>
          </CardContent>
        </Card>
      </div>
    )
  },
  {
    id: "mercado",
    title: "Mercado",
    subtitle: "TAM, SAM, SOM",
    icon: Target,
    content: (
      <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-emerald-200 dark:border-emerald-800/30 overflow-hidden">
            <div className="bg-emerald-600 dark:bg-emerald-800 p-4 text-white text-center">
              <Badge className="bg-white text-emerald-600 mb-1 hover:bg-white/90">TAM</Badge>
              <h3 className="text-3xl font-bold">€2.500M</h3>
            </div>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Mercado Total Disponible en alquiler estudiantil en España</p>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-200 dark:border-emerald-800/30 overflow-hidden">
            <div className="bg-emerald-600 dark:bg-emerald-800 p-4 text-white text-center">
              <Badge className="bg-white text-emerald-600 mb-1 hover:bg-white/90">SAM</Badge>
              <h3 className="text-3xl font-bold">€1.750M</h3>
            </div>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">Mercado Disponible en ciudades universitarias</p>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-200 dark:border-emerald-800/30 overflow-hidden">
            <div className="bg-emerald-600 dark:bg-emerald-800 p-4 text-white text-center">
              <Badge className="bg-white text-emerald-600 mb-1 hover:bg-white/90">SOM</Badge>
              <h3 className="text-3xl font-bold">€87M</h3>
            </div>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">5% de captación en los primeros 3 años</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-emerald-200 dark:border-emerald-800/30 bg-white dark:bg-black/20">
            <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 border-b border-emerald-200 dark:border-emerald-900/30">
              <h4 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300">Target</h4>
            </div>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-emerald-50/50 dark:bg-emerald-950/10 rounded-lg">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-3 rounded-full mr-4 flex-shrink-0">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <strong className="block text-emerald-700 dark:text-emerald-300 text-lg">Target Primario:</strong>
                    <span className="text-muted-foreground">1.5M de estudiantes universitarios en España.</span>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-emerald-50/50 dark:bg-emerald-950/10 rounded-lg">
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-3 rounded-full mr-4 flex-shrink-0">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <strong className="block text-emerald-700 dark:text-emerald-300 text-lg">Target Secundario:</strong>
                    <span className="text-muted-foreground">Jóvenes profesionales en búsqueda de pisos compartidos.</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-emerald-200 dark:border-emerald-800/30 bg-white dark:bg-black/20">
            <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 border-b border-emerald-200 dark:border-emerald-900/30">
              <h4 className="text-xl font-semibold text-emerald-700 dark:text-emerald-300">Tendencias</h4>
            </div>
            <CardContent className="p-6">
              <div className="space-y-3">
                {[
                  "Crecimiento de la demanda de alquiler entre jóvenes.",
                  "Digitalización del sector inmobiliario.",
                  "Expansión del modelo de \"coliving\" y plataformas de gestión digital."
                ].map((trend, i) => (
                  <div key={i} className="flex items-center p-3 bg-emerald-50/50 dark:bg-emerald-950/10 rounded-lg">
                    <div className="text-emerald-600 dark:text-emerald-400 mr-3">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <span className="text-muted-foreground">{trend}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  },
  {
    id: "modelo",
    title: "Modelo de Negocio",
    subtitle: "¿Cómo ganamos dinero?",
    icon: BarChart3,
    content: (
      <div className="space-y-8">
        <Card className="border-amber-200 dark:border-amber-800/30 bg-amber-50/50 dark:bg-amber-950/10 shadow-md">
          <CardContent className="p-8">
            <p className="font-semibold text-xl flex items-center justify-center">
              <span className="text-amber-600 bg-amber-100 dark:bg-amber-900/30 rounded-full p-3 mr-3 flex-shrink-0">💰</span>
              <span>Homi monetiza en cada etapa del alquiler:</span>
            </p>
          </CardContent>
        </Card>
        
        <div className="overflow-hidden rounded-xl border border-amber-200 dark:border-amber-800/30 shadow-lg">
          <div className="bg-gradient-to-r from-amber-500 to-yellow-500 dark:from-amber-600 dark:to-yellow-600 text-white p-4">
            <h3 className="text-xl font-bold text-center">Modelo de Monetización</h3>
          </div>
          <div className="bg-white dark:bg-gray-900">
            <table className="min-w-full divide-y divide-amber-200 dark:divide-amber-800/30">
              <thead className="bg-amber-50 dark:bg-amber-950/30">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-amber-800 dark:text-amber-200 uppercase tracking-wider">Servicio</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-amber-800 dark:text-amber-200 uppercase tracking-wider">Monetización</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100 dark:divide-amber-800/20">
                {[
                  { service: "Matching entre compañeros", model: "Suscripción premium para acceso a más opciones y filtros avanzados." },
                  { service: "Búsqueda de propiedades", model: "Comisión por reservas de vivienda a través de Homi." },
                  { service: "Intermediación", model: "Tarifa por validación de inquilinos y seguridad en el proceso." },
                  { service: "Firma de contratos", model: "Comisión por la gestión del contrato y firma electrónica." },
                  { service: "Pagos automatizados", model: "Comisión en cada transacción de alquiler gestionada por Homi." },
                  { service: "Servicios adicionales", model: "Ingresos por cada servicio contratado (mudanzas, limpieza, seguros)." }
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-amber-50/50 dark:hover:bg-amber-950/10 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium">{item.service}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{item.model}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <Card className="border-amber-200 dark:border-amber-800/30 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/20">
          <CardContent className="p-8">
            <p className="font-medium text-lg flex items-center justify-center">
              <span className="text-amber-600 bg-amber-100 dark:bg-amber-900/30 rounded-full p-3 mr-3 flex-shrink-0">
                <Rocket className="h-6 w-6" />
              </span>
              <span>Escalabilidad garantizada con ingresos recurrentes.</span>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  },
  {
    id: "competencia",
    title: "Benchmarking",
    subtitle: "¿En qué nos diferenciamos de la competencia?",
    icon: TrendingUp,
    content: (
      <div className="space-y-10">
        <div>
          <h3 className="text-xl font-semibold mb-6 flex items-center text-violet-700 dark:text-violet-300">
            <span className="bg-violet-100 dark:bg-violet-900/30 p-2 rounded-full mr-3">
              <TrendingUp className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </span>
            Competidores Actuales:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { name: "Idealista & Fotocasa", desc: "Solo anuncios, sin gestión ni matching." },
              { name: "Badi", desc: "Matching de compañeros, pero sin agencia ni herramientas de alquiler." },
              { name: "Uniplaces & Spotahome", desc: "Enfocados en alquiler internacional con altas comisiones." },
              { name: "Inmobiliarias tradicionales", desc: "Costosas, lentas y sin digitalización." }
            ].map((comp, i) => (
              <div key={i} className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/10 rounded-xl p-1">
                <Card className="border-0 h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <Badge variant="destructive" className="w-fit mb-3">Competidor</Badge>
                    <h4 className="text-lg font-semibold mb-2">{comp.name}</h4>
                    <p className="text-muted-foreground mt-auto">{comp.desc}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-6 flex items-center text-violet-700 dark:text-violet-300">
            <span className="bg-violet-100 dark:bg-violet-900/30 p-2 rounded-full mr-3">
              <Sparkles className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </span>
            Diferenciación de Homi:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              "Matching + Agencia Digital + Gestión del Alquiler en un solo ecosistema.",
              "Perfiles filtrados y verificados para máxima seguridad.",
              "Automatización de pagos, contratos y seguros sin intermediarios.",
              "Acceso a servicios complementarios dentro de la app."
            ].map((diff, i) => (
              <div key={i} className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/10 rounded-xl p-1">
                <Card className="border-0 h-full">
                  <CardContent className="p-6 flex items-start h-full">
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-2 rounded-full mr-3 flex-shrink-0 mt-1">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <p className="font-medium">{diff}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
        
        <Card className="border-violet-200 dark:border-violet-800/30 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/20 shadow-lg">
          <CardContent className="p-8">
            <p className="font-medium text-lg flex items-center justify-center">
              <span className="text-violet-600 bg-violet-100 dark:bg-violet-900/30 rounded-full p-3 mr-3 flex-shrink-0">
                <Target className="h-6 w-6" />
              </span>
              <span>Resultado: Un alquiler más rápido, seguro y eficiente para inquilinos.</span>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  },
  {
    id: "plan",
    title: "Plan",
    subtitle: "¿Cómo lo vamos a conseguir?",
    icon: PieChart,
    content: (
      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-green-200 dark:bg-green-800/30 transform -translate-x-1/2 z-0 hidden md:block"></div>
        
        <div className="space-y-16 relative z-10">
          {[
            {
              phase: 1,
              title: "Fase 1: MVP y Validación",
              timeframe: "0-6 meses",
              color: "green",
              items: [
                "Lanzamiento en Madrid, Barcelona y Valencia.",
                "Pruebas piloto con 500 estudiantes y 100 propietarios.",
                "Campañas de adquisición en universidades y redes sociales."
              ]
            },
            {
              phase: 2,
              title: "Fase 2: Expansión Nacional",
              timeframe: "6-12 meses",
              color: "emerald",
              items: [
                "Expansión a más ciudades universitarias.",
                "Integración con servicios financieros y aseguradoras.",
                "Primeros 10.000 usuarios activos."
              ]
            },
            {
              phase: 3,
              title: "Fase 3: Monetización y Escalabilidad",
              timeframe: "12-24 meses",
              color: "teal",
              items: [
                "Expansión internacional (Francia, Alemania, Italia).",
                "Ampliación de servicios dentro de Homi.",
                "Consolidación como la principal alternativa a inmobiliarias tradicionales."
              ]
            }
          ].map((phase, i) => (
            <div key={i} className={`flex flex-col md:flex-row gap-8 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="md:w-24 flex items-center justify-center">
                <div className={`w-16 h-16 rounded-full bg-${phase.color}-100 dark:bg-${phase.color}-900/30 flex items-center justify-center text-${phase.color}-600 dark:text-${phase.color}-400 text-xl font-bold border-4 border-${phase.color}-200 dark:border-${phase.color}-800/50 z-20`}>
                  {phase.phase}
                </div>
              </div>
              
              <div className="flex-1">
                <Card className={`border-${phase.color}-200 dark:border-${phase.color}-800/30 shadow-lg overflow-hidden`}>
                  <div className={`bg-${phase.color}-600 dark:bg-${phase.color}-700 p-4 text-white`}>
                    <h3 className="text-xl font-bold">{phase.title}</h3>
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 mt-1">{phase.timeframe}</Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {phase.items.map((item, j) => (
                        <div key={j} className="flex items-start">
                          <div className={`p-1.5 rounded-full bg-${phase.color}-100 dark:bg-${phase.color}-900/30 text-${phase.color}-600 dark:text-${phase.color}-400 mr-3 flex-shrink-0 mt-0.5`}>
                            <CheckCircle className="h-4 w-4" />
                          </div>
                          <p className="text-base text-muted-foreground">{item}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: "validacion",
    title: "Validación",
    subtitle: "¿Qué hemos validado ya?",
    icon: CheckCircle,
    content: (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Mercado con demanda comprobada",
              desc: "Encuestas y tendencias del sector.",
              icon: <Target className="h-8 w-8 text-sky-600 dark:text-sky-400" />
            },
            {
              title: "Primeros usuarios registrados",
              desc: "Pruebas piloto en universidades.",
              icon: <Users className="h-8 w-8 text-sky-600 dark:text-sky-400" />
            },
            {
              title: "Interés de propietarios",
              desc: "Acuerdos potenciales.",
              icon: <Building className="h-8 w-8 text-sky-600 dark:text-sky-400" />
            },
            {
              title: "Modelo de negocio",
              desc: "Basado en ingresos recurrentes.",
              icon: <BarChart3 className="h-8 w-8 text-sky-600 dark:text-sky-400" />
            }
          ].map((item, i) => (
            <div key={i} className="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-950/20 dark:to-blue-950/10 p-1 rounded-xl">
              <Card className="border-0 h-full">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <div className="bg-sky-100 dark:bg-sky-900/30 p-3 rounded-full mr-3 flex-shrink-0">
                      {item.icon}
                    </div>
                    <h4 className="text-xl font-semibold text-sky-700 dark:text-sky-300">{item.title}</h4>
                  </div>
                  <div className="bg-white dark:bg-black/20 p-5 rounded-lg border border-sky-100 dark:border-sky-900/20 mt-auto">
                    <p className="text-muted-foreground flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      {item.desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        <Card className="border-sky-200 dark:border-sky-800/30 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/20 shadow-lg">
          <CardContent className="p-8">
            <p className="font-medium text-lg flex items-center justify-center">
              <span className="text-sky-600 bg-sky-100 dark:bg-sky-900/30 rounded-full p-3 mr-3 flex-shrink-0">
                <Rocket className="h-6 w-6" />
              </span>
              <span>Próximo paso: Inversión para escalar tecnología y adquisición de usuarios.</span>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  },
  {
    id: "necesidades",
    title: "Necesidades",
    subtitle: "¿Qué necesitamos?",
    icon: Target,
    content: (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              icon: <BarChart3 className="w-12 h-12 text-rose-600 dark:text-rose-400" />, 
              title: "Inversión", 
              desc: "€500K para desarrollo tecnológico, marketing y crecimiento." 
            },
            { 
              icon: <BrainCircuit className="w-12 h-12 text-rose-600 dark:text-rose-400" />, 
              title: "Equipo", 
              desc: "CTO con experiencia en plataformas digitales." 
            },
            { 
              icon: <Users className="w-12 h-12 text-rose-600 dark:text-rose-400" />, 
              title: "Partners estratégicos", 
              desc: "Aseguradoras y bancos para soluciones financieras." 
            }
          ].map((need, i) => (
            <div key={i} className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/10 p-1 rounded-xl">
              <Card className="border-0 h-full">
                <CardContent className="p-8 flex flex-col items-center text-center h-full">
                  <div className="w-24 h-24 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mb-6">
                    {need.icon}
                  </div>
                  <h4 className="text-2xl font-semibold mb-3 text-rose-700 dark:text-rose-300">{need.title}</h4>
                  <p className="text-muted-foreground">{need.desc}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        <Card className="border-rose-200 dark:border-rose-800/30 bg-gradient-to-r from-rose-100 to-pink-100 dark:from-rose-950/30 dark:to-pink-950/20 shadow-lg">
          <CardContent className="p-8 text-center">
            <p className="font-semibold text-xl">
              <span className="text-rose-600 dark:text-rose-400">📌</span> Oportunidad única: Homi está listo para transformar el mercado del alquiler.
            </p>
            <Button className="mt-6 bg-rose-600 hover:bg-rose-700 text-white rounded-full px-6 py-2 text-lg">
              Conoce más sobre la inversión
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  },
  {
    id: "equipo",
    title: "Equipo",
    subtitle: "¿Quiénes somos?",
    icon: UserRound,
    content: (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {[
            { 
              emoji: "👨‍💻", 
              name: "Fernando Gamero Martín", 
              role: "UX/UI Designer",
              desc: "Experiencia en productos digitales."
            },
            { 
              emoji: "👨‍🎨", 
              name: "José Antonio Serrano", 
              role: "Branding Specialist",
              desc: "Especialista en branding y diseño de productos."
            },
            { 
              emoji: "📊", 
              name: "Cristian Villegas", 
              role: "Business Strategist",
              desc: "Estrategia de negocio y marketing digital con experiencia en startups."
            }
          ].map((member, i) => (
            <div key={i} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-teal-300 to-emerald-500 dark:from-teal-600 dark:to-emerald-800 rounded-2xl blur-sm opacity-75 group-hover:opacity-100 transition-all duration-300 -z-10 transform group-hover:scale-[1.02]"></div>
              <Card className="border-0 overflow-hidden h-full transform transition-all duration-300 group-hover:-translate-y-1">
                <div className="pt-10 pb-6 px-6 flex flex-col items-center justify-center bg-white dark:bg-black/60">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 dark:from-teal-600 dark:to-emerald-700 flex items-center justify-center mb-4 text-4xl shadow-xl">
                    {member.emoji}
                  </div>
                  <h4 className="text-2xl font-bold mb-2 text-teal-800 dark:text-teal-200 text-center">{member.name}</h4>
                  <Badge className="bg-teal-100 hover:bg-teal-200 text-teal-800 border-0 mb-2">
                    {member.role}
                  </Badge>
                </div>
                <CardContent className="p-6 bg-gradient-to-b from-white to-teal-50 dark:from-black/60 dark:to-teal-950/30 text-center">
                  <p className="text-muted-foreground">{member.desc}</p>
                  <div className="flex justify-center space-x-4 mt-4">
                    <Button variant="outline" size="sm" className="rounded-full border-teal-200 dark:border-teal-700">
                      LinkedIn
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full border-teal-200 dark:border-teal-700">
                      Twitter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        <Card className="border-teal-200 dark:border-teal-800/30 bg-gradient-to-r from-teal-500 to-emerald-600 dark:from-teal-600 dark:to-emerald-700 shadow-xl">
          <CardContent className="p-10 text-center text-white">
            <p className="font-bold text-2xl mb-6">
              <span className="text-white">🚀</span> Un equipo con experiencia en tecnología, diseño y escalabilidad de startups.
            </p>
            <Button 
              className="bg-white text-teal-600 hover:bg-white/90 rounded-full px-8 py-6 text-lg shadow-lg"
            >
              Únete a la revolución del alquiler con Homi
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  },
  {
    id: "vision",
    title: "Visión a Futuro",
    subtitle: "La Evolución de Homi",
    icon: Rocket,
    content: (
      <div>
        <Card className="border-indigo-200 dark:border-indigo-800/30 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 mb-10 overflow-hidden">
          <CardContent className="p-10 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Rocket className="h-12 w-12" />
              </div>
              <p className="font-bold text-xl md:text-2xl">
                Nuestra visión a largo plazo es convertir a Homi en un ecosistema integral del alquiler, separando la experiencia de inquilinos y propietarios en dos plataformas especializadas.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="group relative transform transition-all duration-500 hover:scale-[1.02]">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <Card className="relative h-full border-0">
              <CardContent className="p-8">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/20 rounded-xl p-4 mb-6">
                  <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-2 flex items-center">
                    <span className="text-xl mr-2">🔹</span> Solución Integral e Interconectada
                  </h3>
                </div>
                <p className="text-lg text-muted-foreground">
                  Homi revoluciona el mercado del alquiler con un ecosistema dual que resuelve los problemas tanto de inquilinos como de propietarios, integrando sus soluciones para optimizar la oferta y la demanda.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="group relative transform transition-all duration-500 hover:scale-[1.02]">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <Card className="relative h-full border-0">
              <CardContent className="p-8">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/20 rounded-xl p-4 mb-6">
                  <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-2 flex items-center">
                    <span className="text-xl mr-2">🔹</span> Homi (Para Inquilinos)
                  </h3>
                </div>
                <p className="text-lg text-muted-foreground">
                  Plataforma de matching inteligente que conecta estudiantes con compañeros de piso y propiedades ideales, facilitando la búsqueda de alojamiento y acceso a servicios como pagos digitales, seguros y asesoría legal.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="group relative transform transition-all duration-500 hover:scale-[1.02]">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <Card className="relative h-full border-0">
              <CardContent className="p-8">
                <div className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/20 rounded-xl p-4 mb-6">
                  <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-2 flex items-center">
                    <span className="text-xl mr-2">🔹</span> Homiware (Para Propietarios)
                  </h3>
                </div>
                <p className="text-lg text-muted-foreground">
                  Plataforma 100% digital que reemplaza a las inmobiliarias tradicionales, permitiendo la gestión integral del alquiler, con selección de inquilinos, automatización de pagos, contratos digitales y herramientas para maximizar rentabilidad.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="group relative transform transition-all duration-500 hover:scale-[1.02]">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-indigo-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <Card className="relative h-full border-0">
              <CardContent className="p-8">
                <div className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/20 rounded-xl p-4 mb-6">
                  <h3 className="text-2xl font-bold text-violet-700 dark:text-violet-300 mb-2 flex items-center">
                    <span className="text-xl mr-2">🔹</span> Enfoque Estratégico con Marcas Diferenciadas
                  </h3>
                </div>
                <p className="text-lg text-muted-foreground">
                  Al separar las marcas, podemos posicionar y promocionar cada solución de manera más efectiva y atractiva, adaptando la comunicación a las necesidades de cada segmento de clientes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="relative group transform transition-all duration-500 hover:scale-[1.01]">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
          <Card className="relative border-0">
            <CardContent className="p-8">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/20 rounded-xl p-4 mb-6">
                <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2 flex items-center">
                  <span className="text-xl mr-2">🔹</span> Sinergia y Equilibrio en el Mercado
                </h3>
              </div>
              <p className="text-lg text-muted-foreground">
                La interdependencia entre Homi y Homiware permite una experiencia fluida y segura para inquilinos y propietarios, asegurando un alquiler más eficiente, sin intermediarios costosos y con mayor confianza.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
];

export default Presentation;
