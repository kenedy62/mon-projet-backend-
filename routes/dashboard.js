const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const stuffCtrl = require('../controllers/Stuff');

// 1. Assurez-vous que l'importation pointe vers le bon fichier contrôleur
// ⚠️ Attention à la casse (majuscules/minuscules) !
// ✅ Liez la route directement à votre contrôleur existant :
// ✅ Liez la route directement à votre contrôleur existant :
router.get('/stats',auth,stuffCtrl.getDashboardStats);



module.exports = router;
