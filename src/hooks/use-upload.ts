import { Database } from '@/integrations/supabase/types';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://salayaazmrghyqjddagm.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhbGF5YWF6bXJnaHlxamRkYWdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MTIwNTUsImV4cCI6MjA1OTI4ODA1NX0.9gj_r8FTvbq_DuE4Bw7O-gP2GV8dbemQeUwd4Mwh9to";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Función para comprimir imagen
export async function compressImage(
  base64String: string, 
  maxWidth: number = 800, 
  maxHeight: number = 800, 
  quality: number = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
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

      // Convertir a base64 con compresión
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };

    img.onerror = () => {
      reject(new Error('Error al cargar la imagen'));
    };

    img.src = base64String;
  });
}

async function useUpload(index: number) {
  // 1. Obtener todos los perfiles con imagen en base64
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, profile_image')
    .not('profile_image', 'is', null)
    .not('profile_image', 'eq', '')
    .range(index+0,index+4);

  if (error) {
    console.error('Error al obtener perfiles:', error);
    return;
  }

  console.log(profiles);

  for (const profile of profiles) {
    const { id, profile_image } = profile;
    if (!profile_image) continue;
    if (!profile_image.startsWith('data:image')) continue; // Solo base64

    try {
      // 2. Comprimir la imagen antes de procesarla
      console.log(`Comprimiendo imagen para usuario ${id}...`);
      const compressedImage = await compressImage(profile_image, 800, 800, 0.8);
      
      // 3. Extraer el tipo y los datos base64 de la imagen comprimida
      const matches = compressedImage.match(/^data:(image\/\w+);base64,(.+)$/);
      if (!matches) {
        console.log(`Formato no reconocido para usuario ${id}`);
        continue;
      }
      const mimeType = matches[1];
      const ext = mimeType.split('/')[1];
      const base64Data = matches[2];
      
      // Convertir base64 a Uint8Array (compatible con navegador)
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // 4. Subir a Supabase Storage
      const filePath = `user_${id}/profile.${ext}`;
      // Elimina la imagen anterior si existe (opcional)
      await supabase.storage.from('profile-images').remove([filePath]);
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, bytes, { upsert: true, contentType: mimeType });

      if (uploadError) {
        console.error(`Error subiendo imagen para usuario ${id}:`, uploadError);
        continue;
      }

      console.log(`Imagen comprimida y subida para usuario ${id}: ${filePath}`);
    } catch (compressionError) {
      console.error(`Error comprimiendo imagen para usuario ${id}:`, compressionError);
      continue;
    }
  }

  console.log('¡Subida de imágenes comprimidas completada!');
}

export default useUpload;