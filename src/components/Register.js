import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/enseignants/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, email, password })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Inscription réussie ! Vous pouvez vous connecter.");
        setTimeout(() => navigate('/login'), 2000); // Redirection après succès
      } else {
        setMessage(data.message || "Erreur lors de l'inscription.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Erreur serveur.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h1>Inscription Enseignant</h1>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom : </label>
          <input type="text" value={nom} onChange={e => setNom(e.target.value)} required />
        </div>
        <div>
          <label>Email : </label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Mot de passe : </label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Sinscrire</button>
      </form>
    </div>
  );
}

export default Register;



