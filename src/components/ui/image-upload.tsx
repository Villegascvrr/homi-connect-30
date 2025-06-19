import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Upload, X, Move, ZoomIn, ZoomOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface ImageUploadProps {
  onChange: (value: string) => void;
  onBlur?: () => void;
  value?: string;
  className?: string;
  disableCompression?: boolean;
  enableCropping?: boolean;
  userId: string;
  profileImageId?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  onBlur,
  value = "",
  className,
  disableCompression = false,
  enableCropping = false,
  userId,
  profileImageId,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const resetCropper = useCallback(() => {
    setSelectedImage(null);
    setIsCropperOpen(false);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setIsDragging(false);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsUploading(true);
    const file = e.target.files[0];

    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

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
          description: "Tu imagen se ha subido correctamente",
          duration: 700
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
    }, 500);
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

  const handleEditImage = () => {
    if (value) {
      setSelectedImage(value);
      setIsCropperOpen(true);
    }
  };

  const processImageWithCanvas = useCallback((imageSrc: string, scale: number, position: { x: number, y: number }): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Set canvas size to a standard profile picture size
        const outputSize = 400;
        canvas.width = outputSize;
        canvas.height = outputSize;

        // Calculate scaled dimensions
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;

        // Calculate the position to center the image with offset
        const offsetX = (outputSize - scaledWidth) / 2 + position.x;
        const offsetY = (outputSize - scaledHeight) / 2 + position.y;

        // Fill background with white
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, outputSize, outputSize);

        // Draw the image with transformations
        ctx.drawImage(
          img,
          offsetX,
          offsetY,
          scaledWidth,
          scaledHeight
        );

        // Convert to data URL directly (more reliable than blob)
        try {
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          console.log('Processed image data URL length:', dataUrl.length);
          resolve(dataUrl);
        } catch (error) {
          console.error('Error converting canvas to data URL:', error);
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = imageSrc;
    });
  }, []);

  const uploadToSupabase = async (rawFile: File): Promise<string | null> => {
    const id = uuidv4();
    const filePath = `user_${userId}/profile_${id}.jpeg`;
    const file = await compressImage(rawFile);

    // Elimina la imagen anterior si existe (opcional, para evitar basura)
    await supabase.storage.from('profile-images').remove([filePath]);

    const { data, error } = await supabase.storage
      .from('profile-images')
      .upload(filePath, file, { upsert: true, contentType: 'image/jpeg' });

    
    if (error) {
      toast({
        title: 'Error al subir la imagen',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
    // Obtener la URL pública
    const { data:{publicUrl} } = supabase.storage.from('profile-images').getPublicUrl(filePath);
    return publicUrl || null;
  };

// Función para comprimir imagen
async function compressImage(
  file: File, 
  maxWidth: number = 800, 
  maxHeight: number = 800, 
  quality: number = 0.9
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    // Crear URL temporal para cargar la imagen
    const imageUrl = URL.createObjectURL(file);
    
    img.onload = () => {
      // Limpiar URL temporal inmediatamente
      URL.revokeObjectURL(imageUrl);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('No se pudo obtener el contexto del canvas'));
        return;
      }

      // Calcular nuevas dimensiones manteniendo la proporción
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      // Configurar canvas con las nuevas dimensiones
      canvas.width = width;
      canvas.height = height;

      // Dibujar imagen redimensionada
      ctx.drawImage(img, 0, 0, width, height);

      // Convertir canvas a blob
      canvas.toBlob((blob) => {
        if (blob) {
          // Crear un nuevo File con el blob comprimido
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve(compressedFile);
        } else {
          reject(new Error('Error al convertir la imagen comprimida'));
        }
      }, 'image/jpeg', quality);
    };

    img.onerror = () => {
      // Limpiar URL temporal en caso de error
      URL.revokeObjectURL(imageUrl);
      reject(new Error('Error al cargar la imagen'));
    };

    img.src = imageUrl;
  });
}

  const applyImageCrop = async () => {
    if (!selectedImage) return;
    try {
      setIsUploading(true);
      // Procesar la imagen (base64)
      const processedImageUrl = await processImageWithCanvas(selectedImage, scale, position);
      // Convertir base64 a Blob
      const res = await fetch(processedImageUrl);
      const blob = await res.blob();
      const file = new File([blob], 'profile.jpeg', { type: 'image/jpeg' });
      // Subir a Supabase Storage
      const publicUrl = await uploadToSupabase(file);
      if (publicUrl) {
        onChange(publicUrl);
        toast({
          title: 'Imagen subida',
          description: 'Tu imagen se ha subido correctamente',
          duration: 700
        });
      }
      resetCropper();
    } catch (error) {
      console.error('Error processing/uploading image:', error);
      toast({
        title: 'Error al procesar la imagen',
        description: 'Hubo un problema al aplicar los ajustes',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const resetAdjustments = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div className="flex flex-col items-center gap-4">
        {value ? (
          <div className="relative">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 mx-auto">
              <AvatarImage src={value} alt="Foto de perfil" className="object-cover" />
              <AvatarFallback className="bg-primary text-white">
                <Camera size={32} />
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 flex gap-1">
              {enableCropping && (
                <Button type="button" size="icon" variant="secondary" className="h-7 w-7 rounded-full" onClick={handleEditImage} title="Ajustar imagen">
                  <Move size={12} />
                </Button>
              )}
              <Button type="button" size="icon" className="h-7 w-7 rounded-full" onClick={handleClickUpload} title="Cambiar imagen">
                <Upload size={12} />
              </Button>
              <Button type="button" size="icon" variant="destructive" className="h-7 w-7 rounded-full" onClick={handleRemoveImage} title="Eliminar imagen">
                <X size={12} />
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
        <p className="text-xs text-muted-foreground text-center">
          Sube una foto clara de tu rostro para que otros usuarios puedan identificarte.
          {enableCropping && " Podrás ajustarla después de subirla."}
        </p>
      </div>

      {/* Image cropping and adjustment dialog */}
      <Dialog open={isCropperOpen} onOpenChange={setIsCropperOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Move className="h-5 w-5" />
              Ajustar foto de perfil
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            {selectedImage && (
              <div className="relative w-80 h-80 mx-auto overflow-hidden border rounded-lg bg-gray-100 cursor-move">
                <img 
                  src={selectedImage} 
                  alt="Imagen a ajustar" 
                  className="w-full h-full object-contain transition-transform duration-200 select-none"
                  style={{ 
                    transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)` 
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  draggable={false}
                />
                {/* Crop preview overlay - circular */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-full h-full relative">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-2 border-white shadow-lg"></div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Adjustment controls */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button onClick={zoomIn} variant="outline" size="sm" type="button" title="Acercar">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button onClick={zoomOut} variant="outline" size="sm" type="button" title="Alejar">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button onClick={resetAdjustments} variant="outline" size="sm" type="button">
                <Move className="mr-2 h-4 w-4" />
                Restablecer
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              Arrastra para posicionar y usa los botones para hacer zoom. El círculo muestra el área que se verá en tu perfil.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetCropper} type="button" disabled={isUploading}>
              Cancelar
            </Button>
            <Button onClick={applyImageCrop} type="button" disabled={isUploading}>
              {isUploading ? "Procesando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
