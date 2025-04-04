
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
import ChatPage from "./pages/ChatPage";
import SignInPage from "./pages/SignInPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminPage from "./pages/AdminPage";
import { useEffect } from "react";

// Create a new query client with explicit configuration for cache stability and better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1, // Only retry once to avoid excessive loading states
      retryDelay: 1000, // Wait 1 second before retrying
    },
  },
});

const App = () => {
  // Force clean loading state when app starts
  useEffect(() => {
    // This helps React Router to fully initialize
    const timeoutId = setTimeout(() => {
      console.log("App fully initialized");
    }, 100);
    
    return () => clearTimeout(timeoutId);
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
                  <MatchingPage isPreview={!queryClient.getQueryData(['user'])} />
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
                  <ProfileForm />
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute allowPreview={true}>
                  <ChatPage isPreview={!queryClient.getQueryData(['user'])} />
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
