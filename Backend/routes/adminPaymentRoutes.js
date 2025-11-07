const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const PaymentController = require('../controllers/paymentController');

router.use(authMiddleware, roleMiddleware(['admin']));

// Admin can view ALL payments
router.get('/all', PaymentController.getAllPayments);

// Admin can also verify and complete payments if needed
router.put('/:id/verify', PaymentController.verifyPayment);
router.put('/:id/complete', PaymentController.completePayment);

module.exports = router;
