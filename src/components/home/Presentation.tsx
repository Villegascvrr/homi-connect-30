
import { 
  BarChart3, ShieldCheck, Rocket, Lightbulb, 
  Users, Home, FileText, DollarSign, Target, 
  Check, X, BarChart2, Globe, User
} from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Presentation = () => {
  const slides = [
    {
      title: "Problema",
      subtitle: "¿Qué problema real solucionamos a nuestros clientes?",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-lg mb-2">📌 Para los Inquilinos (Estudiantes y Jóvenes Profesionales):</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <X className="text-red-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Dificultad para encontrar compañeros de piso compatibles.</span>
              </li>
              <li className="flex items-start">
                <X className="text-red-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Pérdida de tiempo y esfuerzo en la búsqueda de vivienda.</span>
              </li>
              <li className="flex items-start">
                <X className="text-red-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Falta de seguridad y confianza en los procesos de alquiler.</span>
              </li>
              <li className="flex items-start">
                <X className="text-red-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Gestión manual de pagos y contratos.</span>
              </li>
              <li className="flex items-start">
                <X className="text-red-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Ausencia de servicios adicionales para facilitar la estancia.</span>
              </li>
            </ul>
          </div>
          <div className="pt-4">
            <p className="font-medium flex items-center">
              <span className="mr-2">👉</span>
              El proceso de alquiler es ineficiente, inseguro y requiere múltiples plataformas.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Solución",
      subtitle: "¿Cuál es la USP (Propuesta Única de Valor)?",
      content: (
        <div className="space-y-4">
          <p className="font-medium flex items-start">
            <Rocket className="text-homi-purple h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            Homi es la plataforma todo-en-uno para estudiantes y jóvenes que simplifica el proceso de alquiler y convivencia.
          </p>
          
          <ul className="space-y-3 pt-2">
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-homi-purple mt-2 mr-2 flex-shrink-0"></div>
              <span><strong>Matching Inteligente:</strong> Encuentra compañeros de piso compatibles basados en intereses y hábitos de convivencia.</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-homi-purple mt-2 mr-2 flex-shrink-0"></div>
              <span><strong>Búsqueda Personalizada de Vivienda:</strong> Homi actúa como agencia y filtra las mejores opciones para el grupo.</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-homi-purple mt-2 mr-2 flex-shrink-0"></div>
              <span><strong>Intermediación Segura:</strong> Validación de perfiles y mediación con propietarios para garantizar seguridad.</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-homi-purple mt-2 mr-2 flex-shrink-0"></div>
              <span><strong>Contrato Digital y Pagos Automáticos:</strong> Automatización de procesos clave para eliminar fricciones.</span>
            </li>
            <li className="flex items-start">
              <div className="w-2 h-2 rounded-full bg-homi-purple mt-2 mr-2 flex-shrink-0"></div>
              <span><strong>Servicios Adicionales:</strong> Acceso a mudanzas, limpieza, internet y seguros para mejorar la experiencia.</span>
            </li>
          </ul>
          
          <p className="font-medium flex items-center pt-2">
            <Check className="text-green-500 h-5 w-5 mr-2 flex-shrink-0" />
            Homi revoluciona el alquiler para inquilinos, asegurando rapidez, seguridad y comodidad.
          </p>
        </div>
      )
    },
    {
      title: "Producto",
      subtitle: "¿En qué consiste esa solución? (MVP)",
      content: (
        <div className="space-y-4">
          <p className="font-medium flex items-start">
            <Target className="text-homi-purple h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            Homi integra en una sola plataforma:
          </p>
          
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="bg-homi-purple text-white rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">1</div>
              <span><strong>Matching entre compañeros</strong> → Encuentra roommates ideales según compatibilidad.</span>
            </li>
            <li className="flex items-start">
              <div className="bg-homi-purple text-white rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">2</div>
              <span><strong>Propiedades sugeridas</strong> → Homi encuentra y recomienda pisos según el grupo.</span>
            </li>
            <li className="flex items-start">
              <div className="bg-homi-purple text-white rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">3</div>
              <span><strong>Intermediación segura</strong> → Validación de perfiles y negociación con propietarios.</span>
            </li>
            <li className="flex items-start">
              <div className="bg-homi-purple text-white rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">4</div>
              <span><strong>Firma de contrato digital</strong> → Todo el proceso es legal, digital y automatizado.</span>
            </li>
            <li className="flex items-start">
              <div className="bg-homi-purple text-white rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">5</div>
              <span><strong>Gestión de pagos</strong> → Automatización del pago del alquiler y división de gastos.</span>
            </li>
            <li className="flex items-start">
              <div className="bg-homi-purple text-white rounded-full h-6 w-6 flex items-center justify-center mr-2 flex-shrink-0">6</div>
              <span><strong>Servicios adicionales</strong> → Acceso a seguros, mudanzas, internet y limpieza.</span>
            </li>
          </ul>
          
          <p className="font-medium flex items-center pt-2">
            <Check className="text-green-500 h-5 w-5 mr-2 flex-shrink-0" />
            MVP validado en pilotos con usuarios reales.
          </p>
        </div>
      )
    },
    {
      title: "Mercado",
      subtitle: "TAM, SAM, SOM",
      content: (
        <div className="space-y-4">
          <ul className="space-y-2">
            <li className="flex items-start">
              <div className="text-homi-purple mr-2 flex-shrink-0">📌</div>
              <span><strong>TAM (Mercado Total Disponible):</strong> €2.500M en alquiler estudiantil en España.</span>
            </li>
            <li className="flex items-start">
              <div className="text-homi-purple mr-2 flex-shrink-0">📌</div>
              <span><strong>SAM (Mercado Disponible):</strong> €1.750M en ciudades universitarias.</span>
            </li>
            <li className="flex items-start">
              <div className="text-homi-purple mr-2 flex-shrink-0">📌</div>
              <span><strong>SOM (Mercado Objetivo):</strong> Captación del 5% en los primeros 3 años → €87M.</span>
            </li>
          </ul>
          
          <div className="pt-2">
            <p className="font-medium flex items-start">
              <Target className="text-homi-purple h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              Target Primario: 1.5M de estudiantes universitarios en España.
            </p>
            <p className="font-medium flex items-start mt-1">
              <Target className="text-homi-purple h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              Target Secundario: Jóvenes profesionales en búsqueda de pisos compartidos.
            </p>
          </div>
          
          <div className="pt-2">
            <p className="font-medium mb-2">
              <BarChart2 className="text-homi-purple h-5 w-5 mr-2 inline-block" />
              Tendencias:
            </p>
            <ul className="space-y-1">
              <li className="flex items-start">
                <Check className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Crecimiento de la demanda de alquiler entre jóvenes.</span>
              </li>
              <li className="flex items-start">
                <Check className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Digitalización del sector inmobiliario.</span>
              </li>
              <li className="flex items-start">
                <Check className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Expansión del modelo de "coliving" y plataformas de gestión digital.</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Modelo de Negocio",
      subtitle: "¿Cómo ganamos dinero?",
      content: (
        <div className="space-y-4">
          <p className="font-medium flex items-start">
            <DollarSign className="text-homi-purple h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            Homi monetiza en cada etapa del alquiler:
          </p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b-2 border-homi-purple/20 text-left">Servicio</th>
                  <th className="px-4 py-2 border-b-2 border-homi-purple/20 text-left">Monetización</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border-b border-homi-purple/10">Matching entre compañeros</td>
                  <td className="px-4 py-2 border-b border-homi-purple/10">Suscripción premium para acceso a más opciones y filtros avanzados.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b border-homi-purple/10">Búsqueda de propiedades sugeridas</td>
                  <td className="px-4 py-2 border-b border-homi-purple/10">Comisión por reservas de vivienda a través de Homi.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b border-homi-purple/10">Intermediación y validación de perfiles</td>
                  <td className="px-4 py-2 border-b border-homi-purple/10">Tarifa por validación de inquilinos y seguridad en el proceso.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b border-homi-purple/10">Firma de contratos digitales</td>
                  <td className="px-4 py-2 border-b border-homi-purple/10">Comisión por la gestión del contrato y firma electrónica.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b border-homi-purple/10">Pagos automatizados</td>
                  <td className="px-4 py-2 border-b border-homi-purple/10">Comisión en cada transacción de alquiler gestionada por Homi.</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b border-homi-purple/10">Servicios adicionales</td>
                  <td className="px-4 py-2 border-b border-homi-purple/10">Ingresos por cada servicio contratado (mudanzas, limpieza, seguros).</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p className="font-medium flex items-center pt-2">
            <Rocket className="text-homi-purple h-5 w-5 mr-2 flex-shrink-0" />
            Escalabilidad garantizada con ingresos recurrentes.
          </p>
        </div>
      )
    },
    {
      title: "Benchmarking",
      subtitle: "¿En qué nos diferenciamos de la competencia?",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-lg mb-2 flex items-center">
              <div className="text-homi-purple mr-2">📌</div>
              Competidores Actuales:
            </h4>
            <ul className="space-y-2 ml-6">
              <li className="list-disc"><strong>Idealista & Fotocasa:</strong> Solo anuncios, sin gestión ni matching.</li>
              <li className="list-disc"><strong>Badi:</strong> Matching de compañeros, pero sin agencia ni herramientas de alquiler.</li>
              <li className="list-disc"><strong>Uniplaces & Spotahome:</strong> Enfocados en alquiler internacional con altas comisiones.</li>
              <li className="list-disc"><strong>Inmobiliarias tradicionales:</strong> Costosas, lentas y sin digitalización.</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-2 flex items-center">
              <div className="text-homi-purple mr-2">📌</div>
              Diferenciación de Homi:
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <Check className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Matching + Agencia Digital + Gestión del Alquiler en un solo ecosistema.</span>
              </li>
              <li className="flex items-start">
                <Check className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Perfiles filtrados y verificados para máxima seguridad.</span>
              </li>
              <li className="flex items-start">
                <Check className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Automatización de pagos, contratos y seguros sin intermediarios.</span>
              </li>
              <li className="flex items-start">
                <Check className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Acceso a servicios complementarios dentro de la app.</span>
              </li>
            </ul>
          </div>
          
          <p className="font-medium flex items-center pt-2">
            <Target className="text-homi-purple h-5 w-5 mr-2 flex-shrink-0" />
            Resultado: Un alquiler más rápido, seguro y eficiente para inquilinos.
          </p>
        </div>
      )
    },
    {
      title: "Plan",
      subtitle: "¿Cómo lo vamos a conseguir?",
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-lg mb-2">Fase 1: MVP y Validación (0-6 meses)</h4>
            <ul className="space-y-1">
              <li className="flex items-start">
                <Check className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Lanzamiento en Madrid, Barcelona y Valencia.</span>
              </li>
              <li className="flex items-start">
                <Check className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Pruebas piloto con 500 estudiantes y 100 propietarios.</span>
              </li>
              <li className="flex items-start">
                <Check className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Campañas de adquisición en universidades y redes sociales.</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-2">Fase 2: Expansión Nacional (6-12 meses)</h4>
            <ul className="space-y-1">
              <li className="flex items-start">
                <Check className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Expansión a más ciudades universitarias.</span>
              </li>
              <li className="flex items-start">
                <Check className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Integración con servicios financieros y aseguradoras.</span>
              </li>
              <li className="flex items-start">
                <Check className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Primeros 10.000 usuarios activos.</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-2">Fase 3: Monetización y Escalabilidad (12-24 meses)</h4>
            <ul className="space-y-1">
              <li className="flex items-start">
                <Check className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Expansión internacional (Francia, Alemania, Italia).</span>
              </li>
              <li className="flex items-start">
                <Check className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Ampliación de servicios dentro de Homi.</span>
              </li>
              <li className="flex items-start">
                <Check className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>Consolidación como la principal alternativa a inmobiliarias tradicionales.</span>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Validación",
      subtitle: "¿Qué hemos validado ya?",
      content: (
        <div className="space-y-4">
          <ul className="space-y-2">
            <li className="flex items-start">
              <Check className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>Mercado con demanda comprobada: Encuestas y tendencias del sector.</span>
            </li>
            <li className="flex items-start">
              <Check className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>Primeros usuarios registrados y pruebas piloto en universidades.</span>
            </li>
            <li className="flex items-start">
              <Check className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>Interés de propietarios y acuerdos potenciales.</span>
            </li>
            <li className="flex items-start">
              <Check className="text-green-500 h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>Modelo de negocio basado en ingresos recurrentes.</span>
            </li>
          </ul>
          
          <p className="font-medium flex items-center pt-2">
            <div className="text-homi-purple mr-2">📌</div>
            Próximo paso: Inversión para escalar tecnología y adquisición de usuarios.
          </p>
        </div>
      )
    },
    {
      title: "Necesidades",
      subtitle: "¿Qué necesitamos?",
      content: (
        <div className="space-y-4">
          <ul className="space-y-3">
            <li className="flex items-start">
              <Target className="text-homi-purple h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>Inversión: €500K para desarrollo tecnológico, marketing y crecimiento.</span>
            </li>
            <li className="flex items-start">
              <Target className="text-homi-purple h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>Equipo: CTO con experiencia en plataformas digitales.</span>
            </li>
            <li className="flex items-start">
              <Target className="text-homi-purple h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span>Partners estratégicos: Aseguradoras y bancos para soluciones financieras.</span>
            </li>
          </ul>
          
          <p className="font-medium flex items-center pt-2">
            <div className="text-homi-purple mr-2">📌</div>
            Oportunidad única: Homi está listo para transformar el mercado del alquiler.
          </p>
        </div>
      )
    },
    {
      title: "Equipo",
      subtitle: "¿Quiénes somos?",
      content: (
        <div className="space-y-4">
          <ul className="space-y-3">
            <li className="flex items-start">
              <User className="text-homi-purple h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span><strong>Fernando Gamero Martín</strong> – UX/UI Designer con experiencia en productos digitales.</span>
            </li>
            <li className="flex items-start">
              <User className="text-homi-purple h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span><strong>José Antonio Serrano Carbajo</strong> – Especialista en branding y diseño de productos.</span>
            </li>
            <li className="flex items-start">
              <User className="text-homi-purple h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <span><strong>Cristian Villegas</strong> – Estrategia de negocio y marketing digital con experiencia en startups.</span>
            </li>
          </ul>
          
          <p className="font-medium flex items-center pt-2">
            <div className="text-homi-purple mr-2">📌</div>
            Un equipo con experiencia en tecnología, diseño y escalabilidad de startups.
          </p>
          
          <p className="font-medium flex items-center pt-4 text-xl">
            <Rocket className="text-homi-purple h-6 w-6 mr-2 flex-shrink-0" />
            Únete a la revolución del alquiler con Homi.
          </p>
          
          <div className="pt-4 flex justify-center">
            <Button 
              size="lg" 
              className="rounded-full bg-homi-purple hover:bg-homi-purple/90 px-8"
              asChild
            >
              <Link to="/register">Únete Ahora</Link>
            </Button>
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nuestra <span className="homi-gradient-text">Presentación</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Conoce en detalle la propuesta de valor de Homi y cómo estamos transformando
            el mercado del alquiler para estudiantes y jóvenes profesionales.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {slides.map((slide, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card className="border-homi-purple/10 shadow-lg">
                      <CardContent className="flex flex-col p-6">
                        <div className="bg-gradient-to-r from-homi-purple to-homi-lightPurple text-white p-4 rounded-t-lg -mt-6 -mx-6 mb-6">
                          <h3 className="text-xl md:text-2xl font-bold">{slide.title}</h3>
                          <p className="text-white/80">{slide.subtitle}</p>
                        </div>
                        <div className="flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                          {slide.content}
                        </div>
                        <div className="mt-4 text-center text-sm text-muted-foreground">
                          Slide {index + 1} de {slides.length}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-8">
              <CarouselPrevious className="relative inset-0 translate-y-0 left-0" />
              <CarouselNext className="relative inset-0 translate-y-0 right-0" />
            </div>
          </Carousel>
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1c6f6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6A0DAD;
        }
      `}</style>
    </section>
  );
};

export default Presentation;
