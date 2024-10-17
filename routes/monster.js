const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const { body, param, validationResult } = require('express-validator');
const { Monster } = require('../models');  // Assuming you have a Monster model set up with Sequelize

// Validation middleware for monster creation/update
const validateMonster = [
    body('name').isString().isLength({ min: 3, max: 50 }).trim().escape().withMessage('Monster name is required and must be between 3 and 50 characters'),
    body('level').isInt({ min: 1 }).withMessage('Monster level must be a valid integer and greater than 0'),
    body('damage').isInt({ min: 0 }).withMessage('Monster damage must be a non-negative integer'),
    body('defense').isInt({ min: 0 }).withMessage('Monster defense must be a non-negative integer'),
    body('exp').isInt({ min: 0 }).withMessage('Monster experience points (EXP) must be a non-negative integer'),
    body('gold').isInt({ min: 0 }).withMessage('Monster gold reward must be a non-negative integer'),
];

// Validation middleware for monster ID in parameters
const validateMonsterId = [
    param('id').isInt().withMessage('Monster ID must be a valid integer'),
];

// 1. Fetch all monsters
router.get('/', async (req, res) => {
    try {
        const monsters = await Monster.findAll();  // Fetch all monsters from the database
        res.json(monsters);
    } catch (error) {
        console.error('Error fetching monsters:', error);
        res.status(500).json({ error: 'Failed to fetch monsters' });
    }
});

// 2. Fetch a specific monster by ID
router.get('/:id', validateMonsterId, async (req, res) => {
    const monsterId = req.params.id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const monster = await Monster.findOne({ where: { id: monsterId } });
        if (!monster) {
            return res.status(404).json({ error: 'Monster not found' });
        }
        res.json(monster);
    } catch (error) {
        console.error('Error fetching monster:', error);
        res.status(500).json({ error: 'Failed to fetch monster' });
    }
});

// 3. Create a new monster (admin-only functionality)
router.post('/', validateMonster, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, level, damage, defense, exp, gold, image } = req.body;

    try {
        const newMonster = await Monster.create({ name, level, damage, defense, exp, gold, image });
        res.json({ message: 'Monster created successfully', newMonster });
    } catch (error) {
        console.error('Error creating monster:', error);
        res.status(500).json({ error: 'Failed to create monster' });
    }
});

// 4. Update a monster (admin-only functionality)
router.put('/:id', validateMonsterId, validateMonster, async (req, res) => {
    const monsterId = req.params.id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, level, damage, defense, exp, gold, image } = req.body;

    try {
        const monster = await Monster.findOne({ where: { id: monsterId } });
        if (!monster) {
            return res.status(404).json({ error: 'Monster not found' });
        }

        // Update monster details
        await monster.update({ name, level, damage, defense, exp, gold, image });
        res.json({ message: 'Monster updated successfully', monster });
    } catch (error) {
        console.error('Error updating monster:', error);
        res.status(500).json({ error: 'Failed to update monster' });
    }
});

// 5. Delete a monster (admin-only functionality)
router.delete('/:id', validateMonsterId, async (req, res) => {
    const monsterId = req.params.id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const monster = await Monster.findOne({ where: { id: monsterId } });
        if (!monster) {
            return res.status(404).json({ error: 'Monster not found' });
        }

        // Delete monster from database
        await monster.destroy();
        res.json({ message: 'Monster deleted successfully' });
    } catch (error) {
        console.error('Error deleting monster:', error);
        res.status(500).json({ error: 'Failed to delete monster' });
    }
});

module.exports = router;
