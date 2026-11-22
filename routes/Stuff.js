const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../images/multer-config');
const stuffCtrl = require('../controllers/Stuff');
const tracker = require ('../middleware/tracker')


router.get('/', tracker, stuffCtrl.getAllStuff);
router.get('/top-product', stuffCtrl.getTopProduct); 
router.get('/stats', auth, stuffCtrl.getDashboardStats); 
router.get('/:id', tracker, stuffCtrl.getOneThing);

router.post('/', auth, multer, stuffCtrl.createThing); 
router.put('/:_id', auth, multer, stuffCtrl.modifyThing);
router.delete('/:id', auth, stuffCtrl.deleteThing);

module.exports = router;