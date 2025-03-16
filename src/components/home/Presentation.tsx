
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
  ChevronRight,
  Zap,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

const Presentation = () => {
  const [activeSection, setActiveSection] = useState<string | null>("solucion");
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(["solucion"]));
  
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
        
        {/* Solution Section at Top */}
        <div className="mb-24 animate-on-scroll">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl overflow-hidden shadow-xl">
            <div className="px-6 py-10 md:p-12">
              <div className="flex flex-col items-center text-center text-white mb-10">
                <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestra Solución</h2>
                <p className="text-xl text-white/80 max-w-3xl">
                  Homi: la plataforma que simplifica el alquiler para estudiantes y jóvenes.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
                <p className="text-white text-lg mb-6">
                  Homi digitaliza el proceso de alquiler, eliminando fricciones mediante tecnología avanzada.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/20 transition-all">
                    <div className="flex items-start">
                      <div className="bg-purple-500/30 p-3 rounded-full mr-4 flex-shrink-0">
                        <BrainCircuit className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">Matching Inteligente con IA</h3>
                        <p className="text-white/70">Conecta compañeros de piso compatibles según hábitos y estilo de vida.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/20 transition-all">
                    <div className="flex items-start">
                      <div className="bg-purple-500/30 p-3 rounded-full mr-4 flex-shrink-0">
                        <ShieldCheck className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">Gestión Digital Completa</h3>
                        <p className="text-white/70">Automatiza contratos, pagos y comunicación con propietarios.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20 transition-all">
                  <CardContent className="p-6">
                    <div className="rounded-full bg-white/20 h-12 w-12 flex items-center justify-center mb-4">
                      <Users className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Encuentra Roommates</h3>
                    <p className="text-white/70">Conecta con compañeros con estilos de vida compatibles al tuyo.</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20 transition-all">
                  <CardContent className="p-6">
                    <div className="rounded-full bg-white/20 h-12 w-12 flex items-center justify-center mb-4">
                      <Building className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Propiedades Ideales</h3>
                    <p className="text-white/70">Te ayudamos a encontrar el hogar perfecto para tu grupo.</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20 transition-all">
                  <CardContent className="p-6">
                    <div className="rounded-full bg-white/20 h-12 w-12 flex items-center justify-center mb-4">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Sin Complicaciones</h3>
                    <p className="text-white/70">Elimina papeleo, ahorra tiempo y simplifica todo el proceso.</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-10 text-center">
                <Button 
                  size="lg" 
                  className="bg-white text-purple-600 hover:bg-white/90 rounded-full px-8 group"
                >
                  Descubre Cómo Funciona 
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Pills - Horizontal scrolling on mobile */}
        <div className="flex overflow-x-auto pb-4 mb-12 -mx-4 px-4 snap-x scroll-px-4 scrollbar-hide">
          <div className="flex gap-3 mx-auto">
            {sections.filter(section => section.id !== "solucion").map((section) => (
              <div key={section.id} className="snap-start">
                <Button
                  variant={activeSection === section.id ? "default" : "outline"}
                  className={`whitespace-nowrap rounded-full transition-all ${
                    activeSection === section.id 
                      ? `bg-${getSectionAccentColor(section.id).replace('text-', 'bg-').replace('dark:', '')} text-white` 
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
          {sections.filter(section => section.id !== "solucion").map((section) => {
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
    id: "solucion",
    title: "Solución",
    subtitle: "¿Cuál es la USP (Propuesta Única de Valor)?",
    icon: Sparkles,
    content: null // Contenido movido a la parte superior
  },
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
                    <span>{trend}</span>
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
    id: "vision",
    title: "Visión a Futuro",
    subtitle: "La Evolución de Homi",
    icon: Rocket,
    content: (
      <div className="space-y-10">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold mb-6 inline-block border-b-2 border-indigo-400 dark:border-indigo-500 pb-2">
            Nuestra evolución: dos plataformas complementarias
          </h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <Card className="border-indigo-200 dark:border-indigo-800/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100 dark:bg-indigo-900/20 rounded-bl-full z-0"></div>
            
            <div className="bg-indigo-600 dark:bg-indigo-800 p-8 text-white relative z-10">
              <div className="flex items-center mb-3">
                <div className="bg-white/20 p-3 rounded-full mr-4">
                  <Users className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold">Homi</h3>
              </div>
              <Badge className="bg-white/90 text-indigo-600 hover:bg-white/80 mb-1">Para Inquilinos</Badge>
            </div>
            
            <CardContent className="p-8 space-y-4">
              <p className="text-base leading-relaxed">
                Plataforma para estudiantes y jóvenes profesionales que buscan pisos compartidos.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Matching inteligente entre compañeros</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Búsqueda personalizada de propiedades</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Gestión digital de contratos y pagos</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-indigo-200 dark:border-indigo-800/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-100 dark:bg-indigo-900/20 rounded-bl-full z-0"></div>
            
            <div className="bg-indigo-600 dark:bg-indigo-800 p-8 text-white relative z-10">
              <div className="flex items-center mb-3">
                <div className="bg-white/20 p-3 rounded-full mr-4">
                  <Building className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold">Homiware</h3>
              </div>
              <Badge className="bg-white/90 text-indigo-600 hover:bg-white/80 mb-1">Para Propietarios</Badge>
            </div>
            
            <CardContent className="p-8 space-y-4">
              <p className="text-base leading-relaxed">
                Software de gestión para propietarios e inmobiliarias enfocado en alquiler a estudiantes.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Gestión integral de propiedades</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Automatización de pagos y contratos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Análisis de rendimiento de propiedades</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-10">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 py-3">
            Conoce nuestra visión completa
          </Button>
        </div>
      </div>
    )
  }
];

export default Presentation;
