// frontend/src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ setTeacher }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🔍 Envoi des données :", { email, password });


    try {
      const res = await fetch('http://localhost:5000/api/enseignants/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setTeacher(data.teacher);
        navigate('/');
      } else {
        setError(data.message || 'Erreur lors de la connexion');
      }
    } catch (err) {
      console.error(err);
      setError('Erreur serveur');
    }
  };
  
  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h1>Connexion Enseignant</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email : </label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Mot de passe : </label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </div>
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default Login;
