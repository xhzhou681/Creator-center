import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 如果有token，则获取用户信息
    const getUserInfo = async () => {
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to get user info:', error);
          // 如果token无效，则清除
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    getUserInfo();
  }, [token]);

  // 登录方法
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.login(email, password);
      
      // 保存token到本地存储
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      
      return data;
    } catch (error) {
      setError(error.response?.data?.message || '登录失败');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 注册方法
  const register = async (username, email, password) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.register(username, email, password);
      
      // 保存token到本地存储
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      
      return data;
    } catch (error) {
      setError(error.response?.data?.message || '注册失败');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 登出方法
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        isAuthenticated: !!token,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 