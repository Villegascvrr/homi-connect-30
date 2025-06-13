
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import DevelopmentBanner from '@/components/layout/DevelopmentBanner';
import ScrollToTop from '@/components/layout/ScrollToTop';

// Lazy load components
const Index = lazy(() => import('@/pages/Index'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const SignInPage = lazy(() => import('@/pages/SignInPage'));
const MatchingPage = lazy(() => import('@/pages/MatchingPage'));
const ChatPage = lazy(() => import('@/pages/ChatPage'));
const AdminPage = lazy(() => import('@/pages/AdminPage'));
const HowItWorksPage = lazy(() => import('@/pages/HowItWorksPage'));
const TermsPage = lazy(() => import('@/pages/TermsPage'));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'));
const CookiesPage = lazy(() => import('@/pages/CookiesPage'));
const VerifiedPage = lazy(() => import('@/pages/VerifiedPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const PricingPage = lazy(() => import('@/pages/PricingPage'));
const SubscriptionPage = lazy(() => import('@/pages/SubscriptionPage'));

// Profile-related pages
const ProfilePage = lazy(() => import('@/components/profiles/ProfilePage'));
const ProfileEditPage = lazy(() => import('@/components/profiles/ProfileEditPage'));
const ProfileViewPage = lazy(() => import('@/components/profiles/ProfileViewPage'));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <ScrollToTop />
            <div className="relative min-h-screen">
              <DevelopmentBanner />
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-homi-purple"></div>
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/signin" element={<SignInPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/profile/edit" element={<ProfileEditPage />} />
                  <Route path="/profile/:id" element={<ProfileViewPage />} />
                  <Route path="/matching" element={<MatchingPage />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="/precios" element={<PricingPage />} />
                  <Route path="/suscripcion" element={<SubscriptionPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/cookies" element={<CookiesPage />} />
                  <Route path="/verified" element={<VerifiedPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <Toaster />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
