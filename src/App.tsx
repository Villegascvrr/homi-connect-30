
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import RegisterPage from "./pages/RegisterPage";
import SignInPage from "./pages/SignInPage";
import ProfilePage from "./components/profiles/ProfilePage";
import MatchingPage from "./pages/MatchingPage";
import ChatPage from "./pages/ChatPage";
import NotFound from "./pages/NotFound";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import CookiesPage from "./pages/CookiesPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import VerifiedPage from "./pages/VerifiedPage";
import AdminPage from "./pages/AdminPage";
import { Toaster } from "./components/ui/toaster";
import "./App.css";
import ScrollToTop from "./components/layout/ScrollToTop";
import DevelopmentBanner from "./components/layout/DevelopmentBanner";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import ProfileAuthGate from "./components/auth/ProfileAuthGate";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  // Log app initialization
  console.info("App initializing...");

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ScrollToTop />
        <DevelopmentBanner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/register"
            element={
              <ProtectedRoute redirectPath="/profile">
                <RegisterPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signin"
            element={
              <ProtectedRoute redirectPath="/profile">
                <SignInPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileAuthGate>
                  <ProfilePage />
                </ProfileAuthGate>
              </ProtectedRoute>
            }
          />
          <Route 
            path="/matching" 
            element={
              <ProtectedRoute allowPreview>
                <MatchingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chat/:matchId" 
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/verified" element={<VerifiedPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
