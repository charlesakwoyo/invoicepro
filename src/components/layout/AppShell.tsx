"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Sidebar from "./Sidebar";
import Header from "./Header";
import PaymentsSection from "../sections/PaymentsSection";
import ClientsSection from "../sections/ClientsSection";
import InvoicesSection from "../sections/InvoicesSection";
import SettingsSection from "../sections/SettingsSection";
import HomeSection from "../sections/HomeSection";
import { useDashboardStore } from "../store/dashboardStore";
import { HiMenu } from "react-icons/hi";

// Type for the user object
interface User {
  name: string;
  email: string;
  avatar?: string;
}

// Map pages
const pageComponents: Record<string, React.ComponentType> = {
  Home: HomeSection,
  Payments: PaymentsSection,
  Invoices: InvoicesSection,
  Clients: ClientsSection,
  Settings: SettingsSection,
};

export default function AppShell() {
  const { user } = useDashboardStore();
  const { 
    activePage, 
    isSidebarOpen, 
    toggleSidebar, 
    theme, 
    setActivePage 
  } = useDashboardStore();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme === 'dark' ? 'dark' : 'light');
  }, [theme]);

  useEffect(() => {
    const pageFromUrl = pathname.split('/').pop() || 'Home';
    const formattedPage = pageFromUrl.charAt(0).toUpperCase() + pageFromUrl.slice(1);
    if (formattedPage in pageComponents) setActivePage(formattedPage as any);
  }, [pathname, setActivePage]);

  // Close sidebar on click outside mobile
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isSidebarOpen && !target.closest('.sidebar') && !target.closest('.menu-button')) {
        toggleSidebar();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen, toggleSidebar]);

  const PageComponent = activePage in pageComponents ? pageComponents[activePage] : HomeSection;

  const renderContent = () => {
    return <PageComponent />;
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col dark:bg-gray-900">
      <Header />
      <div className="flex flex-1">
        <aside className={`fixed top-16 bottom-0 left-0 z-30 w-64 bg-white shadow-sm transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}>
          <div className="h-full overflow-y-auto py-4">
            <Sidebar />
          </div>
        </aside>
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-200 ease-in-out md:ml-64">
          {/* Main content */}
          <main className="flex-1 overflow-hidden">
            <div className="h-full flex">
              {/* Primary content */}
              <div className="flex-1 overflow-y-auto p-6">
                {renderContent()}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </div>
  );
}