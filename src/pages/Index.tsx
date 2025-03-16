
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import BusinessModel from '@/components/home/BusinessModel';
import Presentation from '@/components/home/Presentation';
import { Button } from '@/components/ui/button';

const Index = () => {
  // Animation on scroll
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8;
        if (isVisible) {
          el.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger once on load
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <Features />
        <BusinessModel />
        <Presentation />
        
        {/* CTA Section */}
        <section className="py-20 bg-white dark:bg-slate-900 text-homi-purple dark:text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center animate-on-scroll">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                ¿Listo para encontrar a tu compañero ideal?
              </h2>
              <p className="text-xl mb-8 text-muted-foreground">
                Únete a Homi y comienza a conectar con personas compatibles con tu estilo de vida.
              </p>
              <Link to="/matching">
                <Button 
                  size="lg" 
                  className="rounded-full bg-homi-purple text-white hover:bg-homi-purple/90 px-8"
                >
                  Comenzar Ahora
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
