
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProfilesTable from '@/components/admin/ProfilesTable';

const AdminPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-12">
        <ProfilesTable />
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
