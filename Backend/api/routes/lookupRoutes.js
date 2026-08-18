const express = require('express');
const lookupController = require('../controllers/lookupController');

const router = express.Router();

router.get('/provinces', lookupController.listProvinces);

module.exports = router;
