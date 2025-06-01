import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  edad: string;
  location: string;
  occupation: string;
  bio: string;
  compatibility: number;
  profile_image: string;
  interests: string[];
  is_profile_active: boolean;
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
}

export const useProfiles = () => {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      try {
        const { data, error } = await Promise.race([
          supabase
            .from('profiles')
            .select('*')
            .eq('first_name', "Manuel")
            .limit(50), // Limitamos a 10 perfiles inicialmente
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 10000)
          ),
        ]) as { data: any; error: any };

        console.log("data", data)
        if (error) {
          console.error('Error fetching profiles:', error);
          throw error;
        }

        if (!data) {
          throw new Error('No data received');
        }

        return data;
      } catch (error) {
        console.error('Query error:', error);
        throw error;
      }
    },
    retry: 1,
    gcTime: 1000 * 60 * 30, // Mantener en cache por 30 minutos
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });
}; 