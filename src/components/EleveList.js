// src/components/EleveList.js
import React, { useState, useEffect } from 'react';

function EleveList() {
  const [eleves, setEleves] = useState([]);
  const [selectedClasse, setSelectedClasse] = useState("Tous");
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:5000/api/eleves')
      .then(res => res.json())
      .then(data => setEleves(data))
      .catch(err => console.error(err));
  }, []);

  const classesDisponibles = [
    "Tous",
    "6e", "5e", "4e", "3e",
    "2nd C", "2nd A",
    "1ere A", "1ere D",
    "Tle A", "Tle D"
  ];

  const filteredEleves = selectedClasse === "Tous"
    ? eleves
    : eleves.filter(eleve => eleve.classe === selectedClasse);

  const handleDelete = async (id) => {
    if (!token) {
      alert("Vous devez être connecté en tant qu'enseignant pour supprimer un élève.");
      return;
    }
    if (!window.confirm("Voulez-vous vraiment supprimer cet élève ?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/eleves/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        alert("Élève supprimé avec succès");
        setEleves(eleves.filter(e => e._id !== id));
      } else {
        alert(data.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleEdit = async (id) => {
    if (!token) {
      alert("Vous devez être connecté en tant qu'enseignant pour modifier un élève.");
      return;
    }
    const newName = prompt("Entrez le nouveau nom :");
    if (!newName) return;
    try {
      const res = await fetch(`http://localhost:5000/api/eleves/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nom: newName })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Élève modifié avec succès");
        setEleves(eleves.map(e => e._id === id ? { ...e, nom: newName } : e));
      } else {
        alert(data.error || "Erreur lors de la modification");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h1>Liste des Élèves</h1>
      <div style={{ marginBottom: '20px' }}>
        <label>Filtrer par classe : </label>
        <select value={selectedClasse} onChange={(e) => setSelectedClasse(e.target.value)}>
          {classesDisponibles.map((classe, index) => (
            <option key={index} value={classe}>{classe}</option>
          ))}
        </select>
      </div>
      <ul>
        {filteredEleves.map(eleve => (
          <li key={eleve._id}>
            {eleve.prenom} {eleve.nom} - Classe: {eleve.classe}
            <br />
            {token && (
              <>
                <button onClick={() => handleEdit(eleve._id)}>Modifier</button>
                <button onClick={() => handleDelete(eleve._id)}>Supprimer</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EleveList;
