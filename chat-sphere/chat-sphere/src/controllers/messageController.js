// Mock function to send a message (implement actual messaging logic)
exports.sendMessage = (req, res) => {
    const { to, message } = req.body;

    // Logic to send message (save to database, notify user, etc.)

    res.status(200).json({ message: 'Message sent successfully' });
};
