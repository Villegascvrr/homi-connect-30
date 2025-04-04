
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload, X, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface ImageUploadProps {
  onChange: (value: string | string[]) => void;
  onBlur?: () => void;
  multiple?: boolean;
  value?: string | string[];
  className?: string;
  disableCompression?: boolean;
  enableCropping?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  onBlur,
  multiple = false,
  value = multiple ? [] : "",
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

  // Convert value to array format for consistent handling
  const images = Array.isArray(value) ? value : value ? [value] : [];
  
  const resetCropper = useCallback(() => {
    setSelectedImage(null);
    setIsCropperOpen(false);
    setRotation(0);
  }, []);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    const files = Array.from(e.target.files);

    // If cropping is enabled for single image upload
    if (enableCropping && !multiple && files.length > 0) {
      const reader = new FileReader();
      reader.onload = event => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          setIsCropperOpen(true);
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(files[0]);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Simulate file upload with a delay
    setTimeout(() => {
      try {
        const newImages = files.map(file => {
          // Skip compression if disabled
          if (disableCompression) {
            return URL.createObjectURL(file);
          }

          // Otherwise compress (simulated)
          return URL.createObjectURL(file);
        });
        
        if (multiple) {
          onChange([...images, ...newImages]);
        } else {
          onChange(newImages[0]);
        }
        
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
        multiple={multiple}
      />
      
      {multiple ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group aspect-square rounded-md overflow-hidden bg-muted">
                <img src={image} alt={`Imagen ${index + 1}`} className="w-full h-full object-cover" />
                <button 
                  onClick={() => handleRemoveImage(index)} 
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity" 
                  type="button"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
            ))}
          </div>
          <Button 
            type="button" 
            onClick={handleClickUpload} 
            disabled={isUploading || images.length >= 5} 
            className="w-full"
          >
            <Camera size={16} className="mr-2" />
            {isUploading ? "Subiendo..." : "Añadir imagen"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Puedes subir hasta 5 imágenes para tu perfil.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          {images.length > 0 ? (
            <div className="relative group">
              <Avatar className="w-24 h-24 md:w-32 md:h-32 mx-auto">
                <AvatarImage src={images[0]} alt="Foto de perfil" className="object-cover" />
                <AvatarFallback className="bg-primary text-white">
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
              <Button 
                type="button" 
                onClick={handleClickUpload} 
                disabled={isUploading} 
                className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center border-2 border-dashed border-primary/20 bg-muted hover:border-primary/50 transition-colors"
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
      )}

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
