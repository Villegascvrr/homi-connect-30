import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import useProfileImage from './use-profile-image';

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
  profile_image_id: string;
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

export const useProfiles = (profileId?: string) => {
  if(!profileId ){
    return useQuery({
      queryKey: ['profiles', profileId],
      queryFn: async () => {
        try {
          const { data, error } = await Promise.race([
            supabase
              .from('profiles')
              .select(`
                id,
                first_name,
                last_name,
                username,
                email,
                edad,
                ocupacion,
                universidad,
                bio,
                gallery_images,
                profile_image_id,
                interests,
                lifestyle,
                is_profile_active,
                sevilla_zona,
                companeros_count,
                completed,
                discards:profile_discards!profile_discards_target_profile_id_fkey (id, profile_id, target_profile_id),
                matches:profile_matches!profile_matches_target_profile_id_fkey (id, profile_id, target_profile_id)
              `)
              .eq('completed', true),
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
  
          const profiles: Profile[] = [];
          
          for (const profile of data) {
            const profileImage = await useProfileImage(profile.id, profile.profile_image_id);
            profiles.push({ ...profile, profile_image: profileImage });
          }
          
          return profiles;
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
  }

  
  return useQuery({
    queryKey: ['profiles', profileId],
    queryFn: async () => {
      if (!profileId) {
        throw new Error('ProfileId is required');
      }
     
      let skips = 0;
      try {
        const { data } = await supabase
          .from('profiles')
          .select('skips')
          .eq('id', profileId)
          .single();
        skips = data?.skips || 0;
      } catch (error) {
        console.error('Error fetching profiles:', error);
        throw error;
      }

      try {
        const { data, error } = await Promise.race([
          supabase
            .from('profiles')
            .select(`
              id,
              first_name,
              last_name,
              username,
              email,
              edad,
              ocupacion,
              universidad,
              bio,
              gallery_images,
              interests,
              lifestyle,
              is_profile_active,
              sevilla_zona,
              companeros_count,
              discards:profile_discards!profile_discards_target_profile_id_fkey (id, profile_id, target_profile_id),
              matches:profile_matches!profile_matches_target_profile_id_fkey (id, profile_id, target_profile_id)
            `)
            .not('id', 'eq', profileId)
            .eq('completed', true),
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

        const profiles: Profile[] = [];
        
        for (const profile of data) {
          if (profile.discards.length === 0 && profile.matches.length === 0) {
            const profileImage = await useProfileImage(profile.id, profile.profile_image_id);
            profiles.push({ ...profile, profile_image: profileImage });
            continue;
          }

          if (profile.matches.length > 0) {
            let shouldSkip = false;
            for (const match of profile.matches) {
              if (match.profile_id === profileId) {
                shouldSkip = true;
                break;
              }
            }
            if (shouldSkip) continue;
          }

          if (profile.discards.length > 0) {
            let shouldSkip = false;
            for (const discard of profile.discards) {
              if (discard.profile_id === profileId) {
                shouldSkip = true;
                break;
              }
            }
            if (shouldSkip) continue;
          }
          
          const profileImage = await useProfileImage(profile.id, profile.profile_image_id);
          profiles.push({ ...profile, profile_image: profileImage });
        }
        
        return profiles;
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