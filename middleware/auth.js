const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];  // Retrieve Authorization header

    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];  // Extract the token from 'Bearer <token>'
    if (!token) {
        return res.status(401).json({ error: 'Token missing' });
    }

    try {
        // Verify and decode token with secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach decoded user data to the request object
        req.user = decoded;
        next();  // Proceed to the next middleware/route

    } catch (error) {
        console.error('Invalid token:', error.message);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired' });
        }

        return res.status(403).json({ error: 'Invalid token' });
    }
};
