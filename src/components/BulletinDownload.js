// frontend/src/components/BulletinDownload.js
import React, { useState, useEffect } from 'react';

function BulletinDownload() {
  const [eleves, setEleves] = useState([]);
  const [selectedEleve, setSelectedEleve] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/eleves')
      .then(res => res.json())
      .then(data => setEleves(data))
      .catch(err => console.error(err));
  }, []);

  const handleDownload = () => {
    if (selectedEleve) {
      const token = localStorage.getItem('token');
      fetch(`http://localhost:5000/api/bulletins/${selectedEleve}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'bulletin.pdf';
          document.body.appendChild(a);
          a.click();
          a.remove();
        })
        .catch(err => console.error(err));
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h1>Télécharger le Bulletin de lÉlève</h1>
      <div style={{ marginBottom: '10px' }}>
        <label>Élève : </label>
        <select value={selectedEleve} onChange={(e) => setSelectedEleve(e.target.value)}>
          <option value="">Sélectionnez un élève</option>
          {eleves.map(eleve => (
            <option key={eleve._id} value={eleve._id}>
              {eleve.prenom} {eleve.nom}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleDownload} disabled={!selectedEleve}>
        Télécharger Bulletin
      </button>
    </div>
  );
}

export default BulletinDownload;
