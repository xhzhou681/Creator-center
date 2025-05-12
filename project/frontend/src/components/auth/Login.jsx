import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formError, setFormError] = useState('');
  
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setFormError('Please fill in all fields');
      return;
    }
    
    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      // Error is handled by the AuthContext
      console.error('Login error:', err);
    }
  };
  
  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <h2>Login to Creator Center</h2>
        
        {(error || formError) && (
          <ErrorMessage>{formError || error}</ErrorMessage>
        )}
        
        <FormGroup>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </FormGroup>
        
        <Button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        
        <RegisterLink>
          Don't have an account? <Link to="/register">Register</Link>
        </RegisterLink>
      </LoginForm>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
`;

const LoginForm = styled.form`
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  h2 {
    margin-bottom: 1.5rem;
    text-align: center;
    color: #333;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: #4a90e2;
    }
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #3a7bc8;
  }
  
  &:disabled {
    background-color: #a0c1e8;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 4px;
  font-size: 0.875rem;
`;

const RegisterLink = styled.div`
  margin-top: 1rem;
  text-align: center;
  font-size: 0.875rem;
  
  a {
    color: #4a90e2;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default Login;