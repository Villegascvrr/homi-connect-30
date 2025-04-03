
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ChatList from '@/components/chat/ChatList';
import ChatWindow from '@/components/chat/ChatWindow';
import DemoBanner from '@/components/layout/DemoBanner';

interface ChatPageProps {
  isPreview?: boolean;
}

const ChatPage = ({ isPreview = false }: ChatPageProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {isPreview && <DemoBanner />}
      
      <main className="flex-grow flex">
        <div className="flex w-full h-[calc(100vh-4rem)]">
          <div className="w-full sm:w-1/3 md:w-1/4 border-r">
            <ChatList />
          </div>
          <div className="hidden sm:block sm:w-2/3 md:w-3/4">
            <ChatWindow />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ChatPage;
