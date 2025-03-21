import React from 'react';
import Login from '../components/Login';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/dashboard');
  };

  return (
    <div>
      <Login onLogin={handleLogin} />
    </div>
  );
}

export default LoginPage;
