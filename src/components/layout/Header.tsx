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
    message: 'You have received a payment of KSh 120,000 from Charles Akwoyo',
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
    user
  } = useDashboardStore();
  
  const [notifications, setNotifications] = useState(mockNotifications);
  const [unreadCount, setUnreadCount] = useState(
    mockNotifications.filter(n => !n.read).length
  );
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
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
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Menu button */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {children || (
                <button 
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 md:hidden"
                  aria-label="Toggle menu"
                >
                  <FiMenu className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Right side - User controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 relative transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Notifications"
              >
                <FiBell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50 transform transition-all duration-200 ease-in-out origin-top-right">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
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
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                    >
                      View all notifications
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* User dropdown */}
            <div className="relative ml-2" ref={userMenuRef}>
              <button 
                className="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                aria-expanded="false"
                aria-haspopup="true"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-transparent hover:border-blue-500/50 transition-all duration-200">
                  {user?.avatar ? (
                    <Image 
                      src={user.avatar} 
                      alt={user.name || 'User'}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  )}
                </div>
                <div className="hidden md:flex flex-col items-start ml-3">
                  <span className="text-sm font-medium text-slate-800 dark:text-white truncate max-w-[120px]">
                    {user?.name || 'Charles Akwoyo'}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                    {user?.email || 'charles@gmail.com'}
                  </span>
                </div>
              </button>

              {/* User dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50 transform transition-all duration-200 ease-in-out origin-top-right">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                        {user?.avatar ? (
                          <Image 
                            src={user.avatar} 
                            alt={user.name || 'User'}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FiUser className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {user?.name || 'Charles Akwoyo'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                          {user?.email || 'charles@gmail.com'}
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
      </div>

    </header>
  );
}