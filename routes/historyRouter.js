const express = require('express');
const router = express.Router();
const { getHistory } = require('../controllers/historyController');

router.get('/history-data', getHistory);

module.exports = router;
