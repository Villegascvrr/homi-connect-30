
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import ScrollToTop from "./components/layout/ScrollToTop";
import { AuthProvider } from "./context/AuthContext";
import DevelopmentBanner from "./components/layout/DevelopmentBanner";
import Navbar from "./components/layout/Navbar";
import DemoBanner from "./components/layout/DemoBanner";
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

const queryClient = new QueryClient();

// Main layout with navigation that will be used across protected routes
const MainLayout = () => (
  <>
    <DevelopmentBanner />
    <Navbar />
    <DemoBanner />
    <div className="flex-1">
      <Outlet />
    </div>
  </>
);

// Authentication layout without navigation
const AuthLayout = () => (
  <>
    <DevelopmentBanner />
    <div className="flex-1">
      <Outlet />
    </div>
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Routes>
              {/* Routes with main layout (navbar and demo banner) */}
              <Route element={<MainLayout />}>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                
                {/* Routes with preview for non-authenticated users */}
                <Route path="/matching" element={
                  <ProtectedRoute allowPreview={true}>
                    <MatchingPage isPreview={!queryClient.getQueryCache().findAll().some(
                      query => query.queryKey[0] === 'user'
                    )} />
                  </ProtectedRoute>
                } />
                <Route path="/chat" element={
                  <ProtectedRoute allowPreview={true}>
                    <ChatPage isPreview={!queryClient.getQueryCache().findAll().some(
                      query => query.queryKey[0] === 'user'
                    )} />
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
              </Route>
              
              {/* Auth layout without navbar */}
              <Route element={<AuthLayout />}>
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>
              
              {/* Redirects */}
              <Route path="" element={<Navigate to="/" replace />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
