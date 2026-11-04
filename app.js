// 1. Charger les variables d'environnement en tout premier
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

// Import des routes
const stuffRoutes = require('./routes/Stuff');
const userRoutes = require('./routes/user');
const commentRoutes = require('./routes/comment');
const dashboardRoutes = require('./routes/dashboard');
const optionRoutes = require('./routes/option');
const publicRouter = require('./routes/public');
const stuffCtrl = require('../controllers/stuff'); // Décommenté car utilisé plus bas

const app = express(); 

// 2. Connexion à MongoDB via la variable d'environnement
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log('Connexion à MongoDB échouée !', err));

  app.use(cors({
  origin: 'https://vercel.app', 
  credentials: true
}));

// Middlewares globaux
app.use(cors()); // Gère proprement les accès Cross-Origin pour votre Vue app
app.use(express.json()); // Permet de gérer les requêtes POST (JSON)
app.use(express.urlencoded({ extended: true }));

// Configuration des en-têtes CORS (en complément de cors())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Routes de l'application
app.use('/api/auth', userRoutes);
app.use('/api/public', publicRouter);
app.get('/api/highlight/top', stuffCtrl.getTopProduct);
app.use('/api/comments', commentRoutes);
app.use('/api/stuff', stuffRoutes);
app.use('/api/admin', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/options', optionRoutes);

// Servir les images statiques
app.use('/images', express.static(path.join(__dirname, 'images')));

const cors = require('cors');

// Autorise votre frontend Vercel à faire des requêtes vers le backend


module.exports = app;