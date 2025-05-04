
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  recordMatchPreference,
  getUserMatches,
  getSeenProfiles,
  ProfileMatch,
  MatchingResult
} from '@/services/MatchingService';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface MatchingProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  imgUrl: string;
  tags: { id: number; name: string }[];
  compatibility: number;
  lifestyle?: {
    cleanliness: string;
    noise: string;
    schedule: string;
    guests: string;
    smoking: string;
  };
  budget?: {
    min: number;
    max: number;
  };
  moveInDate?: string;
}

export function useMatching() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const userId = user?.id;

  // Get potential matches
  const {
    data: potentialMatches = [],
    isLoading: isLoadingPotentials,
    error: potentialsError,
    refetch: refetchPotentials
  } = useQuery({
    queryKey: ['potentialMatches', userId],
    queryFn: async () => {
      if (!userId) return [];

      try {
        // Get profiles that the user has already seen
        const seenProfileIds = await getSeenProfiles(userId);
        
        // Get all profiles except the user's own and ones they've already seen
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', userId)
          .filter('is_profile_active', 'eq', true);
        
        if (error) throw error;
        
        // Filter out profiles that have been seen
        const unseenProfiles = data?.filter(profile => 
          !seenProfileIds.includes(profile.id)
        ) || [];
        
        // Map to matching profile format
        return unseenProfiles.map(profile => mapToMatchingProfile(profile));
      } catch (error) {
        console.error('Error fetching potential matches:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar perfiles potenciales',
          variant: 'destructive'
        });
        return [];
      }
    },
    enabled: !!userId,
  });

  // Get user's matches
  const {
    data: matches = [],
    isLoading: isLoadingMatches,
    error: matchesError,
    refetch: refetchMatches
  } = useQuery({
    queryKey: ['matches', userId],
    queryFn: async () => {
      if (!userId) return [];
      return await getUserMatches(userId);
    },
    enabled: !!userId,
  });

  // Handle like/pass action
  const likeMutation = useMutation({
    mutationFn: async ({ profileId, targetProfileId, action }: { 
      profileId: string; 
      targetProfileId: string; 
      action: 'like' | 'pass' 
    }) => {
      return await recordMatchPreference(profileId, targetProfileId, action);
    },
    onSuccess: (result) => {
      if (result.isMatch) {
        toast({
          title: '¡Es un match!',
          description: 'Ambos han mostrado interés. ¡Ahora pueden chatear!',
          variant: 'default'
        });
        queryClient.invalidateQueries({ queryKey: ['matches', userId] });
      }
      queryClient.invalidateQueries({ queryKey: ['potentialMatches', userId] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'No se pudo registrar tu preferencia',
        variant: 'destructive'
      });
    }
  });

  // Handle like action
  const handleLike = (targetProfileId: string) => {
    if (!userId) return;
    likeMutation.mutate({ profileId: userId, targetProfileId, action: 'like' });
  };

  // Handle pass action
  const handlePass = (targetProfileId: string) => {
    if (!userId) return;
    likeMutation.mutate({ profileId: userId, targetProfileId, action: 'pass' });
  };

  // Map Supabase profile to matching profile format
  const mapToMatchingProfile = (profile: any): MatchingProfile => {
    // Extract lifestyle from JSON if it exists
    let lifestyle = undefined;
    if (profile.lifestyle) {
      const lifestyleData = typeof profile.lifestyle === 'string' 
        ? JSON.parse(profile.lifestyle) 
        : profile.lifestyle;
        
      lifestyle = {
        cleanliness: lifestyleData.cleanliness || '',
        noise: lifestyleData.noise || '',
        schedule: lifestyleData.schedule || '',
        guests: lifestyleData.guests || '',
        smoking: lifestyleData.smoking || '',
      };
    }
    
    // Generate tags from interests
    const tags = (profile.interests || []).map((interest: string, index: number) => ({
      id: index + 1,
      name: interest
    }));
    
    // Calculate age from edad string if possible
    let age = 0;
    if (profile.edad) {
      age = parseInt(profile.edad, 10) || 0;
    }
    
    return {
      id: profile.id,
      name: `${profile.first_name} ${profile.last_name}`.trim(),
      age,
      location: profile.sevilla_zona || 'Sevilla',
      bio: profile.bio || '',
      imgUrl: profile.profile_image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000',
      tags,
      compatibility: Math.floor(Math.random() * 30) + 70, // Random compatibility score between 70-100
      lifestyle,
      budget: undefined, // Add if available in profile data
      moveInDate: undefined // Add if available in profile data
    };
  };

  // Map match to format expected by the UI
  const mapMatchToUIFormat = (match: MatchingResult) => {
    // Determine which profile is the other user (not the current user)
    const otherProfile = match.profileOneId === userId ? match.profileTwo : match.profileOne;
    
    if (!otherProfile) return null;
    
    // Generate tags from interests
    const tags = (otherProfile.interests || []).map((interest: string, index: number) => ({
      id: index + 1,
      name: interest
    }));
    
    // Calculate age from edad string if possible
    let age = 0;
    if (otherProfile.edad) {
      age = parseInt(otherProfile.edad, 10) || 0;
    }
    
    return {
      id: match.id,
      name: `${otherProfile.first_name} ${otherProfile.last_name}`.trim(),
      age,
      location: otherProfile.sevilla_zona || 'Sevilla',
      imgUrl: otherProfile.profile_image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000',
      compatibility: Math.floor(Math.random() * 30) + 70,
      matchDate: match.createdAt,
      tags,
      lastMessage: match.lastMessage,
      lastMessageTime: match.lastMessageTime,
      profileId: otherProfile.id
    };
  };

  // Format matches for UI
  const formattedMatches = matches
    .map(mapMatchToUIFormat)
    .filter(match => match !== null);

  return {
    potentialMatches,
    matches: formattedMatches,
    isLoadingPotentials,
    isLoadingMatches,
    handleLike,
    handlePass,
    refetchPotentials,
    refetchMatches
  };
}
