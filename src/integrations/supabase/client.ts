import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://dcoigkhvmqlpemognotp.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjb2lna2h2bXFscGVtb2dub3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0MzkyMjIsImV4cCI6MjA0OTAxNTIyMn0.hUyaJllnxIcPjkTkmdKvXU50HcQ8XEFEKUKtWPqckrU";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const signInWithGoogleOAuth = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/?loggedIn=true`
    }
  });

  if (error) {
    console.error('Error during Google OAuth:', error);
    throw error;
  }

  return data;
};
