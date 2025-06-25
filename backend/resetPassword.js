require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./config/db');

async function resetManagerPassword() {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('manager123', salt);
    
    await db.query(
      `UPDATE Employees SET password = ? WHERE email = 'manager@company.com'`,
      [hashedPassword]
    );
    
    console.log('Manager password reset successfully');
    process.exit(0);
  } catch (error) {
    console.error('Password reset failed:', error);
    process.exit(1);
  }
}

resetManagerPassword();