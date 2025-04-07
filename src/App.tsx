
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/layout/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import MatchingPage from "./pages/MatchingPage";
import ProfilePage from "./components/profiles/ProfilePage";
import ProfileForm from "./components/profiles/ProfileForm";
import ProfileViewPage from "./components/profiles/ProfileViewPage";
import ProfileEditPage from "./components/profiles/ProfileEditPage";
import ChatPage from "./pages/ChatPage";
import SignInPage from "./pages/SignInPage";
import RegisterPage from "./pages/RegisterPage";
import VerifiedPage from "./pages/VerifiedPage";
import NotFound from "./pages/NotFound";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import CookiesPage from "./pages/CookiesPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminPage from "./pages/AdminPage";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true, 
      staleTime: 1000 * 10, // 10 seconds for faster response
      retry: 1,
      retryDelay: 500, // Faster retry to improve UX
    },
  },
});

const App = () => {
  // Use a key to force re-render of AuthProvider when auth state changes
  const [authProviderKey, setAuthProviderKey] = useState('initial');
  
  useEffect(() => {
    console.log("App fully initialized");
    
    // Set up listener for auth state changes to force AuthProvider re-initialization
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        console.log("Auth state change detected: SIGNED_OUT - Forcing AuthProvider reset");
        setAuthProviderKey('signed-out-' + Date.now());
      } else if (event === 'SIGNED_IN') {
        console.log("Auth state change detected: SIGNED_IN - Forcing AuthProvider reset");
        setAuthProviderKey('signed-in-' + Date.now());
      }
    });
    
    const prefetchBasicData = async () => {
      try {
        const { data: { session } } = await queryClient.fetchQuery({
          queryKey: ['session'],
          queryFn: async () => {
            return await supabase.auth.getSession();
          },
          staleTime: 1000 * 60 * 5, // 5 minutes
        });
        
        if (session?.user?.id) {
          console.log("User is authenticated, prefetching profile data");
          queryClient.prefetchQuery({
            queryKey: ['profile', session.user.id],
            queryFn: async () => {
              try {
                const { data } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', session.user.id)
                  .maybeSingle();
                return data;
              } catch (error) {
                console.error("Error prefetching profile:", error);
                return null;
              }
            },
            staleTime: 1000 * 30, // 30 seconds
          });
        }
      } catch (error) {
        console.error("Error prefetching data:", error);
      }
    };
    
    prefetchBasicData();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider key={authProviderKey}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verified" element={<VerifiedPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/cookies" element={<CookiesPage />} />
              
              {/* Auth callback routes - Ensure we catch all possible callback paths */}
              <Route path="/auth/callback" element={<VerifiedPage />} />
              <Route path="/callback" element={<VerifiedPage />} />
              
              <Route path="/matching" element={
                <ProtectedRoute allowPreview={true}>
                  <MatchingPage isPreview={false} />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/profile/:id" element={
                <ProtectedRoute>
                  <ProfileViewPage />
                </ProtectedRoute>
              } />
              <Route path="/profile/create" element={
                <ProtectedRoute>
                  <ProfileForm />
                </ProtectedRoute>
              } />
              <Route path="/profile/edit" element={
                <ProtectedRoute>
                  <ProfileEditPage />
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute allowPreview={true}>
                  <ChatPage isPreview={false} />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/profiles" element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              } />
              
              {/* Handle empty routes */}
              <Route path="" element={<Navigate to="/" replace />} />
              
              {/* Catch all other routes with NotFound page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
