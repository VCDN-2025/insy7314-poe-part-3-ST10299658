const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const User = require('../models/User');

exports.setupMFA = async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({
      name: `BankPortal (${req.user.email})`
    });
    
    // Store temp secret (not enabled yet)
    req.user.mfaTempSecret = secret.base32;
    await req.user.save();
    
    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);
    
    res.json({
      secret: secret.base32,
      qrCode
    });
  } catch (err) {
    res.status(500).json({ error: 'MFA setup failed' });
  }
};

exports.verifyMFA = async (req, res) => {
  try {
    const { token } = req.body;
    
    const verified = speakeasy.totp.verify({
      secret: req.user.mfaTempSecret,
      encoding: 'base32',
      token,
      window: 2
    });
    
    if (verified) {
      req.user.mfaSecret = req.user.mfaTempSecret;
      req.user.mfaEnabled = true;
      req.user.mfaTempSecret = undefined;
      await req.user.save();
      
      res.json({ message: 'MFA enabled successfully' });
    } else {
      res.status(400).json({ error: 'Invalid token' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Verification failed' });
  }
};

exports.validateMFA = async (req, res, next) => {
  // Used during login
  try {
    const { token } = req.body;
    const user = req.user;
    
    if (!user.mfaEnabled) {
      return next();
    }
    
    const verified = speakeasy.totp.verify({
      secret: user.mfaSecret,
      encoding: 'base32',
      token,
      window: 2
    });
    
    if (verified) {
      next();
    } else {
      res.status(401).json({ error: 'Invalid MFA token' });
    }
  } catch (err) {
    res.status(500).json({ error: 'MFA validation failed' });
  }
};