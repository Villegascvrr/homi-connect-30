
import React from 'react';
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import ProfileForm from "./ProfileForm";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProfileEditPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-12 bg-gray-50">
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
            
            {/* Form */}
            <ProfileForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileEditPage;
