const User = require('../models/User');
const { generateUserId } = require('../utils/generateUserId');
const { hashPassword } = require('../utils/passwordUtils');
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, mobile, AadharNo } = req.body;

    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Check if mobile number already exists
    const mobileExists = await User.findOne({ mobile });
    if (mobileExists) {
      return res.status(400).json({ error: 'Mobile number already exists' });
    }
    const AadharExists = await User.findOne({ AadharNo });
    if (AadharExists) {
      return res.status(400).json({ error: 'Aadhar Number already exists' });
    }

    // Generate user ID
    const userId = generateUserId();
      // Hash the password
      const hashedPassword = await hashPassword(req.body.password);
          
    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
      AadharNo,
      userId
    });

    // Save user to database
    await user.save();

    res.json({ userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
