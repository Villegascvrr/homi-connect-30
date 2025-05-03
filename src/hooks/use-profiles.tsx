
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

  useEffect(() => {
    const fetchProfiles = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
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
          console.log('No profiles found or empty data array');
          setProfiles([]);
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
        
        setProfiles(typedProfiles);
      } catch (err) {
        console.error('Exception fetching profiles:', err);
        setError('Error desconocido al cargar perfiles');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [user, toast]);

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
