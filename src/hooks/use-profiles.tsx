import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useDeveloperMode } from '@/context/DeveloperModeContext';

export interface ProfileLifestyle {
  cleanliness: string;
  noise: string;
  schedule: string;
  guests: string;
  smoking: string;
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  bio: string | null;
  ocupacion: string | null;
  edad: string | null;
  profile_image: string | null;
  interests: string[] | null;
  lifestyle: ProfileLifestyle | null;
  sevilla_zona: string | null;
  companeros_count: string | null;
  universidad: string | null;
  is_profile_active: boolean | null;
}

export type MatchProfile = {
  id: string;
  name: string;
  age: number;
  location: string;
  occupation: string;
  bio: string;
  compatibility: number;
  profileImage: string;
  interests: string[];
  lifestyle: {
    cleanliness: string;
    noise: string;
    schedule: string;
    guests: string;
    smoking: string;
  };
  budget: {
    min: number;
    max: number;
  };
  username: string;
};

// Datos de ejemplo para uso en desarrollo
const mockProfiles: MatchProfile[] = [
  {
    id: "demo-1",
    name: "Laura García",
    age: 24,
    location: "Madrid",
    occupation: "Estudiante de Medicina",
    bio: "Buscando piso compartido cerca del hospital. Soy tranquila y ordenada.",
    compatibility: 95,
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
    interests: ["lectura", "viajes", "música"],
    lifestyle: {
      cleanliness: "Muy ordenada",
      noise: "Tranquila",
      schedule: "diurno",
      guests: "Ocasionalmente",
      smoking: "No"
    },
    budget: {
      min: 400,
      max: 600
    },
    username: "lauragarcia"
  },
  {
    id: "demo-2",
    name: "Carlos Martínez",
    age: 28,
    location: "Barcelona",
    occupation: "Desarrollador Web",
    bio: "Busco compañero/a de piso en Barcelona. Trabajo desde casa la mayoría de días.",
    compatibility: 82,
    profileImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
    interests: ["tecnología", "gaming", "deportes"],
    lifestyle: {
      cleanliness: "Normal",
      noise: "Normal",
      schedule: "flexible",
      guests: "Frecuentemente",
      smoking: "No"
    },
    budget: {
      min: 500,
      max: 800
    },
    username: "carlosm"
  },
  {
    id: "demo-3",
    name: "Ana López",
    age: 26,
    location: "Valencia",
    occupation: "Diseñadora Gráfica",
    bio: "Creativa, ordenada y sociable. Busco piso cerca del centro con buen ambiente.",
    compatibility: 78,
    profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop&ixlib=rb-4.0.3",
    interests: ["arte", "fotografía", "viajes"],
    lifestyle: {
      cleanliness: "Muy ordenada",
      noise: "Sociable",
      schedule: "diurno",
      guests: "Ocasionalmente",
      smoking: "Sí"
    },
    budget: {
      min: 350,
      max: 550
    },
    username: "analopez"
  }
];

