
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Presentation = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      title: "Problema",
      subtitle: "¿Qué problema real solucionamos a nuestros clientes?",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">📌 Para los Inquilinos (Estudiantes y Jóvenes Profesionales):</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-red-500 mr-2">❌</span>
              Dificultad para encontrar compañeros de piso compatibles.
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">❌</span>
              Pérdida de tiempo y esfuerzo en la búsqueda de vivienda.
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">❌</span>
              Falta de seguridad y confianza en los procesos de alquiler.
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">❌</span>
              Gestión manual de pagos y contratos.
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">❌</span>
              Ausencia de servicios adicionales para facilitar la estancia.
            </li>
          </ul>
          <p className="font-medium"><span className="text-homi-purple">👉</span> El proceso de alquiler es ineficiente, inseguro y requiere múltiples plataformas.</p>
        </div>
      )
    },
    {
      id: 2,
      title: "Solución",
      subtitle: "¿Cuál es la USP (Propuesta Única de Valor)?",
      content: (
        <div className="space-y-4">
          <p className="font-semibold text-lg">
            <span className="text-homi-purple">🚀</span> Homi es la plataforma todo-en-uno para estudiantes y jóvenes que simplifica el proceso de alquiler y convivencia.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-homi-purple mr-2">🔹</span>
              <span><strong>Matching Inteligente:</strong> Encuentra compañeros de piso compatibles basados en intereses y hábitos de convivencia.</span>
            </li>
            <li className="flex items-start">
              <span className="text-homi-purple mr-2">🔹</span>
              <span><strong>Búsqueda Personalizada de Vivienda:</strong> Homi actúa como agencia y filtra las mejores opciones para el grupo.</span>
            </li>
            <li className="flex items-start">
              <span className="text-homi-purple mr-2">🔹</span>
              <span><strong>Intermediación Segura:</strong> Validación de perfiles y mediación con propietarios para garantizar seguridad.</span>
            </li>
            <li className="flex items-start">
              <span className="text-homi-purple mr-2">🔹</span>
              <span><strong>Contrato Digital y Pagos Automáticos:</strong> Automatización de procesos clave para eliminar fricciones.</span>
            </li>
            <li className="flex items-start">
              <span className="text-homi-purple mr-2">🔹</span>
              <span><strong>Servicios Adicionales:</strong> Acceso a mudanzas, limpieza, internet y seguros para mejorar la experiencia.</span>
            </li>
          </ul>
          <p className="font-medium"><span className="text-green-500">✅</span> Homi revoluciona el alquiler para inquilinos, asegurando rapidez, seguridad y comodidad.</p>
        </div>
      )
    },
    {
      id: 3,
      title: "Producto",
      subtitle: "¿En qué consiste esa solución? (MVP)",
      content: (
        <div className="space-y-4">
          <p className="font-semibold">
            <span className="text-homi-purple">🎯</span> Homi integra en una sola plataforma:
          </p>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="mr-2 font-bold">1️⃣</span>
              <span><strong>Matching entre compañeros</strong> → Encuentra roommates ideales según compatibilidad.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 font-bold">2️⃣</span>
              <span><strong>Propiedades sugeridas</strong> → Homi encuentra y recomienda pisos según el grupo.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 font-bold">3️⃣</span>
              <span><strong>Intermediación segura</strong> → Validación de perfiles y negociación con propietarios.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 font-bold">4️⃣</span>
              <span><strong>Firma de contrato digital</strong> → Todo el proceso es legal, digital y automatizado.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 font-bold">5️⃣</span>
              <span><strong>Gestión de pagos</strong> → Automatización del pago del alquiler y división de gastos.</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 font-bold">6️⃣</span>
              <span><strong>Servicios adicionales</strong> → Acceso a seguros, mudanzas, internet y limpieza.</span>
            </li>
          </ul>
          <p className="font-medium"><span className="text-green-500">✅</span> MVP validado en pilotos con usuarios reales.</p>
        </div>
      )
    },
    {
      id: 4,
      title: "Mercado",
      subtitle: "TAM, SAM, SOM",
      content: (
        <div className="space-y-4">
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-homi-purple mr-2">📌</span>
              <span><strong>TAM (Mercado Total Disponible):</strong> €2.500M en alquiler estudiantil en España.</span>
            </li>
            <li className="flex items-start">
              <span className="text-homi-purple mr-2">📌</span>
              <span><strong>SAM (Mercado Disponible):</strong> €1.750M en ciudades universitarias.</span>
            </li>
            <li className="flex items-start">
              <span className="text-homi-purple mr-2">📌</span>
              <span><strong>SOM (Mercado Objetivo):</strong> Captación del 5% en los primeros 3 años → €87M.</span>
            </li>
          </ul>
          
          <div className="mt-4">
            <p className="font-semibold mb-2">Target:</p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-homi-purple mr-2">🎯</span>
                <span><strong>Target Primario:</strong> 1.5M de estudiantes universitarios en España.</span>
              </li>
              <li className="flex items-start">
                <span className="text-homi-purple mr-2">🎯</span>
                <span><strong>Target Secundario:</strong> Jóvenes profesionales en búsqueda de pisos compartidos.</span>
              </li>
            </ul>
          </div>
          
          <div className="mt-4">
            <p className="font-semibold mb-2">Tendencias:</p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                Crecimiento de la demanda de alquiler entre jóvenes.
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                Digitalización del sector inmobiliario.
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                Expansión del modelo de "coliving" y plataformas de gestión digital.
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Modelo de Negocio",
      subtitle: "¿Cómo ganamos dinero?",
      content: (
        <div className="space-y-4">
          <p className="font-semibold">
            <span className="text-homi-purple">💰</span> Homi monetiza en cada etapa del alquiler:
          </p>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Servicio</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Monetización</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-4 py-3 text-sm">Matching entre compañeros</td>
                  <td className="px-4 py-3 text-sm">Suscripción premium para acceso a más opciones y filtros avanzados.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">Búsqueda de propiedades sugeridas</td>
                  <td className="px-4 py-3 text-sm">Comisión por reservas de vivienda a través de Homi.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">Intermediación y validación de perfiles</td>
                  <td className="px-4 py-3 text-sm">Tarifa por validación de inquilinos y seguridad en el proceso.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">Firma de contratos digitales</td>
                  <td className="px-4 py-3 text-sm">Comisión por la gestión del contrato y firma electrónica.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">Pagos automatizados</td>
                  <td className="px-4 py-3 text-sm">Comisión en cada transacción de alquiler gestionada por Homi.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">Servicios adicionales</td>
                  <td className="px-4 py-3 text-sm">Ingresos por cada servicio contratado (mudanzas, limpieza, seguros).</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p className="font-medium">
            <span className="text-homi-purple">🚀</span> Escalabilidad garantizada con ingresos recurrentes.
          </p>
        </div>
      )
    },
    {
      id: 6,
      title: "Benchmarking",
      subtitle: "¿En qué nos diferenciamos de la competencia?",
      content: (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              <span className="text-homi-purple">📌</span> Competidores Actuales:
            </h3>
            <ul className="space-y-2">
              <li className="ml-4">
                <span className="font-medium">Idealista & Fotocasa:</span> Solo anuncios, sin gestión ni matching.
              </li>
              <li className="ml-4">
                <span className="font-medium">Badi:</span> Matching de compañeros, pero sin agencia ni herramientas de alquiler.
              </li>
              <li className="ml-4">
                <span className="font-medium">Uniplaces & Spotahome:</span> Enfocados en alquiler internacional con altas comisiones.
              </li>
              <li className="ml-4">
                <span className="font-medium">Inmobiliarias tradicionales:</span> Costosas, lentas y sin digitalización.
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">
              <span className="text-homi-purple">📌</span> Diferenciación de Homi:
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                Matching + Agencia Digital + Gestión del Alquiler en un solo ecosistema.
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                Perfiles filtrados y verificados para máxima seguridad.
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                Automatización de pagos, contratos y seguros sin intermediarios.
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                Acceso a servicios complementarios dentro de la app.
              </li>
            </ul>
          </div>
          
          <p className="font-medium">
            <span className="text-homi-purple">🎯</span> Resultado: Un alquiler más rápido, seguro y eficiente para inquilinos.
          </p>
        </div>
      )
    },
    {
      id: 7,
      title: "Plan",
      subtitle: "¿Cómo lo vamos a conseguir?",
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Fase 1: MVP y Validación (0-6 meses)</h3>
            <ul className="space-y-1">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                Lanzamiento en Madrid, Barcelona y Valencia.
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                Pruebas piloto con 500 estudiantes y 100 propietarios.
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                Campañas de adquisición en universidades y redes sociales.
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Fase 2: Expansión Nacional (6-12 meses)</h3>
            <ul className="space-y-1">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                Expansión a más ciudades universitarias.
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                Integración con servicios financieros y aseguradoras.
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                Primeros 10.000 usuarios activos.
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Fase 3: Monetización y Escalabilidad (12-24 meses)</h3>
            <ul className="space-y-1">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                Expansión internacional (Francia, Alemania, Italia).
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                Ampliación de servicios dentro de Homi.
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                Consolidación como la principal alternativa a inmobiliarias tradicionales.
              </li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 8,
      title: "Validación",
      subtitle: "¿Qué hemos validado ya?",
      content: (
        <div className="space-y-4">
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              Mercado con demanda comprobada: Encuestas y tendencias del sector.
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              Primeros usuarios registrados y pruebas piloto en universidades.
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              Interés de propietarios y acuerdos potenciales.
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✅</span>
              Modelo de negocio basado en ingresos recurrentes.
            </li>
          </ul>
          
          <p className="font-medium">
            <span className="text-homi-purple">📌</span> Próximo paso: Inversión para escalar tecnología y adquisición de usuarios.
          </p>
        </div>
      )
    },
    {
      id: 9,
      title: "Necesidades",
      subtitle: "¿Qué necesitamos?",
      content: (
        <div className="space-y-4">
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-homi-purple mr-2">🎯</span>
              <span><strong>Inversión:</strong> €500K para desarrollo tecnológico, marketing y crecimiento.</span>
            </li>
            <li className="flex items-start">
              <span className="text-homi-purple mr-2">🎯</span>
              <span><strong>Equipo:</strong> CTO con experiencia en plataformas digitales.</span>
            </li>
            <li className="flex items-start">
              <span className="text-homi-purple mr-2">🎯</span>
              <span><strong>Partners estratégicos:</strong> Aseguradoras y bancos para soluciones financieras.</span>
            </li>
          </ul>
          
          <p className="font-medium">
            <span className="text-homi-purple">📌</span> Oportunidad única: Homi está listo para transformar el mercado del alquiler.
          </p>
        </div>
      )
    },
    {
      id: 10,
      title: "Equipo",
      subtitle: "¿Quiénes somos?",
      content: (
        <div className="space-y-4">
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-homi-purple mr-2">👨‍💻</span>
              <span><strong>Fernando Gamero Martín</strong> – UX/UI Designer con experiencia en productos digitales.</span>
            </li>
            <li className="flex items-start">
              <span className="text-homi-purple mr-2">👨‍🎨</span>
              <span><strong>José Antonio Serrano Carbajo</strong> – Especialista en branding y diseño de productos.</span>
            </li>
            <li className="flex items-start">
              <span className="text-homi-purple mr-2">📊</span>
              <span><strong>Cristian Villegas</strong> – Estrategia de negocio y marketing digital con experiencia en startups.</span>
            </li>
          </ul>
          
          <p className="font-medium">
            <span className="text-homi-purple">📌</span> Un equipo con experiencia en tecnología, diseño y escalabilidad de startups.
          </p>
          
          <p className="font-semibold text-lg">
            <span className="text-homi-purple">🚀</span> Únete a la revolución del alquiler con Homi.
          </p>
        </div>
      )
    }
  ];

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
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

        <div className="glass-card p-8 mb-8 shadow-lg max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-bold text-homi-purple">
                {slides[activeSlide].title}
              </h3>
              <p className="text-muted-foreground">
                {slides[activeSlide].subtitle}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => setActiveSlide(index)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all",
                    activeSlide === index
                      ? "bg-homi-purple scale-125"
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-homi-lightPurple"
                  )}
                  aria-label={`Ir a diapositiva ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="min-h-[400px]">
            {slides[activeSlide].content}
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={handlePrevSlide}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Anterior</span>
            </Button>

            <div className="text-sm text-muted-foreground">
              {activeSlide + 1} / {slides.length}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={handleNextSlide}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Siguiente</span>
            </Button>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <Button className="bg-homi-purple hover:bg-homi-purple/90 rounded-full">
            Conoce más sobre Homi
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Presentation;
