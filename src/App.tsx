
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import ScrollToTop from "./components/layout/ScrollToTop";
import Index from "./pages/Index";
import MatchingPage from "./pages/MatchingPage";
import ProfilePage from "./components/profiles/ProfilePage";
import ProfileForm from "./components/profiles/ProfileForm";
import ProfileViewPage from "./components/profiles/ProfileViewPage";
import ChatPage from "./pages/ChatPage";
import SignInPage from "./pages/SignInPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop /> {/* ScrollToTop component will handle all scrolling behavior */}
        <Routes>
          {/* Redirect root path to index */}
          <Route path="/" element={<Index />} />
          {/* Redirect any unspecified path to index */}
          <Route path="" element={<Navigate to="/" replace />} />
          <Route path="/matching" element={<MatchingPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:id" element={<ProfileViewPage />} />
          <Route path="/profile/create" element={<ProfileForm />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
