const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Mock login function (implement actual authentication logic)
exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Find user by email and check password (use hashing in production)
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
        token,
        user: {
            id: user._id,
            name: user.name,
            profilePicture: user.profilePicture,
        },
    });
};
