const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const PaymentController = require('../controllers/paymentController');

// ✅ Get pending payments (for admin/employee)
router.get('/pending/all', authMiddleware, PaymentController.getPendingPayments);

// Create payment
router.post('/', authMiddleware, PaymentController.createPayment);
// ✅ Get all payments (for admin)
router.get('/all', authMiddleware, PaymentController.getAllPayments);

// Get all payments for the logged-in user
router.get('/', authMiddleware, PaymentController.getUserPayments);

// Get a specific payment by ID
router.get('/:id', authMiddleware, PaymentController.getPaymentById);

// ✅ Verify payment
router.patch('/:id/verify', authMiddleware, PaymentController.verifyPayment);

// ✅ Complete payment
router.patch('/:id/complete', authMiddleware, PaymentController.completePayment);

module.exports = router;
