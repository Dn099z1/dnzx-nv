import { DashboardNav } from '@/components/dashboard-nav';
import { NavHeader } from '@/components/nav-header';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Cabeçalho */}
      <NavHeader />

      {/* Layout principal */}
      <div className="flex flex-1 flex-col md:flex-row">
        
        {/* Botão de Hamburger em telas pequenas */}
        <button
          className="md:hidden p-4"
          onClick={toggleMobileNav}
        >
          <span className="block w-6 h-1 bg-gray-700 mb-1"></span>
          <span className="block w-6 h-1 bg-gray-700 mb-1"></span>
          <span className="block w-6 h-1 bg-gray-700"></span>
        </button>

        {/* Navegação Lateral (DashboardNav) */}
        <div
          className={`md:w-64 bg-gray-800 p-4 ${isMobileNavOpen ? 'block' : 'hidden'} md:block`}
        >
          <DashboardNav />
        </div>

        {/* Conteúdo principal */}
        <main className="flex-1 p-8 bg-muted/10">
          {children}
        </main>
        
      </div>
    </div>
  );
}
