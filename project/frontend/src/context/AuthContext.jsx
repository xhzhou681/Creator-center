import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if user is already logged in (token in localStorage)
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Configure axios to use the token
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Fetch current user data
          const response = await axios.get('/api/auth/me');
          setCurrentUser(response.data.user);
        }
      } catch (err) {
        // If token is invalid, clear it
        localStorage.removeItem('token');
        axios.defaults.headers.common['Authorization'] = '';
        setError('Session expired. Please login again.');
      } finally {
        setLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []);
  
  // Register new user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/auth/register', userData);
      
      // Save token to localStorage
      localStorage.setItem('token', response.data.token);
      
      // Set authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      // Set user data
      setCurrentUser(response.data.user);
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Login user
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/auth/login', credentials);
      
      // Save token to localStorage
      localStorage.setItem('token', response.data.token);
      
      // Set authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      // Set user data
      setCurrentUser(response.data.user);
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout user
  const logout = async () => {
    try {
      setLoading(true);
      
      // Call logout endpoint (optional, as JWT is stateless)
      await axios.post('/api/auth/logout');
      
      // Remove token from localStorage
      localStorage.removeItem('token');
      
      // Remove authorization header
      axios.defaults.headers.common['Authorization'] = '';
      
      // Clear user data
      setCurrentUser(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;