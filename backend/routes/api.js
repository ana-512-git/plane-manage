const express = require('express');
const router = express.Router();
const mlService = require('../ml/mlService');

// Test ML integration
router.post('/test-ml', async (req, res) => {
  try {
    const { data } = req.body;
    
    // Call ML service
    const mlResult = await mlService.processData(data);
    console.log(mlResult.message);
    
    res.json({
      success: true,
      message: mlResult.message,
      result: mlResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;