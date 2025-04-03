
import React, { useState, useEffect } from 'react';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Smartphone, Users, Home, Key, Shield, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import EmailSignup from '@/components/home/EmailSignup';

// Quotes for testimonials
const testimonials = [
  {
    quote: "Homi me ayudó a encontrar un compañero de piso compatible con mi estilo de vida. Ahora compartimos gastos y una gran amistad.",
    author: "María G.",
    location: "Madrid",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop"
  },
  {
    quote: "La aplicación es súper intuitiva. En menos de una semana ya había encontrado varias opciones de pisos que encajaban con mi presupuesto.",
    author: "Carlos P.",
    location: "Barcelona",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop"
  },
  {
    quote: "Lo que más me gusta es la seguridad que ofrece. Poder verificar perfiles y chatear antes de quedar en persona me da mucha tranquilidad.",
    author: "Laura S.",
    location: "Valencia",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop"
  }
];

// Create a mock function to get a random number of registered users between 500-900
const getRegisteredUsers = () => {
  return Math.floor(Math.random() * (900 - 500 + 1) + 500);
};

const Index = () => {
  const { user } = useAuth();
  const [registeredUsers, setRegisteredUsers] = useState(0);
  const [percentComplete, setPercentComplete] = useState(0);
  
  useEffect(() => {
    // Set a mock number of registered users
    const userCount = getRegisteredUsers();
    setRegisteredUsers(userCount);
    
    // Calculate percentage to 1000 users
    const percent = Math.min(Math.round((userCount / 1000) * 100), 99);
    setPercentComplete(percent);
  }, []);
  
  return (
    <>
      <main className="flex-grow">
        <Hero />
        
        <div id="features">
          <Features />
        </div>
        
        {/* Progress section */}
        <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
          <div className="container px-4 mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-8 homi-gradient-text">¡Ayúdanos a lanzar Homi!</h2>
            
            <div className="max-w-md mx-auto mb-10">
              <div className="relative pt-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-homi-purple text-white">
                      Progreso
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-homi-purple">
                      {percentComplete}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-homi-ultraLightPurple">
                  <div style={{ width: `${percentComplete}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-homi-purple transition-all duration-500"></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {registeredUsers} de 1000 usuarios registrados
                </p>
              </div>
            </div>
            
            {!user && (
              <EmailSignup />
            )}
          </div>
        </section>
        
        <div id="how-it-works">
          <HowItWorks />
        </div>
        
        {/* Testimonials Section */}
        <section className="py-16 bg-white dark:bg-background">
          <div className="container px-4 mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12 homi-gradient-text">Lo que dicen nuestros usuarios</h2>
            
            <Carousel className="max-w-4xl mx-auto">
              <CarouselContent>
                {testimonials.map((testimonial, index) => (
                  <CarouselItem key={index} className="md:basis-1/1 lg:basis-1/1">
                    <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl shadow-sm">
                      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                          <img 
                            src={testimonial.avatar} 
                            alt={`Avatar de ${testimonial.author}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-lg italic mb-4">"{testimonial.quote}"</p>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold">{testimonial.author}</p>
                              <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                            </div>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <CheckCircle2 
                                  key={star} 
                                  className="w-5 h-5 text-homi-purple"
                                  fill="currentColor"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-homi-purple to-homi-lightPurple text-white">
          <div className="container px-4 mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">¿Listo para encontrar tu hogar ideal?</h2>
            <p className="max-w-xl mx-auto mb-8 text-white/90">
              Únete a Homi hoy y forma parte de la comunidad que está revolucionando la forma de compartir vivienda en España.
            </p>
            
            {!user ? (
              <Button asChild size="lg" className="bg-white text-homi-purple hover:bg-white/90">
                <Link to="/register">
                  Regístrate ahora <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="bg-white text-homi-purple hover:bg-white/90">
                <Link to="/matching">
                  Explorar coincidencias <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default Index;
