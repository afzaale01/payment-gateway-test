const express = require('express');
const paymentController = require('../controller/payment.controller');

const router = express.Router();

router.post('/process-payment', paymentController.processPayment);


module.exports = router;