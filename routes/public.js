const express = require('express');
const router = express.Router();

const clientCtrl = require('../controllers/userPub');


router.post('/signup', clientCtrl.signup);// route pour la creation d'un utilisateur publique
router.post('/login'  ,clientCtrl.login);

module.exports = router;