import React from 'react';
import { Button } from "@/components/ui/button";

const ProfilePage = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mi Perfil</h1>
        <Button 
          variant="default" 
          className="bg-homi-purple hover:bg-homi-purple/90"
          onClick={() => window.location.href = '/profile/create'}
        >
          Editar Perfil
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-20 w-20 rounded-full bg-gray-200"></div>
          <div>
            <h2 className="text-xl font-semibold">Nombre de Usuario</h2>
            <p className="text-gray-500">28 años • Madrid</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Sobre mí</h3>
          <p className="text-gray-700">
            Aquí aparecerá la biografía del usuario cuando la complete en el formulario de perfil.
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Intereses</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Música</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Cine</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Lectura</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">+ Añadir más</span>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Estilo de vida</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Horarios</p>
              <p className="text-gray-600">Madrugador/a</p>
            </div>
            <div>
              <p className="text-sm font-medium">Socialización</p>
              <p className="text-gray-600">Moderada</p>
            </div>
            <div>
              <p className="text-sm font-medium">Limpieza</p>
              <p className="text-gray-600">Muy ordenado/a</p>
            </div>
            <div>
              <p className="text-sm font-medium">Ruido</p>
              <p className="text-gray-600">Prefiero silencio</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Lo que busco</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Compañeros</p>
              <p className="text-gray-600">1-2 personas</p>
            </div>
            <div>
              <p className="text-sm font-medium">Género</p>
              <p className="text-gray-600">Cualquiera</p>
            </div>
            <div>
              <p className="text-sm font-medium">Fumadores</p>
              <p className="text-gray-600">No fumadores</p>
            </div>
            <div>
              <p className="text-sm font-medium">Edad</p>
              <p className="text-gray-600">25-35 años</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
