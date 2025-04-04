
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload, X, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface ImageUploadProps {
  onChange: (value: string) => void;
  onBlur?: () => void;
  value?: string;
  className?: string;
  disableCompression?: boolean;
  enableCropping?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  onBlur,
  value = "",
  className,
  disableCompression = false,
  enableCropping = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [rotation, setRotation] = useState(0);

  const resetCropper = useCallback(() => {
    setSelectedImage(null);
    setIsCropperOpen(false);
    setRotation(0);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    const file = e.target.files[0];

    // If cropping is enabled for image upload
    if (enableCropping) {
      const reader = new FileReader();
      reader.onload = event => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          setIsCropperOpen(true);
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Simulate file upload with a delay
    setTimeout(() => {
      try {
        // Skip compression if disabled
        const imageUrl = URL.createObjectURL(file);
        onChange(imageUrl);
        
        toast({
          title: "Imagen subida",
          description: "Tu imagen se ha subido correctamente"
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

  const handleRemoveImage = () => {
    onChange("");
    toast({
      title: "Imagen eliminada",
      description: "La imagen se ha eliminado correctamente"
    });
  };

  const handleClickUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const applyImageCrop = () => {
    // In a real implementation, we would apply the crop transformation
    // For now, we'll just use the selected image as-is
    if (selectedImage) {
      onChange(selectedImage);
      toast({
        title: "Imagen actualizada",
        description: "La imagen de perfil se ha actualizado correctamente"
      });
    }
    resetCropper();
  };

  const rotateImage = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  return (
    <div className={className}>
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        onBlur={onBlur} 
        className="hidden" 
      />
      
      <div className="flex flex-col items-center gap-4">
        {value ? (
          <div className="relative">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 mx-auto">
              <AvatarImage src={value} alt="Foto de perfil" className="object-cover" />
              <AvatarFallback className="bg-primary text-white">
                <Camera size={32} />
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 flex gap-2">
              <Button type="button" size="icon" className="h-8 w-8 rounded-full" onClick={handleClickUpload}>
                <Upload size={14} />
              </Button>
              <Button type="button" size="icon" variant="destructive" className="h-8 w-8 rounded-full" onClick={handleRemoveImage}>
                <X size={14} />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Button 
              type="button" 
              onClick={handleClickUpload} 
              disabled={isUploading}
              variant="outline"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center border-2 border-dashed border-primary/20 hover:border-primary/50 transition-colors"
            >
              <Camera size={32} className="text-muted-foreground" />
            </Button>
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

      {/* Image cropping dialog */}
      <Dialog open={isCropperOpen} onOpenChange={setIsCropperOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ajustar foto de perfil</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            {selectedImage && (
              <div className="relative w-64 h-64 mx-auto overflow-hidden border rounded-md">
                <img 
                  src={selectedImage} 
                  alt="Imagen a recortar" 
                  className="w-full h-full object-contain"
                  style={{ transform: `rotate(${rotation}deg)` }}
                />
              </div>
            )}
            <Button onClick={rotateImage} variant="outline" type="button">
              <RefreshCw className="mr-2 h-4 w-4" />
              Rotar
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetCropper} type="button">Cancelar</Button>
            <Button onClick={applyImageCrop} type="button">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
