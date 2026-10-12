import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api, getStoredToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isOwner: boolean;
  isCustomer: boolean;
  login: (mobile: string, password: string, role?: UserRole) => Promise<void>;
  ownerLogin: (password: string) => Promise<void>;
  register: (name: string, mobile: string, password: string) => Promise<void>;
  logout: () => void;
  quickDemoLogin: (role: UserRole, mobile?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    api.getMe()
      .then(currentUser => {
        setUser(currentUser);
      })
      .catch(() => {
        api.logout();
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (mobile: string, password: string, role?: UserRole) => {
    const { user: loggedInUser } = await api.login(mobile, password, role);
    setUser(loggedInUser);
  };

  const ownerLogin = async (password: string) => {
    const { user: loggedInUser } = await api.ownerLogin(password);
    setUser(loggedInUser);
  };

  const register = async (name: string, mobile: string, password: string) => {
    const { user: registeredUser } = await api.register(name, mobile, password);
    setUser(registeredUser);
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const quickDemoLogin = async (role: UserRole, mobile?: string) => {
    if (role === 'owner') {
      await ownerLogin('owner123');
    } else {
      // Default to Amit Kumar (9876543210) or custom mobile
      const targetMobile = mobile || '9876543210';
      await login(targetMobile, 'customer123', 'customer');
    }
  };

  const isOwner = user?.role === 'owner';
  const isCustomer = user?.role === 'customer';

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isOwner,
        isCustomer,
        login,
        ownerLogin,
        register,
        logout,
        quickDemoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
