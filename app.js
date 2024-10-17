const cors = require('cors');
const express = require('express');
const session = require('express-session');
const app = express();
const authRoute = require('./routes/auth');
const characterRoute = require('./routes/characters');
const monsterRoutes = require('./routes/monster');
const authMiddleware = require('./middleware/auth');
const sequelize = require('./config/database');
const path = require('path');

app.use(session({
    secret: '$k#n#!@G#m3',  // Replace with a strong secret key
    resave: false,  // Avoid resaving the session if it wasn’t modified
    saveUninitialized: false,  // Don’t create a session until something is stored
    cookie: {
        secure: false,  // Set to true if using HTTPS
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
        maxAge: 1000 * 60 * 60 * 24 // 24-hour cookie expiration
    }
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes to serve HTML pages
app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'game.html'));
});

app.get('/character', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'select-character.html'));
});

app.get('/create', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'create-character.html'));
});

// API routes protected with authentication middleware
app.use(cors());
app.use('/auth', authRoute);
app.use('/api', authMiddleware, characterRoute);
app.use('/api/monsters', monsterRoutes);

// Optional: Fallback route for unmatched paths (for client-side routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server after syncing the database
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`Server running on http://192.168.1.8:${PORT}`));
});
