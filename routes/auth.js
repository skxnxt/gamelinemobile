const express = require('express');
const router = express.Router();
const axios = require('axios');
const qs = require('qs');  // Import the 'qs' library for proper encoding
const jwt = require('jwt-simple');
const User = require('../models/User');
require('dotenv').config();

router.post('/login', async (req, res) => {
    const { code } = req.body;

    try {
        // Use 'qs' to properly encode the data
        const tokenResponse = await axios.post('https://api.line.me/oauth2/v2.1/token',
            qs.stringify({
                grant_type: 'authorization_code',
                code,
                redirect_uri: 'http://192.168.1.8:3000/login',
                client_id: process.env.LINE_CHANNEL_ID,
                client_secret: process.env.LINE_CHANNEL_SECRET,
            }),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
        );

        const { id_token } = tokenResponse.data;
        const decoded = jwt.decode(id_token, process.env.LINE_CHANNEL_SECRET);

        let user = await User.findOne({ where: { line_id: decoded.sub } });
        if (!user) {
            user = await User.create({ line_id: decoded.sub});
        }

        const token = jwt.encode({ id: user.id }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (error) {
        console.error('LINE API Error:', error.response?.data || error.message);
        res.status(400).json({ error: 'Login failed', details: error.response?.data || error.message });
    }
});

module.exports = router;
