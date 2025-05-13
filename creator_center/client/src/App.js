import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuth } from './hooks/useAuth';

// 页面组件
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import VideoManagement from './pages/VideoManagement';
import VideoDetails from './pages/VideoDetails';
import Analytics from './pages/Analytics';
import InspirationCenter from './pages/InspirationCenter';
import AIChat from './pages/AIChat';
import NotFound from './pages/NotFound';

// 布局组件
import Layout from './components/Layout';

// 创建主题
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

// 私有路由组件
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>加载中...</div>;
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="videos" element={<VideoManagement />} />
          <Route path="videos/:id" element={<VideoDetails />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="inspiration" element={<InspirationCenter />} />
          <Route path="ai-chat" element={<AIChat />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App; 