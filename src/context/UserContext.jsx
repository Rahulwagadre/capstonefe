import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // Make sure to install this package

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to extract user ID from token
  const extractUserIdFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.sub; // Use 'sub' if 'userId' isn't present
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Check for token on initial load and when the app mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const id = extractUserIdFromToken(token);
      setUserId(id);
    }
    setIsLoading(false);
  }, []);

  // Login function (to be called after successful authentication)
  const login = (token, rememberMe = true) => {
    if (rememberMe) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
    const id = extractUserIdFromToken(token);
    setUserId(id);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setUserId(null);
  };

  return (
    <UserContext.Provider value={{ userId, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};