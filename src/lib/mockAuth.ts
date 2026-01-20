interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    email: 'user@example.com',
    password: 'password123',
    name: 'Demo User'
  }
];

export const authenticateUser = (email: string, password: string): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find(
        (user) => user.email === email && user.password === password
      );
      resolve(user || null);
    }, 500); // Simulate network delay
  });
};

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const login = async (email: string, password: string): Promise<User | null> => {
  const user = await authenticateUser(email, password);
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }
  return user;
};

export const logout = (): void => {
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  return !!getCurrentUser();
};
