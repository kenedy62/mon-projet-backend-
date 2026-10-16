const express = require('express');
const router = express.Router();
const optionCtrl = require('../controllers/option');
const auth = require('../middleware/auth');

router.get('/', optionCtrl.getAllOptions);
router.post('/', auth, optionCtrl.createOption);
router.put('/:id', auth, optionCtrl.updateOption);
router.delete('/:id', auth, optionCtrl.deleteOption);

module.exports = router;
