const express = require('express');
const jobController = require('../controllers/jobController');

const router = express.Router();

router.post('/', jobController.createJob);
router.get('/mine', jobController.listMyJobs);
router.get('/:id', jobController.getJob);
router.patch('/:id', jobController.updateJob);

module.exports = router;
