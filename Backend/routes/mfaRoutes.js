// Backend/routes/mfaRoutes.js
const express = require('express');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// ------------------------------
// Generate MFA QR code
// ------------------------------
router.post('/setup', authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    const secret = speakeasy.generateSecret({
      name: `BankPortal (${user.email})`,
    });

    user.mfaTempSecret = secret.base32;
    await user.save();

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    res.json({ qrCode: qrCodeUrl, secret: secret.base32 });
  } catch (err) {
    console.error('MFA setup error:', err);
    res.status(500).json({ error: 'Failed to generate MFA QR code' });
  }
});

// ------------------------------
// Verify MFA code
// ------------------------------
router.post('/verify', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { token } = req.body;

    if (!user.mfaTempSecret) {
      return res.status(400).json({ error: 'No MFA secret found for verification' });
    }

    const isVerified = speakeasy.totp.verify({
      secret: user.mfaTempSecret,
      encoding: 'base32',
      token,
    });

    if (isVerified) {
      // Save permanent MFA secret
      user.mfaSecret = user.mfaTempSecret;
      user.mfaTempSecret = undefined;
      await user.save();

      return res.json({ success: true, message: 'MFA setup complete' });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid MFA token' });
    }
  } catch (err) {
    console.error('MFA verify error:', err);
    res.status(500).json({ error: 'Failed to verify MFA code' });
  }
});

module.exports = router;
