const express = require('express');
const router = express.Router();

const contentController = require('../controllers/contentController');

// POST /api/generate-content
router.post('/generate-content', contentController.generateContent);

// POST /api/save-evaluation
router.post('/save-evaluation', contentController.saveEvaluation);

// POST /api/revise-content
router.post('/revise-content', contentController.reviseContent);

// GET /api/history
router.get('/history', contentController.getHistory);

module.exports = router;
