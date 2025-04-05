import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import { useToast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) {
        console.log("No user ID available for profile fetch");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching profile data for user ID:", user.id);
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error("Error fetching profile:", error.message);
          setError("No se pudo cargar el perfil. Por favor, inténtalo de nuevo.");
          throw error;
        }

        console.log("Profile data fetched:", data);
        
        if (!data) {
          console.log("No profile data found, redirecting to profile creation");
          navigate('/profile/create');
          return;
        }
        
        setProfile(data);
      } catch (err) {
        console.error("Error in fetchProfileData:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfileData();
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-homi-purple border-t-transparent mb-4"></div>
            <p className="text-sm text-muted-foreground">Cargando perfil...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <h1 className="text-2xl font-bold mb-4">Error al cargar el perfil</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>Reintentar</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <h1 className="text-2xl font-bold mb-4">Perfil no encontrado</h1>
            <p className="text-muted-foreground mb-6">No hemos podido encontrar tu perfil.</p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/profile/create')}>Crear perfil</Button>
              <Button variant="outline" onClick={() => navigate('/')}>Ir a inicio</Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h1 className="text-3xl font-bold mb-6">Tu Perfil</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={profile.profile_image || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="rounded-full w-32 h-32 mx-auto mb-4"
                  />
                  <h2 className="text-xl font-semibold text-center">
                    {profile.first_name} {profile.last_name}
                  </h2>
                  <p className="text-gray-600 text-center">@{profile.username}</p>
                </div>
                <div>
                  <p>
                    <strong>Email:</strong> {profile.email}
                  </p>
                  <p>
                    <strong>Edad:</strong> {profile.edad}
                  </p>
                  <p>
                    <strong>Ubicación:</strong> {profile.ubicacion}
                  </p>
                  <p>
                    <strong>Universidad:</strong> {profile.universidad}
                  </p>
                  <p>
                    <strong>Ocupación:</strong> {profile.ocupacion}
                  </p>
                  <p>
                    <strong>Bio:</strong> {profile.bio}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Button onClick={() => navigate('/profile/edit')}>Editar Perfil</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
