require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const app = require('./app');
const User = require('./models/User');

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/payments_portal';

// ----------------- SEED ADMIN FUNCTION -----------------
async function seedAdminUser() {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      console.log('✅ Admin already exists:', existingAdmin.email);
      return;
    }

    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    const admin = new User({
      fullName: 'System Administrator',
      email: 'admin@bankportal.com',
      idNumber: '0000000000000',
      accountNumber: '999999',
      passwordHash: hashedPassword,
      role: 'admin',
      isActive: true,
    });

    await admin.save();
    console.log('🌟 Admin user seeded successfully!');
    console.log('➡️  Email: admin@bankportal.com');
    console.log('➡️  Password: Admin@123');
  } catch (err) {
    console.error('❌ Error seeding admin:', err);
  }
}

// ----------------- DATABASE CONNECTION -----------------
mongoose
  .connect(MONGO)
  .then(async () => {
    console.log('✅ MongoDB connected');

    // Seed admin after successful DB connection
    await seedAdminUser();

    // Start server (Render handles HTTPS for us)
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });