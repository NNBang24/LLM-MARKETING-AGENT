// controllers/historyController.js
const { GeneratedContent, Evaluation } = require('../models');

exports.getHistory = async (req, res) => {
  try {
    const history = await GeneratedContent.findAll({
      include: [
        { model: Evaluation, as: 'Evaluations' } // đúng alias
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Lỗi lấy lịch sử:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi lấy lịch sử'
    });
  }
};
