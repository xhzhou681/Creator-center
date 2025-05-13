import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography, Container } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../hooks/useAuth';

export default function NotFound() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          页面未找到
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          您访问的页面不存在或已被移除。
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={isAuthenticated ? '/' : '/login'}
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          {isAuthenticated ? '返回仪表盘' : '返回登录页'}
        </Button>
      </Box>
    </Container>
  );
} 