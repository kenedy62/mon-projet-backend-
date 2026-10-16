const express = require('express');
const mongoose = require('mongoose');
const stuffRoutes = require('./routes/Stuff');
const userRoutes= require ('./routes/user');
const commentRoutes=require('./routes/comment');
const dashboardRoutes=require('./routes/dashboard');
const optionRoutes = require('./routes/option');
const cors = require('cors');
const stuffCtrl = require('./controllers/stuff'); 
const publicRouter =require('./routes/public')


//const app = express();

// Allow requests from your Vue app

//server.listen(port);
// le headers qui permet d'acceder a notre API 
const app = express(); 
const path = require('path')


mongoose.connect('mongodb://localhost:27017/')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
app.use(express.json()); // Corps JSON qui nous permet gerer la requete POST
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
app.use('/api/auth', userRoutes);
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/public', publicRouter )
app.get('/api/highlight/top', stuffCtrl.getTopProduct);
app.use('/api/comments',commentRoutes);
app.use('/api/stuff', stuffRoutes);
app.use('/api/admin', userRoutes)
app.use('/api/dashboard',dashboardRoutes);
app.use('/api/options', optionRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));




module.exports = app;