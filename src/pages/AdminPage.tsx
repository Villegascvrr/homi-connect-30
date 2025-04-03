
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProfilesTable from '@/components/admin/ProfilesTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4 mb-6">
          <Card className="border-homi-purple/20 bg-gradient-to-r from-purple-50 to-white">
            <CardHeader>
              <CardTitle className="text-2xl text-homi-purple">Panel de Administración</CardTitle>
              <CardDescription>
                Gestiona y visualiza todos los perfiles registrados en la plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Aquí puedes ver todos los perfiles de usuarios, incluyendo los que tienen campos incompletos.
                  Los perfiles marcados en amarillo tienen información faltante.
                </p>
                <div className="p-3 mt-2 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-700">
                    <strong>Nota sobre valores vacíos:</strong> Si ves valores "No especificado" o "-", el usuario aún no ha completado ese campo en su perfil. 
                    Estos pueden aparecer como cadenas vacías, valores nulos o propiedades que faltan en la base de datos.
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-700">
                    <strong>Estructura de los datos:</strong> Algunos datos como preferencias de búsqueda y estilo de vida se almacenan 
                    en diferentes columnas o como objetos JSON. La aplicación convierte estos datos a un formato legible.
                  </p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-700">
                    <strong>Sobre la estructura:</strong> Los datos de lifestyle se almacenan como un objeto JSON, mientras que otros 
                    campos como hasApartment, genderPreference, etc. se almacenan como columnas separadas. Ambos se muestran de forma unificada 
                    en la interfaz de usuario.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <ProfilesTable />
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
