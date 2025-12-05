const express = require('express');
const router = express.Router();
const mlService = require('../ml/mlService');

// Test ML integration
router.post('/test-ml', async (req, res) => {
  try {
    const { data } = req.body;
    
    // Call ML service
    const mlResult = await mlService.processData(data);
    
    res.json({
      success: true,
      message: 'ML processing complete',
      result: mlResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;