
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';

const CookiesPage = () => {
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
              <h1 className="text-3xl font-bold mb-6 text-center">Política de Cookies de Homi</h1>
              <p className="text-muted-foreground mb-6">Última actualización: {currentDate}</p>
              
              <div className="prose prose-slate max-w-none space-y-5">
                <p>
                  Esta Política de Cookies explica qué son las cookies, cómo las utilizamos en Homi y 
                  qué opciones tiene usted en relación con ellas.
                </p>
                
                <div>
                  <h2 className="text-xl font-semibold mt-6 mb-3">1. ¿Qué son las Cookies?</h2>
                  <p>
                    Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita 
                    un sitio web. Se utilizan ampliamente para hacer que los sitios web funcionen de manera más 
                    eficiente, así como para proporcionar información a los propietarios del sitio.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mt-6 mb-3">2. ¿Cómo Utilizamos las Cookies?</h2>
                  <p>
                    En Homi utilizamos cookies para diversos fines, entre ellos:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento del sitio y para proporcionar los servicios solicitados.</li>
                    <li><strong>Cookies de preferencias:</strong> Permiten recordar sus preferencias para mejorar su experiencia.</li>
                    <li><strong>Cookies analíticas:</strong> Nos ayudan a entender cómo los usuarios interactúan con nuestro sitio.</li>
                    <li><strong>Cookies de marketing:</strong> Utilizadas para personalizar los anuncios según sus intereses.</li>
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mt-6 mb-3">3. Tipos de Cookies que Utilizamos</h2>
                  <p>Específicamente, utilizamos los siguientes tipos de cookies:</p>

                  <h3 className="text-lg font-semibold mt-4 mb-2">3.1 Cookies Propias</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Sesión:</strong> Para mantener su sesión activa mientras utiliza nuestro sitio.</li>
                    <li><strong>Preferencias:</strong> Para recordar sus configuraciones y personalización.</li>
                  </ul>

                  <h3 className="text-lg font-semibold mt-4 mb-2">3.2 Cookies de Terceros</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Analytics:</strong> Utilizamos Google Analytics para analizar el tráfico y el uso de nuestro sitio.</li>
                    <li><strong>Redes sociales:</strong> Para permitir la integración con plataformas como Facebook, Twitter e Instagram.</li>
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mt-6 mb-3">4. Control de Cookies</h2>
                  <p>
                    Puede configurar su navegador para rechazar todas las cookies o para que le avise cuando se envía una cookie.
                    Sin embargo, si rechaza las cookies, es posible que algunas partes de nuestro sitio no funcionen correctamente.
                  </p>
                  <p className="mt-3">
                    La mayoría de los navegadores le permiten:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Ver las cookies almacenadas y eliminarlas individualmente.</li>
                    <li>Bloquear cookies de terceros.</li>
                    <li>Bloquear cookies de sitios específicos.</li>
                    <li>Bloquear todas las cookies.</li>
                    <li>Eliminar todas las cookies al cerrar el navegador.</li>
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mt-6 mb-3">5. Enlaces a Políticas de Cookies de Terceros</h2>
                  <p>
                    Para más información sobre cómo nuestros proveedores de servicios utilizan cookies, por favor visite:
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Google Analytics: <a href="https://policies.google.com/privacy" className="text-homi-purple hover:underline">https://policies.google.com/privacy</a></li>
                    <li>Facebook: <a href="https://www.facebook.com/policies/cookies/" className="text-homi-purple hover:underline">https://www.facebook.com/policies/cookies/</a></li>
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mt-6 mb-3">6. Actualizaciones de Nuestra Política de Cookies</h2>
                  <p>
                    Podemos actualizar esta Política de Cookies periódicamente. Le animamos a revisar esta página 
                    con regularidad para estar informado sobre cualquier cambio.
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mt-6 mb-3">7. Contacto</h2>
                  <p>
                    Si tiene alguna pregunta sobre nuestra Política de Cookies, por favor contáctenos a través 
                    de privacidad@homimatch.com.
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

export default CookiesPage;
