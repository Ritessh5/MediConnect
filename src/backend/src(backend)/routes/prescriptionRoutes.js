const express = require('express');
const router = express.Router();
const { createPrescription, getMyPrescriptions } = require('../controllers/prescriptionController');
const { authenticate } = require('../middlewares/auth');

router.use(authenticate);

router.post('/', createPrescription);
router.get('/my-prescriptions', getMyPrescriptions);

module.exports = router;
