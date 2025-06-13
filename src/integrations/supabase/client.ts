
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
    const { data, error } = await supabase.rpc('check_email_exists', {
      email_to_check: email
    });
    
    if (error) {
      console.error('Error checking email exists:', error);
      return false;
    }
    
    return data === true;
  } catch (error) {
    console.error('Error in checkEmailExists:', error);
    return false;
  }
};
