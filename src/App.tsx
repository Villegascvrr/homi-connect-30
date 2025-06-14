import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from '@/pages/Index';
import RegisterPage from '@/pages/RegisterPage';
import SignInPage from '@/pages/SignInPage';
import MatchingPage from '@/pages/MatchingPage';
import PricingPage from '@/pages/PricingPage';
import SubscriptionPage from '@/pages/SubscriptionPage';
import SuccessPage from '@/pages/SuccessPage';
import ProfilePage from '@/components/profiles/ProfilePage';
import ProfileEditPage from '@/components/profiles/ProfileEditPage';
import ScrollToTop from '@/components/layout/ScrollToTop';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import ChatPage from './pages/ChatPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-background pt-16 md:pt-20">
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/matching" element={<MatchingPage />} />
              <Route path="/precios" element={<PricingPage />} />
              <Route path="/suscripcion" element={<SubscriptionPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/edit" element={<ProfileEditPage />} />
              <Route path="/chat" element={<ChatPage />} />
            </Routes>
            <Toaster />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
