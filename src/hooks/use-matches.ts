import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Tag {
  id: number;
  name: string;
}

interface MatchProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  imgUrl: string;
  compatibility: number;
  matchDate: string;
  messageCount?: number;
  tags: Tag[];
}

export const useMatches = (profileId?: string) => {
  return useQuery<MatchProfile[]>({
    queryKey: ['matches', profileId],
    queryFn: async () => {
      if (!profileId) {
        throw new Error('ProfileId is required');
      }

      try {
        const { data, error } = await Promise.race([
          supabase
            .from('matches')
            .select(`
              id,
              profile_one_id,
              profile_two_id,
              created_at,
              updated_at,
              profile_one_id,
              profile_two_id,
              created_at,
              updated_at,
              profile_one:profile_one_id(id, first_name, last_name, profile_image),
              profile_two:profile_two_id(id, first_name, last_name, profile_image)
            `)
            .or(`profile_one_id.eq.${profileId},profile_two_id.eq.${profileId}`)
            .limit(40),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 10000)
          ),
        ]) as { data: any; error: any };
        
        if (error) {
          console.error('Error fetching profiles:', error);
          throw error;
        }

        if (!data) {
          throw new Error('No data received');
        }

        const matches = data.map((match) => {
          if (match.profile_two_id === profileId) {
            const profile = match.profile_one
            return {
              id: match.id,
              name: `${profile.first_name} ${profile.last_name}`,
              age: profile.edad,
              location: profile.location,
              imgUrl: profile.profile_image,
              compatibility: profile.compatibility,
              matchDate: match.created_at,
              messageCount: 0,
              tags: profile.interests && profile.interests.length > 0 ? profile.interests : [{
                id: 1,
                name: "No se encontraron intereses"
              }],
            }
          } else {
            const profile = match.profile_two
            return {
              id: match.id,
              name: `${profile.first_name} ${profile.last_name}`,
              age: profile.edad,
              location: profile.location,
              imgUrl: profile.profile_image,
              compatibility: profile.compatibility,
              matchDate: match.created_at,
              messageCount: 0,
              tags: profile.interests && profile.interests.length > 0 ? profile.interests : [{
                id: 1,
                name: "No se encontraron intereses"
              }],
            }
          }
        })
        console.log("matches", matches);
        console.log("id", profileId);
        return matches;
      } catch (error) {
        console.error('Query error:', error);
        throw error;
      }
    },
    enabled: !!profileId,
    retry: 1,
    gcTime: 1000 * 60 * 30,
    staleTime: 1000 * 60 * 5,
  });
}; 