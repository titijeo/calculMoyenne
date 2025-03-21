// src/components/AddEleve.js
import React, { useState } from 'react';

function AddEleve() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [classe, setClasse] = useState('');
  const [message, setMessage] = useState('');

  // Liste des classes disponibles
  const classesDisponibles = [
    "6e", "5e", "4e", "3e",
    "2nd C", "2nd A",
    "1ere A1", "1ere A2", "1ere D",
    "Tle A1", "Tle A2", "Tle D"
  ];

  // Gestion de la soumission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification de base
    if (!nom || !prenom || !classe) {
      setMessage("Veuillez remplir tous les champs.");
      return;
    }

    // Préparer l'objet à envoyer (sans "matiere")
    const payload = { nom, prenom, classe };

    try {
      const res = await fetch('http://localhost:5000/api/eleves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setMessage(`Élève ${data.prenom} ${data.nom} ajouté avec succès.`);
        // Réinitialiser le formulaire
        setNom('');
        setPrenom('');
        setClasse('');
      } else {
        const errorData = await res.json();
        setMessage(errorData.error || "Erreur lors de l'ajout de l'élève.");
      }
    } catch (error) {
      console.error('Erreur lors de la requête :', error);
      setMessage("Erreur serveur.");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h1>Ajouter un Élève</h1>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Nom : </label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Prénom : </label>
          <input
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Classe : </label>
          <select
            value={classe}
            onChange={(e) => setClasse(e.target.value)}
            required
          >
            <option value="">Sélectionner une classe</option>
            {classesDisponibles.map((cl, index) => (
              <option key={index} value={cl}>
                {cl}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Ajouter l`&rsquo;`élève</button>
      </form>
    </div>
  );
}

export default AddEleve;
