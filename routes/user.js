const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const userCtrl = require('../controllers/user');
//const userCtrl =require('../controller/updateSettings')

router.post('/signup', userCtrl.signup);
//router.post('/signupUser', userCtrl.signupUser);// route pour la creation d'un utilisateur publique
router.post('/login', userCtrl.login);
router.get('/settings', userCtrl.getSettings);
router.put('/settings', auth, userCtrl.updateSettings)

module.exports = router;