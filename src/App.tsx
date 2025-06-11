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
import ProfileAuthGate from "./components/auth/ProfileAuthGate";
import AdminPage from "./pages/AdminPage";
import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
      retry: 1,
      retryDelay: 500,
      gcTime: Infinity,
    },
  },
});

const PageLoader = () => (
  <div className="flex flex-col justify-center items-center h-[60vh]">
    <Loader2 className="h-8 w-8 animate-spin text-homi-purple" />
    <p className="text-sm text-muted-foreground mt-4">Cargando...</p>
  </div>
);

const App = () => {
  const [authProviderKey, setAuthProviderKey] = useState('initial');
  const [isAppReady, setIsAppReady] = useState(false);
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        queryClient.clear();
        setAuthProviderKey('signed-out-' + Date.now());
      } else if (event === 'SIGNED_IN' && session) {
        queryClient.prefetchQuery({
          queryKey: ['profile', session.user.id],
          queryFn: async () => {
            const { data } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
            return data;
          },
          staleTime: Infinity,
        });
      }
    });
    
    const prefetchBasicData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user?.id) {
          await queryClient.prefetchQuery({
            queryKey: ['profile', session.user.id],
            queryFn: async () => {
              const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
              return data;
            },
            staleTime: Infinity,
          });
        }
        
        setIsAppReady(true);
      } catch (error) {
        console.error("Error prefetching data:", error);
        setIsAppReady(true);
      }
    };
    
    prefetchBasicData();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  if (!isAppReady) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-homi-purple" />
        <p className="text-muted-foreground mt-4">Iniciando aplicación...</p>
      </div>
    );
  }
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider key={authProviderKey}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verified" element={<VerifiedPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/cookies" element={<CookiesPage />} />
                
                <Route path="/auth/callback" element={<VerifiedPage />} />
                <Route path="/callback" element={<VerifiedPage />} />
                
                <Route path="/matching" element={
                  <ProtectedRoute allowPreview={true}>
                    <MatchingPage isPreview={false} />
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={<ProfilePage />} />
                
                <Route path="/profile/:id" element={
                  <ProtectedRoute authComponent={<ProfileAuthGate />} redirectToSignIn={false}>
                    <ProfileViewPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/profile/create" element={
                  <ProtectedRoute authComponent={<ProfileAuthGate />} redirectToSignIn={false}>
                    <ProfileForm />
                  </ProtectedRoute>
                } />
                
                <Route path="/profile/edit" element={
                  <ProtectedRoute authComponent={<ProfileAuthGate />} redirectToSignIn={false}>
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
                
                <Route path="" element={<Navigate to="/" replace />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
