
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
                    Estos pueden aparecer como cadenas vacías o valores nulos en la base de datos.
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-700">
                    <strong>Información importante:</strong> Los datos del perfil se almacenan como cadenas de texto vacías ('') cuando no se proporcionan valores, 
                    y se muestran como "No especificado" o "-" en la interfaz. Asegúrate de que los usuarios completen todos los campos obligatorios.
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
