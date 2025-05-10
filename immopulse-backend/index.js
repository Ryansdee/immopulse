const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3030;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Connexion à MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root', // ← ton mot de passe ici si besoin
  database: 'immopulse'
});

// Servir les fichiers statiques à partir du dossier 'public/img'
app.use('/img', express.static(path.join(__dirname, 'public', 'img')));

// Connexion à la base de données
db.connect(err => {
  if (err) {
    console.error('❌ Erreur de connexion MySQL:', err);
    return;
  }
  console.log('✅ Connecté à MySQL');
});

// Récupérer les propriétés
app.get('/api/properties', (req, res) => {
  db.query('SELECT * FROM properties', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des propriétés' });
    }
    res.json(results);
  });
});

// Récupérer les propriétés en vedette
app.get('/api/properties-feature', (req, res) => {
  const query = 'SELECT * FROM properties LIMIT 3'; // Limite 3 pour la section "à la une"
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des propriétés' });
    }
    res.json(results); // Retourner les résultats sous forme de JSON
  });
});

app.get('/api/property-images/:id', (req, res) => {
  const propertyId = req.params.id;

  // URL de base pour les images
  const baseUrl = `http://localhost:3000/img/${propertyId}/`;

  // Exemple d'images (vous pouvez récupérer ces données depuis votre base de données ou autres sources)
  const images = [
    'image1.jpg',
    'image2.jpg',
    'image3.jpg'
  ];

  // Construire les URLs pour chaque image
  const imageUrls = images.map(image => `${baseUrl}${image}`);

  // Retourner les URLs des images
  res.json(imageUrls);
});



// Ajouter une nouvelle propriété
app.post('/api/properties', (req, res) => {
  const { title, description, price, location, image_url } = req.body;
  db.query(
    'INSERT INTO properties (title, description, price, location, image_url) VALUES (?, ?, ?, ?, ?)',
    [title, description, price, location, image_url],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur lors de l\'insertion' });
      }
      res.status(201).json({ id: result.insertId, ...req.body });
    }
  );
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`🚀 Serveur backend démarré sur http://localhost:${port}`);
});
