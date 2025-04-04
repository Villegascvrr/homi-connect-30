import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Share, Heart, Home, Briefcase, GraduationCap, UserCheck, AtSign, Camera, ChevronLeft, ChevronRight, Search, Check, X, DollarSign, Calendar, MapPin, Users, Save, Pencil, Download, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/context/AuthContext';
import { type Json } from '@/integrations/supabase/types';
import { FormImageUpload } from "@/components/ui/form-image-upload";
import { QRCodeSVG } from 'qrcode.react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ensureImageString, ensureImageArray } from '@/utils/image-helpers';

// [Previous interfaces and constants remain exactly the same as in the original file]

const ProfilePage = () => {
  // [Previous state declarations and other hooks remain exactly the same]

  const handleSaveProfileImage = async (imageValue: string | string[]) => {
    if (!user) return;
    setIsSaving(true);
    try {
      const imageUrl = ensureImageString(imageValue);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          profile_image: imageUrl
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setProfile(prev => ({
        ...prev,
        imgUrl: imageUrl
      }));
      
      await refreshUser();
      
      toast({
        title: "Imagen actualizada",
        description: "Tu foto de perfil ha sido actualizada correctamente"
      });
    } catch (error: any) {
      console.error("Error saving profile image:", error);
      toast({
        title: "Error al guardar",
        description: error.message || "No se pudo actualizar la imagen de perfil",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleAddToGallery = async (imageValue: string | string[]) => {
    if (!user) return;
    setIsSaving(true);
    try {
      const imageUrl = ensureImageString(imageValue);
      
      const newGallery = [...(profile.galleryImgs || []), imageUrl];
      const { error } = await supabase
        .from('profiles')
        .update({
          gallery_images: newGallery
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setProfile(prev => ({
        ...prev,
        galleryImgs: newGallery
      }));
      
      setShowAddImageDialog(false);
      setTempImageUrl("");
      
      toast({
        title: "Imagen añadida",
        description: "La imagen ha sido añadida a tu galería"
      });
    } catch (error: any) {
      console.error("Error adding gallery image:", error);
      toast({
        title: "Error al añadir imagen",
        description: error.message || "No se pudo añadir la imagen a la galería",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // [Rest of the component code remains exactly the same as in the original file]
};

export default ProfilePage;
