// src/components/layout/Header.tsx
"use client";

import { FiSearch, FiBell, FiUser, FiMenu, FiX, FiCreditCard, FiDollarSign, FiCheckCircle } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import { useDashboardStore } from '../store/dashboardStore';
import Image from 'next/image';

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    title: 'Payment Received',
    message: 'You have received a payment of $1,200 from John Doe',
    time: '2 hours ago',
    read: false,
    type: 'payment',
    icon: <FiDollarSign className="text-green-500" />
  },
  {
    id: 2,
    title: 'Invoice #INV-2023-0123',
    message: 'Invoice has been paid successfully',
    time: '5 hours ago',
    read: false,
    type: 'invoice',
    icon: <FiCheckCircle className="text-blue-500" />
  },
  {
    id: 3,
    title: 'New Feature Available',
    message: 'Check out our new dashboard analytics',
    time: '1 day ago',
    read: true,
    type: 'info',
    icon: <FiCreditCard className="text-purple-500" />
  },
];

interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const { 
    toggleSidebar, 
    searchQuery, 
    setSearchQuery,
    user
  } = useDashboardStore();
  
  const [notifications, setNotifications] = useState(mockNotifications);
  const [unreadCount, setUnreadCount] = useState(
    mockNotifications.filter(n => !n.read).length
  );
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close notifications when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({
        ...notification, 
        read: true
      }))
    );
    setUnreadCount(0);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Left side - Menu button and search */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="flex items-center">
            {children || (
              <button 
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 md:hidden menu-button"
                aria-label="Toggle menu"
              >
                <FiMenu className="w-5 h-5" />
              </button>
            )}
            
            {/* Desktop search */}
            <div className="hidden md:block relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Right side - User controls */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Mobile search button */}
          <button 
            onClick={() => setShowMobileSearch(true)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 md:hidden transition-colors duration-200"
            aria-label="Search"
          >
            <FiSearch className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 relative transition-colors duration-200"
              aria-label="Notifications"
            >
              <FiBell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="notification-badge">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-fade-in">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-sm text-primary hover:text-primary-dark font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200 cursor-pointer ${
                            !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-0.5">
                              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                {notification.icon}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {notification.title}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                        <FiBell className="w-5 h-5 text-slate-400" />
                      </div>
                      <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                        No new notifications
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        We'll let you know when something new arrives.
                      </p>
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-slate-200 dark:border-slate-700 text-center">
                  <a
                    href="/notifications"
                    className="text-sm font-medium text-primary hover:text-primary-dark transition-colors duration-200"
                  >
                    View all notifications
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Mobile search */}
          {showMobileSearch && (
            <div className="absolute top-0 left-0 w-full p-4 bg-white dark:bg-gray-800 shadow-md z-10">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => setShowMobileSearch(false)}
                  className="ml-2 p-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* User dropdown */}
          <div className="relative">
            <button 
              className="flex items-center space-x-2 focus:outline-none group"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-primary/50 transition-colors duration-200">
                {user?.photoURL ? (
                  <Image 
                    src={user.photoURL} 
                    alt={user.displayName || 'User'}
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                )}
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-slate-800 dark:text-white">
                  {user?.displayName || 'User'}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {user?.email || 'user@example.com'}
                </span>
              </div>
            </button>

            {/* User dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-fade-in">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                      {user?.photoURL ? (
                        <Image 
                          src={user.photoURL} 
                          alt={user.displayName || 'User'}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiUser className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {user?.displayName || 'User'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="py-1">
                  <a
                    href="/profile"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200"
                  >
                    <FiUser className="mr-3 w-5 h-5 text-slate-400" />
                    Profile
                  </a>
                  <a
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200"
                  >
                    <svg className="mr-3 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </a>
                </div>
                <div className="py-1 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => {}}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 flex items-center"
                  >
                    <svg className="mr-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}