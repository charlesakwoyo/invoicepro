"use client";

import { useDashboardStore } from "@/components/store/dashboardStore";
import { 
  FiHome, 
  FiDollarSign, 
  FiUsers, 
  FiFileText, 
  FiSettings,
  FiSun, 
  FiMoon,
  FiLogOut 
} from 'react-icons/fi';
import { logout } from "@/lib/mockAuth";

interface SidebarProps {
  onLinkClick?: () => void; // Called when a link is clicked (mobile)
}

const navigation = [
  { name: 'Home', icon: FiHome, href: '#', key: 'Home' as const },
  { name: 'Payments', icon: FiDollarSign, href: '#', key: 'Payments' as const },
  { name: 'Invoices', icon: FiFileText, href: '#', key: 'Invoices' as const },
  { name: 'Clients', icon: FiUsers, href: '#', key: 'Clients' as const },
  { name: 'Settings', icon: FiSettings, href: '#', key: 'Settings' as const },
];

export default function Sidebar({ onLinkClick }: SidebarProps) {
  const { 
    activePage, 
    setActivePage, 
    theme, 
    toggleTheme,
    user 
  } = useDashboardStore();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-gray-800">
      {/* Logo & Theme Toggle */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
            QP
          </div>
          <h1 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
            QuickPay
          </h1>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = activePage === item.key;
            return (
              <li key={item.name}>
                <button
                  onClick={() => {
                    setActivePage(item.key);
                    onLinkClick?.(); // Close mobile sidebar after selecting
                  }}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`} />
                  {item.name}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="px-4 py-3 flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium">
            {user.name.charAt(0)}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {user.name.split(' ')[0]}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-2 flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <FiLogOut className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
          Logout
        </button>
      </div>
    </div>
  );
}
