import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Register from '@/pages/Register';
import Login from '@/pages/Login';
import Profile from '@/pages/Profile';
import EditProfile from '@/pages/EditProfile';
import Matching from '@/pages/Matching';
import PricingPage from '@/pages/PricingPage';
import SubscriptionPage from '@/pages/SubscriptionPage';
import SuccessPage from '@/pages/SuccessPage';
import ScrollToTop from '@/components/utils/ScrollToTop';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient } from 'react-query';

function App() {
  return (
    <QueryClient>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/matching" element={<Matching />} />
              <Route path="/precios" element={<PricingPage />} />
              <Route path="/suscripcion" element={<SubscriptionPage />} />
              <Route path="/success" element={<SuccessPage />} />
            </Routes>
            <Toaster />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClient>
  );
}

export default App;
