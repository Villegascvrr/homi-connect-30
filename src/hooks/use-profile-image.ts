import { Database } from '@/integrations/supabase/types';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://salayaazmrghyqjddagm.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhbGF5YWF6bXJnaHlxamRkYWdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MTIwNTUsImV4cCI6MjA1OTI4ODA1NX0.9gj_r8FTvbq_DuE4Bw7O-gP2GV8dbemQeUwd4Mwh9to";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

async function useProfileImage(id: string, profile_image_id: string) {
    const { data: { publicUrl } } = supabase.storage
    .from('profile-images')
    .getPublicUrl(`user_${id}/profile${profile_image_id ? `_${profile_image_id}` : ""}.jpeg`);

    return publicUrl;
}

export default useProfileImage;