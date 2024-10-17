const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const authMiddleware = require('../middleware/auth'); 
const { body, param, validationResult } = require('express-validator');

// Middleware for input validation
const validateCreateCharacter = [
    body('name').isString().isLength({ min: 3, max: 50 }).trim().escape().withMessage('Character name is required and must be between 3 and 50 characters'),
    body('char_type').isInt().withMessage('Character type must be a valid integer'),
];

const validateCharacterId = [
    param('id').isInt().withMessage('Character ID must be a valid integer'),
];

// Get all characters (where is_del = 0)
router.get('/my-characters', async (req, res) => {
    const userId = req.user.id;

    try {
        const [characters] = await sequelize.query(
            'SELECT c.id, c.name, c.level, t.char_img, t.char_name ' +
            'FROM `character` c ' +
            'JOIN char_type t ON c.char_type = t.id ' +
            'WHERE c.user_id = ? AND c.is_del = 0',
            { replacements: [userId] }
        );

        res.json(characters);
    } catch (error) {
        console.error('Error fetching player characters:', error);
        res.status(500).json({ error: 'Failed to fetch characters' });
    }
});

// Create a new character
router.post('/create-character', validateCreateCharacter, async (req, res) => {
    // Validate request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, char_type } = req.body;
    const userId = req.user.id;

    try {
        // Step 1: Validate that the character type is allowed (can_create = 1)
        const [validCharType] = await sequelize.query(
            'SELECT id FROM char_type WHERE id = ? AND can_create = 1',
            { replacements: [char_type] }
        );

        if (!validCharType.length) {
            return res.status(400).json({ error: 'Invalid character type. Please select a valid character type.' });
        }

        // Step 2: Check for duplicate character name
        const [existingCharacter] = await sequelize.query(
            'SELECT id FROM `character` WHERE name = ? AND user_id = ? AND is_del = 0',
            { replacements: [name, userId] }
        );

        if (existingCharacter.length) {
            return res.status(400).json({ error: 'Character name already exists. Please choose a different name.' });
        }

        // Step 3: Insert the new character if the name is unique and character type is valid
        await sequelize.query(
            'INSERT INTO `character` (user_id, char_type, name, is_del) VALUES (?, ?, ?, 0)',
            { replacements: [userId, char_type, name] }
        );

        res.json({ message: 'Character created successfully' });
    } catch (error) {
        console.error('Error creating character:', error);
        res.status(500).json({ error: 'Failed to create character' });
    }
});

// Select character for the user and store in session
router.post('/select-character', async (req, res) => {
    const userId = req.user.id;
    const { char_id } = req.body;

    try {
        // Fetch the character details along with char_type reference from the database
        const [character] = await sequelize.query(
            `SELECT c.id, c.name, c.level, c.exp, c.char_type, ct.char_name, ct.char_img
             FROM \`character\` c
             JOIN char_type ct ON c.char_type = ct.id
             WHERE c.id = ? AND c.user_id = ? AND c.is_del = 0`,
            { replacements: [char_id, userId] }
        );

        if (!character.length) {
            return res.status(404).json({ error: 'Character not found' });
        }

        // Store character data in the session
        req.session.selectedCharacter = character[0];  // Store the character details including char_type in session

        res.json({ message: 'Character selected successfully' });
    } catch (error) {
        console.error('Error selecting character:', error);
        res.status(500).json({ error: 'Failed to select character' });
    }
});

// Fetch character types where can_create = 1
router.get('/char-types', async (req, res) => {
    try {
        const [charTypes] = await sequelize.query(
            'SELECT id, char_name, char_img FROM char_type WHERE can_create = 1'
        );
        res.json(charTypes);
    } catch (error) {
        console.error('Error fetching character types:', error);
        res.status(500).json({ error: 'Failed to fetch character types' });
    }
});

// Soft delete character by setting is_del = 1
router.delete('/characters/:id', validateCharacterId, async (req, res) => {
    const userId = req.user.id;
    const charId = req.params.id;

    try {
        // Step 1: Check if the character exists and belongs to the authenticated user
        const [character] = await sequelize.query(
            'SELECT id FROM `character` WHERE id = ? AND user_id = ? AND is_del = 0',
            { replacements: [charId, userId] }
        );

        if (!character.length) {
            return res.status(404).json({ error: 'Character not found or unauthorized.' });
        }

        // Step 2: Mark the character as deleted (soft delete)
        await sequelize.query('UPDATE `character` SET is_del = 1 WHERE id = ?', { replacements: [charId] });

        res.json({ message: 'Character marked as deleted successfully.' });
    } catch (error) {
        console.error('Error marking character as deleted:', error);
        res.status(500).json({ error: 'Failed to delete character.' });
    }
});

router.get('/api/selected-character', authMiddleware, (req, res) => {
    // This route is now protected, and only accessible if the user provides a valid token

    if (req.session.selectedCharacter) {
        res.json(req.session.selectedCharacter);
    } else {
        res.status(404).json({ error: 'No character selected' });
    }
});

module.exports = router;
