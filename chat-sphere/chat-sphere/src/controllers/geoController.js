// Mock function to share location (implement actual logic)
exports.shareLocation = (req, res) => {
    const { userId, location } = req.body;

    // Logic to save location to the database

    res.status(200).json({ message: 'Location shared successfully' });
};
