// src/components/GradeCalculator.js
import React, { useState, useEffect } from 'react';

function GradeCalculator() {
  const [eleves, setEleves] = useState([]);
  const [selectedEleve, setSelectedEleve] = useState('');
  const [selectedMatiere, setSelectedMatiere] = useState('');
  const [subSection, setSubSection] = useState(''); // Pour la sous-section de Français
  const [ieNotes, setIeNotes] = useState('');
  const [devoirClasse, setDevoirClasse] = useState('');
  const [devoirNiveau, setDevoirNiveau] = useState('');
  const [examNote, setExamNote] = useState('');
  const [result, setResult] = useState(null);
  const [matieresDisponibles, setMatieresDisponibles] = useState([]);

  // Liste des sous-sections pour la matière "Français"
  const frenchSubsections = ["Expression Orale", "Orthographe", "Expression Écrite"];

  // Récupération des élèves
  useEffect(() => {
    fetch('http://localhost:5000/api/eleves')
      .then(res => res.json())
      .then(data => setEleves(data))
      .catch(err => console.error(err));
  }, []);

  // Récupération des matières depuis le backend
  useEffect(() => {
    fetch('http://localhost:5000/api/matieres')
      .then(res => res.json())
      .then(data => {
        const matieres = data.map(m => m.nom);
        setMatieresDisponibles(matieres);
      })
      .catch(err => console.error(err));
  }, []);

  // Trouver l'élève sélectionné pour accéder à sa classe
  const selectedStudent = eleves.find(e => e._id === selectedEleve);

  // Gestion du changement de matière
  const handleMatiereChange = (e) => {
    const selected = e.target.value;
    setSelectedMatiere(selected);
    // Réinitialiser la sous-section si la matière n'est pas "Français"
    if (selected.toLowerCase() !== "français") {
      setSubSection('');
    }
  };

  // Convertir une chaîne en nombre (remplace la virgule par un point)
  const parseNote = (noteStr) => {
    return parseFloat(noteStr.trim().replace(',', '.'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!selectedEleve || !selectedMatiere || isNaN(parseNote(examNote)) || ieNotes.trim() === '') {
      alert("Veuillez remplir tous les champs correctement.");
      return;
    }

    // Séparer les notes par point-virgule
    const ieNotesArray = ieNotes.split(';').map(parseNote).filter(n => !isNaN(n));
    const devoirClasseArray = devoirClasse.split(';').map(parseNote).filter(n => !isNaN(n));
    const devoirNiveauArray = devoirNiveau.split(';').map(parseNote).filter(n => !isNaN(n));
    const exam = parseNote(examNote);

    // Payload
    const payload = {
      eleve: selectedEleve,
      matiere: selectedMatiere,
      subSection, // Sous-section si Français
      ieNotes: ieNotesArray,
      devoirClasse: devoirClasseArray,
      devoirNiveau: devoirNiveauArray,
      examNote: exam
    };

    try {
      const response = await fetch('http://localhost:5000/api/notes/calculate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      setResult(data.note);
    } catch (error) {
      console.error("Erreur lors du calcul", error);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h1>Calcul de la Moyenne Trimestrielle</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Élève&nbsp;: </label>
          <select value={selectedEleve} onChange={(e) => setSelectedEleve(e.target.value)} required>
            <option value="">Sélectionnez un élève</option>
            {eleves.map(eleve => (
              <option key={eleve._id} value={eleve._id}>
                {eleve.prenom} {eleve.nom} (Classe: {eleve.classe})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Matière&nbsp;: </label>
          <select value={selectedMatiere} onChange={handleMatiereChange} required>
            <option value="">Sélectionnez une matière</option>
            {matieresDisponibles.map((matiere, index) => (
              <option key={index} value={matiere}>{matiere}</option>
            ))}
          </select>
        </div>

        {/* Menu déroulant des sous-sections de Français, seulement si : 
            - Matière = "Français"
            - L'élève est en 6e, 5e, 4e ou 3e */}
        {selectedMatiere.toLowerCase() === "français" &&
         selectedStudent &&
         ["6e", "5e", "4e", "3e"].includes(selectedStudent.classe.trim().toLowerCase()) && (
          <div style={{ marginBottom: '10px' }}>
            <label>Sous-section de Français&nbsp;: </label>
            <select
              value={subSection}
              onChange={(e) => setSubSection(e.target.value)}
              required
            >
              <option value="">Sélectionnez une sous-matière</option>
              {frenchSubsections.map((sub, index) => (
                <option key={index} value={sub}>{sub}</option>
              ))}
            </select>
          </div>
        )}

        <div style={{ marginBottom: '10px' }}>
          <label>
            Notes des interrogations écrites/orales (ex: 15;12;18)&nbsp;:
          </label>
          <input
            type="text"
            value={ieNotes}
            onChange={(e) => setIeNotes(e.target.value)}
            placeholder="ex: 15;12;18"
            required
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>
            Notes des devoirs de classe (ex: 16)&nbsp;:
          </label>
          <input
            type="text"
            value={devoirClasse}
            onChange={(e) => setDevoirClasse(e.target.value)}
            placeholder="ex: 16"
            required
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>
            Notes des devoirs de niveau (ex: 14)&nbsp;:
          </label>
          <input
            type="text"
            value={devoirNiveau}
            onChange={(e) => setDevoirNiveau(e.target.value)}
            placeholder="ex: 14"
            required
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>
            Note de lexamen (ex: 14 ou 14,5)&nbsp;:
          </label>
          <input
            type="text"
            value={examNote}
            onChange={(e) => setExamNote(e.target.value)}
            required
          />
        </div>

        <button type="submit">Calculer</button>
      </form>

      {result && result.moyenne !== undefined && (
        <div style={{ marginTop: '20px' }}>
          <h2>Moyenne Trimestrielle : {result.moyenne.toFixed(2)} / 20</h2>
          <button onClick={() => setResult(null)}>Modifier les notes</button>
        </div>
      )}
    </div>
  );
}

export default GradeCalculator;
