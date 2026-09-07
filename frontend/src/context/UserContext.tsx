'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { api } from '@/services/api';

interface UserContextType {
  currentUser: User | null;
  usersList: User[];
  setCurrentUser: (user: User) => void;
  isLoading: boolean;
  isHostMode: boolean;
  toggleHostMode: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHostMode, setIsHostMode] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      try {
        const users = await api.getUsers();
        setUsersList(users);
        if (users.length > 0) {
          const defaultGuest = users.find((u) => !u.is_host) || users[0];
          setCurrentUser(defaultGuest);
          setIsHostMode(defaultGuest.is_host);
        }
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadUsers();
  }, []);

  const handleSetUser = (user: User) => {
    setCurrentUser(user);
    setIsHostMode(user.is_host);
  };

  const toggleHostMode = () => {
    if (!currentUser) return;
    if (isHostMode) {
      // Switch to a guest profile
      const guest = usersList.find((u) => !u.is_host) || currentUser;
      handleSetUser(guest);
    } else {
      // Switch to a host profile
      const host = usersList.find((u) => u.is_host) || currentUser;
      handleSetUser(host);
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        usersList,
        setCurrentUser: handleSetUser,
        isLoading,
        isHostMode,
        toggleHostMode,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
