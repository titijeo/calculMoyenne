import React from 'react';
import Register from '../components/Register';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate('/dashboard');
  };

  return (
    <div>
      <Register onRegister={handleRegister} />
    </div>
  );
}

export default RegisterPage;
