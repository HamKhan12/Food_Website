const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Mock function to simulate login validation
const validateLogin = (username, password) => {
    // Replace with real validation logic
    return username === 'test' && password === 'password123';
};

// Login Route
router.post('/login', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (validateLogin(username, password)) {
            // Check if user already exists in the database
            let user = await User.findOne({ email });

            if (!user) {
                // Create new user if not already in database
                user = new User({ username, email, password });
                await user.save();
            }

            // Set session or JWT token here
            req.session.user = user;

            return res.status(200).send('User logged in and details added to the database.');
        } else {
            return res.status(401).send('Invalid username or password.');
        }
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send('Internal server error.');
    }
});

module.exports = router;