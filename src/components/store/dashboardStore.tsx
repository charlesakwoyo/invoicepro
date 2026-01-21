// src/components/store/dashboardStore.tsx
import { create } from "zustand";

type Page = "Home" | "Payments" | "Clients" | "Invoices" | "Settings";
type Theme = 'light' | 'dark';

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
}

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

interface DashboardState {
  // Navigation
  activePage: Page;
  setActivePage: (page: Page) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  
  // Theme
  theme: Theme;
  toggleTheme: () => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // User
  user: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  
  // Invoice
  selectedInvoice: any | null;
  setSelectedInvoice: (invoice: any | null) => void;
}

// Mock user data
const initialUser: UserProfile = {
  name: 'Charles Akwoyo',
  email: 'charles@gmail.com',
  avatar: '',
};

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Invoice',
    message: 'You have a new invoice from Acme Inc.',
    read: false,
    timestamp: new Date(),
  },
  {
    id: '2',
    title: 'Payment Received',
    message: 'Payment of KSh 1,200 received from John Smith',
    read: false,
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
  },
];

export const useDashboardStore = create<DashboardState>((set) => ({
  // Navigation
  activePage: "Home",
  setActivePage: (page) => set({ activePage: page }),
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  
  // Theme
  theme: 'light',
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light'
  })),
  
  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  // User
  user: initialUser,
  updateProfile: (updates) => 
    set((state) => ({
      user: { ...state.user, ...updates }
    })),
  
  // Notifications
  notifications: mockNotifications,
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: Date.now().toString(),
          read: false,
          timestamp: new Date(),
        },
        ...state.notifications,
      ],
    })),
  markNotificationAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  clearNotifications: () => set({ notifications: [] }),
  
  // Invoice
  selectedInvoice: null,
  setSelectedInvoice: (invoice) => set({ selectedInvoice: invoice }),
}));