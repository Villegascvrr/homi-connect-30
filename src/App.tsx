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
import ProfileEditPage from "./components/profiles/ProfileEditPage";
import ProfileViewPage from "./components/profiles/ProfileViewPage";
import ChatPage from "./pages/ChatPage";
import SignInPage from "./pages/SignInPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminPage from "./pages/AdminPage";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Create a new query client with explicit configuration for better loading performance
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
  // Force clean loading state when app starts
  useEffect(() => {
    console.log("App fully initialized");
    
    // Pre-fetch important data
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
          // Pre-fetch user profile data
          queryClient.prefetchQuery({
            queryKey: ['profile', session.user.id],
            queryFn: async () => {
              // Handle any errors here to avoid blocking rendering
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
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Routes with preview for non-authenticated users */}
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
              
              {/* Admin route */}
              <Route path="/admin/profiles" element={
                <ProtectedRoute>
                  <AdminPage />
                </ProtectedRoute>
              } />
              
              {/* Redirects */}
              <Route path="" element={<Navigate to="/" replace />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
