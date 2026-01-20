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

// Dynamically import InvoicePanel
const InvoicePanel = dynamic(() => import('./InvoicePanel'), { ssr: false });

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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    const pageFromUrl = pathname.split('/').pop() || 'Home';
    const formattedPage = pageFromUrl.charAt(0).toUpperCase() + pageFromUrl.slice(1);
    if (formattedPage in pageComponents) setActivePage(formattedPage as any);
  }, [pathname, setActivePage]);

  // Close sidebar on click outside mobile
  useEffect(() => {
    if (!isMounted) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isSidebarOpen && !target.closest('.sidebar') && !target.closest('.menu-button')) {
        toggleSidebar();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen, toggleSidebar, isMounted]);

  // Apply theme class
  useEffect(() => {
    if (!isMounted) return;
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme === 'dark' ? 'dark' : 'light');
  }, [theme, isMounted]);

  if (!isMounted) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900" suppressHydrationWarning />;
  }

  const PageComponent = pageComponents[activePage] || HomeSection;

  const renderContent = () => {
    return <PageComponent />;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-sm transform transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-indigo-600">QuickPay</h1>
        </div>
        <div className="h-[calc(100%-4rem)] overflow-y-auto py-4">
          <Sidebar />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-200 ease-in-out md:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 h-16 flex items-center px-6 sticky top-0 z-10">
          <div className="flex items-center justify-between w-full">
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              <HiMenu size={24} />
            </button>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex">
            {/* Primary content */}
            <div className="flex-1 overflow-y-auto p-6">
              {renderContent()}
            </div>
            
            {/* Side panel - Only on large screens */}
            <div className="hidden xl:block w-80 border-l border-gray-100 bg-white overflow-y-auto">
              <InvoicePanel />
            </div>
          </div>
        </main>
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