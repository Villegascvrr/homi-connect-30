import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';

const TermsPage = () => {
  const [currentDate] = useState(new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h1 className="text-3xl font-bold mb-6 text-center">Términos de Servicio de HomiMatch</h1>
              <p className="text-muted-foreground mb-6">Última actualización: {currentDate}</p>
              
              <div className="prose prose-slate max-w-none space-y-5">
                <p>
                  Bienvenido a HomiMatch. Por favor, lea detenidamente estos Términos de Servicio antes de utilizar
                  nuestra plataforma. Al acceder o utilizar nuestros servicios, usted acepta estar vinculado por
                  estos términos y condiciones.
                </p>
                
                <div>
                  <h2 className="text-xl font-semibold mt-6 mb-3">1. Aceptación de los Términos</h2>
                  <p>
                    Al registrarse y utilizar HomiMatch, usted acepta estos Términos de Servicio en su totalidad.
                    Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestra plataforma.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mt-6 mb-3">2. Descripción del Servicio</h2>
                  <p>
                    HomiMatch es una plataforma que conecta a estudiantes universitarios y jóvenes profesionales
                    con compañeros de piso potencialmente compatibles a través de un sistema de matching.
                    Nuestros servicios incluyen:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Creación de perfiles de usuario</li>
                    <li>Sistema de matching basado en compatibilidad</li>
                    <li>Comunicación entre usuarios</li>
                    <li>Herramientas de búsqueda y filtrado</li>
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mt-6 mb-3">3. Registro de Cuenta</h2>
                  <p>
                    Para utilizar nuestros servicios, debe crear una cuenta proporcionando información precisa
                    y actualizada. Es su responsabilidad mantener la confidencialidad de su contraseña y cuenta.
                    Usted es responsable de todas las actividades que ocurran bajo su cuenta.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mt-6 mb-3">4. Conducta del Usuario</h2>
                  <p>Al utilizar HomiMatch, usted acepta no:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Proporcionar información falsa o engañosa</li>
                    <li>Utilizar la plataforma para actividades ilegales o fraudulentas</li>
                    <li>Acosar, intimidar o discriminar a otros usuarios</li>
                    <li>Publicar contenido ofensivo, obsceno o difamatorio</li>
                    <li>Intentar acceder a cuentas o sistemas no autorizados</li>
                    <li>Interferir con el funcionamiento normal de la plataforma</li>
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mt-6 mb-3">5. Contenido del Usuario</h2>
                  <p>
                    Al publicar contenido en HomiMatch, usted garantiza que tiene los derechos necesarios para dicho
                    contenido y que no infringe derechos de terceros. Otorga a HomiMatch una licencia mundial,
                    no exclusiva y libre de regalías para usar, modificar, reproducir y mostrar dicho contenido
                    en relación con nuestros servicios.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mt-6 mb-3">6. Responsabilidad y Seguridad</h2>
                  <p>
                    Aunque nos esforzamos por mantener un entorno seguro, no podemos garantizar la conducta de todos
                    los usuarios. Le recomendamos actuar con precaución al interactuar con otros usuarios y no
                    compartir información personal sensible. HomiMatch no se hace responsable de las interacciones entre usuarios
                    fuera de nuestra plataforma.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mt-6 mb-3">7. Modificaciones del Servicio</h2>
                  <p>
                    Nos reservamos el derecho de modificar, suspender o discontinuar cualquier parte de nuestros
                    servicios en cualquier momento. Le notificaremos sobre cambios significativos cuando sea posible.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mt-6 mb-3">8. Terminación</h2>
                  <p>
                    Podemos suspender o terminar su acceso a HomiMatch si consideramos que ha violado estos términos
                    o ha actuado de manera inconsistente con su espíritu. Usted puede terminar su cuenta en
                    cualquier momento siguiendo las instrucciones en su configuración de perfil.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mt-6 mb-3">9. Limitación de Responsabilidad</h2>
                  <p>
                    En la medida permitida por la ley, HomiMatch no será responsable por daños indirectos, incidentales,
                    especiales, consecuentes o punitivos, ni por pérdida de beneficios, datos o uso, resultantes
                    de su acceso o uso de nuestros servicios.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mt-6 mb-3">10. Ley Aplicable</h2>
                  <p>
                    Estos términos se regirán e interpretarán de acuerdo con las leyes españolas, sin dar efecto
                    a ningún principio de conflictos de leyes.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mt-6 mb-3">11. Contacto</h2>
                  <p>
                    Si tiene alguna pregunta sobre estos Términos de Servicio, por favor contáctenos a través de
                    legal@homimatch.com.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsPage;
