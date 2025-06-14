
import React, { useEffect, useState } from 'react';
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import ProfileForm from "./ProfileForm";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const ProfileEditPage = () => {
  const { user, session, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  
  useEffect(() => {
    // Set a timeout to prevent infinite loading state
    const timer = setTimeout(() => {
      setAuthCheckComplete(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (!loading && !user && authCheckComplete) {
      navigate("/signin", { state: { from: "/profile/edit" } });
    }
  }, [user, loading, navigate, authCheckComplete]);

  if (loading && !authCheckComplete) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20 pb-12 bg-gray-50">
          <div className="container mx-auto px-4 flex justify-center items-center h-64">
            <div className="text-center">
              <div className="h-8 w-8 mx-auto mb-4 animate-spin rounded-full border-2 border-homi-purple border-t-transparent"></div>
              <p className="text-muted-foreground">Verificando tu sesión...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user && authCheckComplete) {
    return null; // Will be redirected by the useEffect
  }

  const handleProfileSaved = () => {
    // Set a small delay to ensure state updates are processed
    setTimeout(() => {
      // Redirect to the profile page after successful save
      navigate('/profile', { replace: true });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-5 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold">Editar Perfil</h1>
                <button 
                  onClick={() => navigate('/profile')}
                  className="text-sm text-homi-purple hover:text-homi-purple/80"
                >
                  Volver a tu perfil
                </button>
              </div>
            </div>
            
            {/* Form with onSaved callback to trigger navigation */}
            <ProfileForm 
              onSaved={handleProfileSaved}
              cancelEdit={() => navigate('/profile')}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileEditPage;
