
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';
const PrivacyPage = () => {
  const [currentDate] = useState(new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }));
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h1 className="text-3xl font-bold mb-6 text-center">Política de Privacidad de HomiMatch</h1>
              <p className="text-muted-foreground mb-6">Última actualización: {currentDate}</p>
              
              <div className="prose prose-slate max-w-none space-y-5">
                <p>En HomiMatch, valoramos y respetamos la privacidad de nuestros usuarios. Esta Política de Privacidad describe cómo recopilamos, utilizamos y protegemos su información personal.</p>
                
                <div>
                  <h2 className="text-xl font-semibold mt-6 mb-3">1. Responsable del Tratamiento</h2>
                  <p><strong>Identidad:</strong> HomiMatch (homimatch@gmail.com)</p>
                  
                  <p><strong>Correo electrónico:</strong> homimatch@gmail.com</p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mt-6 mb-3">2. Información que Recopilamos</h2>
                  <p>Recopilamos los siguientes datos personales a través de nuestros servicios:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Nombre completo</li>
                    <li>Dirección de correo electrónico</li>
                    <li>Edad y fecha de nacimiento</li>
                    <li>Preferencias de vivienda</li>
                    <li>Intereses y hábitos de vida</li>
                    <li>Fotografías de perfil (si las proporciona)</li>
                    <li>Información de contacto</li>
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mt-6 mb-3">3. Finalidad del Tratamiento</h2>
                  <p>Los datos recopilados se utilizarán para:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Proporcionar los servicios de matching y búsqueda de compañeros de piso.</li>
                    <li>Gestionar su cuenta de usuario en Homi.</li>
                    <li>Facilitar la comunicación entre usuarios potencialmente compatibles.</li>
                    <li>Mejorar nuestros algoritmos de matching y la experiencia del usuario.</li>
                    <li>Mantenerle informado sobre novedades, actualizaciones y promociones relacionadas con nuestros servicios.</li>
                    <li>Análisis estadísticos anónimos para mejorar nuestra plataforma.</li>
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mt-6 mb-3">4. Base Legal para el Tratamiento</h2>
                  <p>El tratamiento de sus datos se basa en:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Su consentimiento explícito, otorgado al registrarse y usar nuestros servicios.</li>
                    <li>La necesidad de ejecutar el contrato de servicios entre usted y Homi.</li>
                    <li>Nuestro interés legítimo en mejorar y promocionar nuestros servicios.</li>
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mt-6 mb-3">5. Conservación de los Datos</h2>
                  <p>
                    Conservaremos sus datos personales durante el tiempo que mantenga su cuenta activa en Homi, 
                    o durante el tiempo necesario para cumplir con las finalidades mencionadas. Una vez finalizada 
                    la relación, mantendremos sus datos bloqueados durante los plazos de prescripción legal para 
                    atender posibles responsabilidades, tras lo cual serán eliminados.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mt-6 mb-3">6. Comunicación de Datos a Terceros</h2>
                  <p>
                    No compartiremos sus datos personales con terceros, salvo en los siguientes casos:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Cuando sea necesario para la prestación del servicio de matching entre usuarios.</li>
                    <li>Proveedores de servicios que necesiten acceder a sus datos para prestarnos servicios.</li>
                    <li>Por cumplimiento de obligaciones legales o requerimientos judiciales.</li>
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mt-6 mb-3">7. Derechos del Usuario</h2>
                  <p>Usted tiene derecho a:</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Acceder a sus datos personales.</li>
                    <li>Rectificar datos inexactos o incompletos.</li>
                    <li>Solicitar la supresión de sus datos cuando, entre otros motivos, ya no sean necesarios para las finalidades para las que fueron recogidos.</li>
                    <li>Oponerse al tratamiento de sus datos.</li>
                    <li>Solicitar la limitación del tratamiento de sus datos.</li>
                    <li>Portar sus datos a otro proveedor de servicios.</li>
                  </ul>
                  <p className="mt-3">
                    Para ejercer estos derechos, puede contactar con nosotros a través del correo electrónico 
                    privacidad@homimatch.com, incluyendo copia de su DNI o documento identificativo.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mt-6 mb-3">8. Seguridad de los Datos</h2>
                  <p>
                    Implementamos medidas técnicas y organizativas para garantizar la seguridad de sus datos personales 
                    y evitar su alteración, pérdida, tratamiento o acceso no autorizado. Utilizamos servicios de 
                    almacenamiento seguros y encriptación para proteger su información.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mt-6 mb-3">9. Cambios en la Política de Privacidad</h2>
                  <p>
                    Nos reservamos el derecho a modificar esta Política de Privacidad para adaptarla a novedades 
                    legislativas, jurisprudenciales o de interpretación de la Agencia Española de Protección de Datos. 
                    Le informaremos de cualquier cambio a través de nuestro sitio web o por otros medios para que pueda 
                    conocer las modificaciones y, si es necesario, otorgar su consentimiento.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mt-6 mb-3">10. Contacto</h2>
                  <p>
                    Si tiene alguna pregunta o inquietud acerca de nuestra Política de Privacidad o el tratamiento de 
                    sus datos, por favor contáctenos a través de homimatch@gmail.com.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>;
};
export default PrivacyPage;
