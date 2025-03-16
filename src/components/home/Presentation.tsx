import { useState } from 'react';
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
  BarChart3
} from 'lucide-react';

const Presentation = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  const toggleSection = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
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
        
        {/* Navigation Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {sections.map((section) => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "outline"}
              className={`rounded-full transition-all ${
                activeSection === section.id 
                  ? "bg-homi-purple text-white" 
                  : "hover:bg-homi-ultraLightPurple/50"
              }`}
              onClick={() => toggleSection(section.id)}
            >
              <section.icon className="mr-2 h-4 w-4" />
              {section.title}
            </Button>
          ))}
        </div>
        
        {/* Content Sections */}
        <div className="space-y-12">
          {sections.map((section) => (
            <div 
              key={section.id}
              className={`transition-all duration-500 ${
                activeSection === section.id || activeSection === null 
                  ? "opacity-100 max-h-[2000px]" 
                  : "opacity-40 max-h-[400px] overflow-hidden"
              }`}
            >
              <div className="bg-white dark:bg-black/20 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 dark:border-white/10 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Section Header */}
                  <div className="md:w-1/3 p-8 bg-gradient-to-br from-homi-purple/10 to-homi-ultraLightPurple/30">
                    <div className="h-full flex flex-col justify-center">
                      <div className="p-3 rounded-full bg-homi-ultraLightPurple w-14 h-14 flex items-center justify-center mb-4">
                        <section.icon className="h-8 w-8 text-homi-purple" />
                      </div>
                      <h3 className="text-2xl font-bold text-homi-purple mb-2">{section.title}</h3>
                      <p className="text-muted-foreground">{section.subtitle}</p>
                      
                      {activeSection !== section.id && (
                        <Button 
                          variant="outline" 
                          className="mt-6 w-fit"
                          onClick={() => setActiveSection(section.id)}
                        >
                          Ver detalles
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Section Content */}
                  <div className="md:w-2/3 p-8">
                    <div className="h-full">
                      {section.content}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to Action */}
        <div className="mt-16 text-center animate-on-scroll">
          <h3 className="text-2xl font-bold mb-4">
            ¿Quieres saber más sobre <span className="homi-gradient-text">Homi</span>?
          </h3>
          <Button className="bg-homi-purple hover:bg-homi-purple/90 rounded-full px-8 py-6 text-lg mt-4">
            Contáctanos
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
            <Card className="border-red-100 dark:border-red-900/30">
              <CardContent className="p-4">
                <Badge variant="destructive" className="mb-2">Problema</Badge>
                <p>Dificultad para encontrar compañeros de piso compatibles.</p>
              </CardContent>
            </Card>
            <Card className="border-red-100 dark:border-red-900/30">
              <CardContent className="p-4">
                <Badge variant="destructive" className="mb-2">Problema</Badge>
                <p>Pérdida de tiempo y esfuerzo en la búsqueda de vivienda.</p>
              </CardContent>
            </Card>
            <Card className="border-red-100 dark:border-red-900/30">
              <CardContent className="p-4">
                <Badge variant="destructive" className="mb-2">Problema</Badge>
                <p>Falta de seguridad y confianza en los procesos de alquiler.</p>
              </CardContent>
            </Card>
            <Card className="border-red-100 dark:border-red-900/30">
              <CardContent className="p-4">
                <Badge variant="destructive" className="mb-2">Problema</Badge>
                <p>Gestión manual de pagos y contratos.</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Card className="border-homi-purple/20 bg-homi-ultraLightPurple/20">
          <CardContent className="p-6">
            <p className="font-medium"><span className="text-homi-purple">👉</span> El proceso de alquiler es ineficiente, inseguro y requiere múltiples plataformas.</p>
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
      <div className="space-y-6">
        <Card className="border-homi-purple/20 bg-homi-ultraLightPurple/20">
          <CardContent className="p-6">
            <p className="font-semibold text-lg">
              <span className="text-homi-purple">🚀</span> Homi es la plataforma todo-en-uno para estudiantes y jóvenes que simplifica el proceso de alquiler y convivencia.
            </p>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start">
                <div className="rounded-full bg-homi-ultraLightPurple/70 p-2 mr-3">
                  <Users className="h-5 w-5 text-homi-purple" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Matching Inteligente</h4>
                  <p className="text-sm text-muted-foreground">Encuentra compañeros de piso compatibles basados en intereses y hábitos de convivencia.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start">
                <div className="rounded-full bg-homi-ultraLightPurple/70 p-2 mr-3">
                  <Building className="h-5 w-5 text-homi-purple" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Búsqueda Personalizada</h4>
                  <p className="text-sm text-muted-foreground">Homi actúa como agencia y filtra las mejores opciones para el grupo.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start">
                <div className="rounded-full bg-homi-ultraLightPurple/70 p-2 mr-3">
                  <CheckCircle className="h-5 w-5 text-homi-purple" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Intermediación Segura</h4>
                  <p className="text-sm text-muted-foreground">Validación de perfiles y mediación con propietarios para garantizar seguridad.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start">
                <div className="rounded-full bg-homi-ultraLightPurple/70 p-2 mr-3">
                  <BrainCircuit className="h-5 w-5 text-homi-purple" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Contrato Digital</h4>
                  <p className="text-sm text-muted-foreground">Automatización de procesos clave para eliminar fricciones.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="border-green-100 dark:border-green-900/30 bg-green-50/50 dark:bg-green-900/10">
          <CardContent className="p-4">
            <p className="font-medium"><span className="text-green-500">✅</span> Homi revoluciona el alquiler para inquilinos, asegurando rapidez, seguridad y comodidad.</p>
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
      <div className="space-y-4">
        <Card className="border-homi-purple/20 bg-homi-ultraLightPurple/20">
          <CardContent className="p-4">
            <p className="font-semibold">
              <span className="text-homi-purple">🎯</span> Homi integra en una sola plataforma:
            </p>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 gap-3">
          {[
            { num: "1️⃣", title: "Matching entre compañeros", desc: "Encuentra roommates ideales según compatibilidad." },
            { num: "2️⃣", title: "Propiedades sugeridas", desc: "Homi encuentra y recomienda pisos según el grupo." },
            { num: "3️⃣", title: "Intermediación segura", desc: "Validación de perfiles y negociación con propietarios." },
            { num: "4️⃣", title: "Firma de contrato digital", desc: "Todo el proceso es legal, digital y automatizado." },
            { num: "5️⃣", title: "Gestión de pagos", desc: "Automatización del pago del alquiler y división de gastos." },
            { num: "6️⃣", title: "Servicios adicionales", desc: "Acceso a seguros, mudanzas, internet y limpieza." }
          ].map((item, i) => (
            <div key={i} className="flex items-center p-3 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <div className="mr-3 font-bold text-xl">{item.num}</div>
              <div>
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        <Card className="border-green-100 dark:border-green-900/30 bg-green-50/50 dark:bg-green-900/10">
          <CardContent className="p-4">
            <p className="font-medium"><span className="text-green-500">✅</span> MVP validado en pilotos con usuarios reales.</p>
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
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-homi-purple/20">
            <CardContent className="p-6 text-center">
              <Badge className="mb-2">TAM</Badge>
              <h3 className="text-2xl font-bold mb-1">€2.500M</h3>
              <p className="text-sm text-muted-foreground">Mercado Total Disponible en alquiler estudiantil en España</p>
            </CardContent>
          </Card>
          
          <Card className="border-homi-purple/20">
            <CardContent className="p-6 text-center">
              <Badge className="mb-2">SAM</Badge>
              <h3 className="text-2xl font-bold mb-1">€1.750M</h3>
              <p className="text-sm text-muted-foreground">Mercado Disponible en ciudades universitarias</p>
            </CardContent>
          </Card>
          
          <Card className="border-homi-purple/20">
            <CardContent className="p-6 text-center">
              <Badge className="mb-2">SOM</Badge>
              <h3 className="text-2xl font-bold mb-1">€87M</h3>
              <p className="text-sm text-muted-foreground">5% de captación en los primeros 3 años</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold mb-3">Target</h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-homi-purple mr-2">🎯</span>
                  <div>
                    <strong className="block">Target Primario:</strong>
                    <span className="text-muted-foreground">1.5M de estudiantes universitarios en España.</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-homi-purple mr-2">🎯</span>
                  <div>
                    <strong className="block">Target Secundario:</strong>
                    <span className="text-muted-foreground">Jóvenes profesionales en búsqueda de pisos compartidos.</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold mb-3">Tendencias</h4>
              <div className="space-y-2">
                {[
                  "Crecimiento de la demanda de alquiler entre jóvenes.",
                  "Digitalización del sector inmobiliario.",
                  "Expansión del modelo de \"coliving\" y plataformas de gestión digital."
                ].map((trend, i) => (
                  <div key={i} className="flex items-start">
                    <span className="text-green-500 mr-2">✅</span>
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
      <div className="space-y-6">
        <Card className="border-homi-purple/20 bg-homi-ultraLightPurple/20">
          <CardContent className="p-6">
            <p className="font-semibold">
              <span className="text-homi-purple">💰</span> Homi monetiza en cada etapa del alquiler:
            </p>
          </CardContent>
        </Card>
        
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Servicio</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Monetización</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-black/20">
              {[
                { service: "Matching entre compañeros", model: "Suscripción premium para acceso a más opciones y filtros avanzados." },
                { service: "Búsqueda de propiedades", model: "Comisión por reservas de vivienda a través de Homi." },
                { service: "Intermediación", model: "Tarifa por validación de inquilinos y seguridad en el proceso." },
                { service: "Firma de contratos", model: "Comisión por la gestión del contrato y firma electrónica." },
                { service: "Pagos automatizados", model: "Comisión en cada transacción de alquiler gestionada por Homi." },
                { service: "Servicios adicionales", model: "Ingresos por cada servicio contratado (mudanzas, limpieza, seguros)." }
              ].map((item, i) => (
                <tr key={i} className="hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm">{item.service}</td>
                  <td className="px-4 py-3 text-sm">{item.model}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <Card className="border-homi-purple/20">
          <CardContent className="p-4">
            <p className="font-medium">
              <span className="text-homi-purple">🚀</span> Escalabilidad garantizada con ingresos recurrentes.
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
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">
            <span className="text-homi-purple">📌</span> Competidores Actuales:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "Idealista & Fotocasa", desc: "Solo anuncios, sin gestión ni matching." },
              { name: "Badi", desc: "Matching de compañeros, pero sin agencia ni herramientas de alquiler." },
              { name: "Uniplaces & Spotahome", desc: "Enfocados en alquiler internacional con altas comisiones." },
              { name: "Inmobiliarias tradicionales", desc: "Costosas, lentas y sin digitalización." }
            ].map((comp, i) => (
              <Card key={i} className="border-red-100 dark:border-red-900/30">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-1">{comp.name}</h4>
                  <p className="text-sm text-muted-foreground">{comp.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">
            <span className="text-homi-purple">📌</span> Diferenciación de Homi:
          </h3>
          <div className="space-y-3">
            {[
              "Matching + Agencia Digital + Gestión del Alquiler en un solo ecosistema.",
              "Perfiles filtrados y verificados para máxima seguridad.",
              "Automatización de pagos, contratos y seguros sin intermediarios.",
              "Acceso a servicios complementarios dentro de la app."
            ].map((diff, i) => (
              <Card key={i} className="border-green-100 dark:border-green-900/30 bg-green-50/50 dark:bg-green-900/10">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <span className="text-green-500 mr-2">✅</span>
                    <span>{diff}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <Card className="border-homi-purple/20">
          <CardContent className="p-4">
            <p className="font-medium">
              <span className="text-homi-purple">🎯</span> Resultado: Un alquiler más rápido, seguro y eficiente para inquilinos.
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
      <div className="space-y-8">
        {[
          {
            title: "Fase 1: MVP y Validación (0-6 meses)",
            items: [
              "Lanzamiento en Madrid, Barcelona y Valencia.",
              "Pruebas piloto con 500 estudiantes y 100 propietarios.",
              "Campañas de adquisición en universidades y redes sociales."
            ]
          },
          {
            title: "Fase 2: Expansión Nacional (6-12 meses)",
            items: [
              "Expansión a más ciudades universitarias.",
              "Integración con servicios financieros y aseguradoras.",
              "Primeros 10.000 usuarios activos."
            ]
          },
          {
            title: "Fase 3: Monetización y Escalabilidad (12-24 meses)",
            items: [
              "Expansión internacional (Francia, Alemania, Italia).",
              "Ampliación de servicios dentro de Homi.",
              "Consolidación como la principal alternativa a inmobiliarias tradicionales."
            ]
          }
        ].map((phase, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">{phase.title}</h3>
              <div className="space-y-2">
                {phase.items.map((item, j) => (
                  <div key={j} className="flex items-start">
                    <span className="text-green-500 mr-2">✅</span>
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  },
  {
    id: "validacion",
    title: "Validación",
    subtitle: "¿Qué hemos validado ya?",
    icon: CheckCircle,
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Mercado con demanda comprobada: Encuestas y tendencias del sector.",
            "Primeros usuarios registrados y pruebas piloto en universidades.",
            "Interés de propietarios y acuerdos potenciales.",
            "Modelo de negocio basado en ingresos recurrentes."
          ].map((item, i) => (
            <Card key={i} className="border-green-100 dark:border-green-900/30 bg-green-50/50 dark:bg-green-900/10">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-muted-foreground">{item}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="border-homi-purple/20 bg-homi-ultraLightPurple/20">
          <CardContent className="p-6">
            <p className="font-medium">
              <span className="text-homi-purple">📌</span> Próximo paso: Inversión para escalar tecnología y adquisición de usuarios.
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
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <BarChart3 className="w-8 h-8 text-homi-purple" />, title: "Inversión", desc: "€500K para desarrollo tecnológico, marketing y crecimiento." },
            { icon: <BrainCircuit className="w-8 h-8 text-homi-purple" />, title: "Equipo", desc: "CTO con experiencia en plataformas digitales." },
            { icon: <Users className="w-8 h-8 text-homi-purple" />, title: "Partners estratégicos", desc: "Aseguradoras y bancos para soluciones financieras." }
          ].map((need, i) => (
            <Card key={i} className="border-homi-purple/20">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-homi-ultraLightPurple flex items-center justify-center mb-4">
                  {need.icon}
                </div>
                <h4 className="text-lg font-semibold mb-2">{need.title}</h4>
                <p className="text-muted-foreground">{need.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="border-homi-purple/20 bg-homi-ultraLightPurple/20">
          <CardContent className="p-6 text-center">
            <p className="font-medium text-lg">
              <span className="text-homi-purple">📌</span> Oportunidad única: Homi está listo para transformar el mercado del alquiler.
            </p>
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
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <Card key={i}>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-homi-ultraLightPurple/50 flex items-center justify-center mb-4 text-3xl">
                  {member.emoji}
                </div>
                <h4 className="text-lg font-semibold mb-1">{member.name}</h4>
                <Badge variant="outline" className="mb-2">{member.role}</Badge>
                <p className="text-sm text-muted-foreground">{member.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="border-homi-purple/20 bg-homi-ultraLightPurple/20">
          <CardContent className="p-6 text-center">
            <p className="font-semibold text-lg">
              <span className="text-homi-purple">🚀</span> Un equipo con experiencia en tecnología, diseño y escalabilidad de startups.
            </p>
            <Button className="mt-4 bg-homi-purple hover:bg-homi-purple/90 rounded-full">
              Únete a la revolución del alquiler con Homi
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
];

export default Presentation;
