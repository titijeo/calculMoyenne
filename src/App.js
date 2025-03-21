// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import GradeCalculator from './components/GradeCalculator.js';
import EleveList from './components/EleveList.js';
import AddEleve from './components/AddEleve.js';
import Login from './components/Login.js';
import BulletinDownload from './components/BulletinDownload.js';
import Register from './components/Register.js';
import './App.css';

function App() {
  const [teacher, setTeacher] = useState(null);

  return (
    <Router>
      <AppContent teacher={teacher} setTeacher={setTeacher} />
    </Router>
  );
}

function AppContent({ teacher, setTeacher }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setTeacher(null);
    navigate('/login');
  };

  return (
    <>
      {/* Ici, on injecte un <style> directement dans le composant */}
      <style>
        {`
          /* Force la couleur du nom de l'enseignant en blanc, supprime le fond blanc éventuel */
          nav ul li.teacher-name,
          nav ul li.teacher-name * {
            background-color: transparent !important;
            color: #fff !important;
            font-weight: bold;
            text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);
            border: none !important;
            box-shadow: none !important;
          }
        `}
      </style>

      <div  className="container">
        <nav style={{ marginBottom: '20px' }}>
          <ul>
            <li><Link to="/">Calculer une moyenne</Link></li>
            <li><Link to="/eleves">Liste des élèves</Link></li>
            <li><Link to="/ajouter-eleve">Ajouter un élève</Link></li>
            <li><Link to="/bulletin">Télécharger bulletin</Link></li>
            <li><Link to="/register">Inscription Enseignant</Link></li>
            {teacher ? (
              <>
                {/* On ajoute la classe teacher-name ici */}
                <li className="teacher-name">Bienvenue {teacher.nom}</li>
                <li><button onClick={handleLogout}>Déconnexion</button></li>
              </>
            ) : (
              <li><Link to="/login">Connexion Enseignant</Link></li>
            )}
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<GradeCalculator />} />
          <Route path="/eleves" element={<EleveList />} />
          <Route path="/ajouter-eleve" element={<AddEleve />} />
          <Route path="/login" element={<Login setTeacher={setTeacher} />} />
          <Route path="/bulletin" element={<BulletinDownload />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
