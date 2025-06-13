
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
import ScrollToTop from '@/components/layout/ScrollToTop';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/signin" element={<SignInPage />} />
              <Route path="/matching" element={<MatchingPage />} />
              <Route path="/precios" element={<PricingPage />} />
              <Route path="/suscripcion" element={<SubscriptionPage />} />
              <Route path="/success" element={<SuccessPage />} />
            </Routes>
            <Toaster />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
