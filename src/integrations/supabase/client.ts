
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://salayaazmrghyqjddagm.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhbGF5YWF6bXJnaHlxamRkYWdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MTIwNTUsImV4cCI6MjA1OTI4ODA1NX0.9gj_r8FTvbq_DuE4Bw7O-gP2GV8dbemQeUwd4Mwh9to";

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

export const hasStoredSession = (): boolean => {
  try {
    const sessionStr = localStorage.getItem('homi-auth-session');
    if (!sessionStr) return false;
    
    const sessionData = JSON.parse(sessionStr);
    if (!sessionData.expires_at) return false;
    
    const isExpired = new Date(sessionData.expires_at * 1000) < new Date();
    return !isExpired;
  } catch (error) {
    console.error('Error checking stored session:', error);
    return false;
  }
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking email exists:', error);
      return false;
    }
    
    return data !== null;
  } catch (error) {
    console.error('Error in checkEmailExists:', error);
    return false;
  }
};
