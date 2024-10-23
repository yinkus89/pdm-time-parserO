const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
        id: user._id,
        name: user.name,
        profilePicture: user.profilePicture,
    });
};
