import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ProfileMatch {
  id: string;
  profileId: string;
  targetProfileId: string;
  status: 'like' | 'pass';
  createdAt: string;
}

export interface MatchingResult {
  id: string;
  profileOneId: string;
  profileTwoId: string;
  createdAt: string;
  profileOne?: any;
  profileTwo?: any;
  lastMessage?: string;
  lastMessageTime?: string;
}

/**
 * Records a user's preference for another profile (like or pass)
 */
export const recordMatchPreference = async (
  profileId: string,
  targetProfileId: string,
  status: 'like' | 'pass'
): Promise<{ data: ProfileMatch | null; isMatch: boolean; error: Error | null }> => {
  try {
    // Temporarily cast to any to bypass TypeScript issues with new tables
    const supabaseAny = supabase as any;
    
    // Check if this preference already exists
    const { data: existingPreference } = await supabaseAny
      .from('profile_matches')
      .select('*')
      .eq('profile_id', profileId)
      .eq('target_profile_id', targetProfileId)
      .single();

    if (existingPreference) {
      // If preference already exists and it's the same, just return it
      if (existingPreference.status === status) {
        return { data: existingPreference as ProfileMatch, isMatch: false, error: null };
      }
      
      // Otherwise update it
      const { data, error } = await supabaseAny
        .from('profile_matches')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', existingPreference.id)
        .select('*')
        .single();

      if (error) throw error;
      
      const matchData = mapToProfileMatch(data);
      
      // Check if this creates a mutual match
      if (status === 'like') {
        const isMatch = await checkForMutualMatch(profileId, targetProfileId);
        return { data: matchData, isMatch, error: null };
      }
      
      return { data: matchData, isMatch: false, error: null };
    }

    // Create a new preference record
    const { data, error } = await supabaseAny
      .from('profile_matches')
      .insert({
        profile_id: profileId,
        target_profile_id: targetProfileId,
        status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error) throw error;
    
    const matchData = mapToProfileMatch(data);
    
    // Check if this creates a mutual match
    if (status === 'like') {
      const isMatch = await checkForMutualMatch(profileId, targetProfileId);
      
      if (isMatch) {
        await createMatchRecord(profileId, targetProfileId);
      }
      
      return { data: matchData, isMatch, error: null };
    }
    
    return { data: matchData, isMatch: false, error: null };
  } catch (error) {
    console.error('Error recording match preference:', error);
    return { data: null, isMatch: false, error: error as Error };
  }
};

/**
 * Checks if there is a mutual like between two profiles
 */
const checkForMutualMatch = async (profileId: string, targetProfileId: string): Promise<boolean> => {
  // Temporarily cast to any to bypass TypeScript issues with new tables
  const supabaseAny = supabase as any;
  
  const { data, error } = await supabaseAny
    .from('profile_matches')
    .select('*')
    .eq('profile_id', targetProfileId)
    .eq('target_profile_id', profileId)
    .eq('status', 'like')
    .single();

  if (error && error.code === 'PGRST116') {
    // No match found
    return false;
  } else if (error) {
    console.error('Error checking for mutual match:', error);
    return false;
  }

  return !!data;
};

/**
 * Creates a record of a mutual match between two profiles
 */
const createMatchRecord = async (profileOneId: string, profileTwoId: string): Promise<void> => {
  try {
    // Temporarily cast to any to bypass TypeScript issues with new tables
    const supabaseAny = supabase as any;
    
    // Check if match already exists
    const { data: existingMatch } = await supabaseAny
      .from('matches')
      .select('*')
      .or(`profile_one_id.eq.${profileOneId},profile_one_id.eq.${profileTwoId}`)
      .or(`profile_two_id.eq.${profileOneId},profile_two_id.eq.${profileTwoId}`)
      .maybeSingle();

    if (existingMatch) {
      // Match already exists
      return;
    }

    // Create new match record
    const { error } = await supabaseAny
      .from('matches')
      .insert({
        profile_one_id: profileOneId,
        profile_two_id: profileTwoId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error creating match record:', error);
    toast({
      title: 'Error',
      description: 'No se pudo crear el registro de match',
      variant: 'destructive'
    });
  }
};

/**
 * Gets all mutual matches for a user
 */
export const getUserMatches = async (userId: string): Promise<MatchingResult[]> => {
  try {
    // Temporarily cast to any to bypass TypeScript issues with new tables
    const supabaseAny = supabase as any;
    
    const { data, error } = await supabaseAny
      .from('matches')
      .select(`
        *,
        profile_one:profile_one_id(*),
        profile_two:profile_two_id(*)
      `)
      .or(`profile_one_id.eq.${userId},profile_two_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Get last message for each match
    const matchesWithMessages = await Promise.all(
      (data || []).map(async (match: any) => {
        const { data: messages } = await supabaseAny
          .from('messages')
          .select('*')
          .eq('match_id', match.id)
          .order('created_at', { ascending: false })
          .limit(1);

        const lastMessage = messages && messages.length > 0 ? messages[0] : null;

        return {
          id: match.id,
          profileOneId: match.profile_one_id,
          profileTwoId: match.profile_two_id,
          createdAt: match.created_at,
          profileOne: match.profile_one,
          profileTwo: match.profile_two,
          lastMessage: lastMessage?.content,
          lastMessageTime: lastMessage?.created_at
        };
      })
    );

    return matchesWithMessages;
  } catch (error) {
    console.error('Error getting user matches:', error);
    toast({
      title: 'Error',
      description: 'No se pudieron cargar tus matches',
      variant: 'destructive'
    });
    return [];
  }
};

/**
 * Gets all profiles that have been shown to the user previously
 */
export const getSeenProfiles = async (userId: string): Promise<string[]> => {
  try {
    // Temporarily cast to any to bypass TypeScript issues with new tables
    const supabaseAny = supabase as any;
    
    const { data, error } = await supabaseAny
      .from('profile_matches')
      .select('target_profile_id')
      .eq('profile_id', userId);

    if (error) throw error;

    return data.map((item: any) => item.target_profile_id);
  } catch (error) {
    console.error('Error getting seen profiles:', error);
    return [];
  }
};

/**
 * Maps the database record to a ProfileMatch type
 */
const mapToProfileMatch = (data: any): ProfileMatch => {
  return {
    id: data.id,
    profileId: data.profile_id,
    targetProfileId: data.target_profile_id,
    status: data.status,
    createdAt: data.created_at
  };
};