// Map from database profile to the format expected by the matching system
export const mapProfileToMatchProfile = (profile: Profile): MatchProfile => {
  return {
    id: profile.id,
    name: `${profile.first_name} ${profile.last_name}`.trim(),
    age: profile.edad ? parseInt(profile.edad) : 25,
    location: profile.sevilla_zona || 'Madrid',
    occupation: profile.ocupacion || 'Estudiante',
    bio: profile.bio || 'Sin descripción',
    compatibility: Math.floor(Math.random() * 30) + 70, // Placeholder compatibility score 70-100
    profileImage: profile.profile_image || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 10000000)}?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3`,
    interests: profile.interests || ['música', 'viajes', 'deporte'],
    lifestyle: profile.lifestyle || {
      cleanliness: "Normal",
      noise: "Normal",
      schedule: "diurno",
      guests: "Ocasionalmente",
      smoking: "No"
    },
    budget: {
      min: 400,
      max: 700
    },
    username: profile.username
  };
};

export const useFetchProfiles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { isDeveloperMode } = useDeveloperMode();

  // Determine if we're in development mode via various checks
  const isDevelopmentMode = () => {
    // Developer mode flag takes precedence if explicitly set
    if (isDeveloperMode) {
      return true;
    }
    
    // If not explicitly in developer mode but we're in a development environment
    const isLocalhost = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.hostname.includes('gitpod.io') ||
                      window.location.hostname.includes('lovable');
    
    // Check URL parameters - useful for testing
    const urlParams = new URLSearchParams(window.location.search);
    const devMode = urlParams.get('devMode') === 'true';
    
    return devMode || isLocalhost;
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        
        // If we're in developer mode or development environment, show all profiles
        // Otherwise in production, only show mock profiles for regular users
        if (isDevelopmentMode()) {
          console.log("[DEV MODE] Fetching real user profiles from database");
          
          if (!user) {
            setLoading(false);
            return;
          }
          
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .neq('id', user.id) // Exclude the current user
            .eq('is_profile_active', true); // Only active profiles
          
          if (error) {
            console.error('Error fetching profiles:', error);
            setError(error.message);
            toast({
              title: 'Error',
              description: 'No se pudieron cargar los perfiles',
              variant: 'destructive'
            });
            setLoading(false);
            return;
          }
          
          if (!data || data.length === 0) {
            console.log('No real profiles found or empty data array');
            
            // If no real profiles found, fall back to mock profiles in developer mode
            if (isDeveloperMode) {
              console.log("[DEV MODE] No real profiles found, showing mock profiles");
              const mockProfilesRaw: Profile[] = mockProfiles.map(mock => ({
                id: mock.id,
                first_name: mock.name.split(' ')[0],
                last_name: mock.name.includes(' ') ? mock.name.split(' ').slice(1).join(' ') : '',
                username: mock.username,
                email: `${mock.username}@example.com`,
                bio: mock.bio,
                ocupacion: mock.occupation,
                edad: mock.age.toString(),
                profile_image: mock.profileImage,
                interests: mock.interests,
                lifestyle: mock.lifestyle,
                sevilla_zona: mock.location,
                companeros_count: '1',
                universidad: null,
                is_profile_active: true
              }));
              
              setProfiles(mockProfilesRaw);
            } else {
              setProfiles([]);
            }
            
            setLoading(false);
            return;
          }
          
          // Map database profiles to our Profile interface, ensuring lifestyle is properly typed
          const typedProfiles = data.map(dbProfile => {
            // Convert lifestyle from JSON to ProfileLifestyle or null
            let lifestyle: ProfileLifestyle | null = null;
            
            if (dbProfile.lifestyle) {
              try {
                // If it's already an object, use it directly
                if (typeof dbProfile.lifestyle === 'object') {
                  lifestyle = dbProfile.lifestyle as unknown as ProfileLifestyle;
                } else if (typeof dbProfile.lifestyle === 'string') {
                  // If it's a string, parse it
                  lifestyle = JSON.parse(dbProfile.lifestyle);
                }
              } catch (e) {
                console.error('Error parsing lifestyle:', e);
              }
            }

            return {
              ...dbProfile,
              lifestyle
            } as Profile;
          });
          
          console.log(`[DEV MODE] Fetched ${typedProfiles.length} real profiles`);
          setProfiles(typedProfiles);
        } else {
          // For regular users in production, show mock profiles
          console.log("[PRODUCTION MODE] Showing mock profiles for regular users");
          setTimeout(() => {
            const mockProfilesRaw: Profile[] = mockProfiles.map(mock => ({
              id: mock.id,
              first_name: mock.name.split(' ')[0],
              last_name: mock.name.includes(' ') ? mock.name.split(' ').slice(1).join(' ') : '',
              username: mock.username,
              email: `${mock.username}@example.com`,
              bio: mock.bio,
              ocupacion: mock.occupation,
              edad: mock.age.toString(),
              profile_image: mock.profileImage,
              interests: mock.interests,
              lifestyle: mock.lifestyle,
              sevilla_zona: mock.location,
              companeros_count: '1',
              universidad: null,
              is_profile_active: true
            }));
            
            setProfiles(mockProfilesRaw);
            setLoading(false);
          }, 800);
          return;
        }
      } catch (err) {
        console.error('Exception fetching profiles:', err);
        setError('Error desconocido al cargar perfiles');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [user, toast, isDeveloperMode]);

  return { profiles, loading, error };
};

export const useProfileMatches = () => {
  const { profiles, loading: profilesLoading } = useFetchProfiles();
  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const generateMatches = async () => {
      if (profilesLoading) {
        return;
      }

      try {
        // Convert all profiles to the format expected by the matching system
        const matchProfiles = profiles.map(mapProfileToMatchProfile);
        
        // In the future, we can implement a real matching algorithm here
        // For now, we'll just use all profiles as matches with random compatibility scores
        setMatches(matchProfiles);
        setLoading(false);
        
        console.log(`[Matches] Generated ${matchProfiles.length} potential matches`);
      } catch (err) {
        console.error('Error generating matches:', err);
        toast({
          title: 'Error',
          description: 'No se pudieron generar matches',
          variant: 'destructive'
        });
        setLoading(false);
      }
    };

    generateMatches();
  }, [profiles, profilesLoading, user, toast]);

  return { matches, loading };
};
