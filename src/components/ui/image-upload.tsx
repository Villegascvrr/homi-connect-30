
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Plus, X, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  value?: string | string[];
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  multiple = false,
  value = multiple ? [] : "",
  className
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  // Convert value to array format for consistent handling
  const images = Array.isArray(value) ? value : value ? [value] : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    
    const files = Array.from(e.target.files);
    
    // Simulate file upload with a delay
    setTimeout(() => {
      try {
        const newImages = files.map(file => {
          const url = URL.createObjectURL(file);
          return url;
        });
        
        if (multiple) {
          onChange([...images, ...newImages]);
        } else {
          onChange(newImages[0]);
        }
        
        toast({
          title: "Imagen subida",
          description: "Tu imagen se ha subido correctamente",
        });
      } catch (error) {
        toast({
          title: "Error al subir la imagen",
          description: "Hubo un problema al procesar tu imagen",
          variant: "destructive"
        });
      } finally {
        setIsUploading(false);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }, 1000);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    
    if (multiple) {
      onChange(newImages);
    } else {
      onChange("");
    }
    
    toast({
      title: "Imagen eliminada",
      description: "La imagen se ha eliminado correctamente",
    });
  };

  const handleClickUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={className}>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple={multiple}
      />
      
      {multiple ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group aspect-square rounded-md overflow-hidden bg-muted">
                <img 
                  src={image} 
                  alt={`Imagen ${index + 1}`} 
                  className="w-full h-full object-cover" 
                />
                <button 
                  onClick={() => handleRemoveImage(index)}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                  type="button"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <button
                type="button"
                onClick={handleClickUpload}
                className="flex flex-col items-center justify-center gap-2 aspect-square rounded-md border-2 border-dashed border-primary/20 hover:border-primary/50 transition-colors bg-muted"
                disabled={isUploading}
              >
                <Plus className="h-8 w-8 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Añadir foto</span>
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Puedes subir hasta 5 imágenes para tu perfil. La primera será tu foto principal.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {images.length > 0 ? (
            <div className="relative group">
              <Avatar className="w-24 h-24 md:w-32 md:h-32 mx-auto">
                <AvatarImage src={images[0]} alt="Foto de perfil" />
                <AvatarFallback className="bg-homi-purple text-white">
                  <Camera size={32} />
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 flex gap-2">
                <Button 
                  type="button" 
                  size="icon" 
                  className="h-8 w-8 rounded-full" 
                  onClick={handleClickUpload}
                >
                  <Upload size={14} />
                </Button>
                <Button 
                  type="button" 
                  size="icon" 
                  variant="destructive" 
                  className="h-8 w-8 rounded-full" 
                  onClick={() => handleRemoveImage(0)}
                >
                  <X size={14} />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Avatar className="w-24 h-24 md:w-32 md:h-32 mx-auto border-2 border-dashed border-primary/20 bg-muted">
                <AvatarFallback className="text-muted-foreground">
                  <Camera size={32} />
                </AvatarFallback>
              </Avatar>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClickUpload}
                disabled={isUploading}
                className="mt-2"
              >
                <Camera size={16} className="mr-2" />
                Subir foto de perfil
              </Button>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Sube una foto clara de tu rostro para que otros usuarios puedan identificarte.
          </p>
        </div>
      )}
    </div>
  );
};
