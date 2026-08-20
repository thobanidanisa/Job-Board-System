const express = require('express');
const lookupController = require('../controllers/lookupController');

const router = express.Router();

router.get('/provinces', lookupController.listProvinces);
router.get('/categories', lookupController.listCategories);

module.exports = router;
