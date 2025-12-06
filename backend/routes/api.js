const express = require('express');
const router = express.Router();
const mlService = require('../ml/mlService');
const { startSim, endSim, startRound } = require('../external_api');

// Test ML integration
router.post('/test-ml', async (req, res) => {
  try {
    const { data } = req.body;
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

router.post('/start-sim', async (req, res) => {
  try {
    const clientData = req.body; 
    const externalResponseData = await startSim(clientData);
    console.log("received ", externalResponseData);
    
    res.json({
      success: true,
      data: externalResponseData
    });
    
  } catch (error) {
    // Handle errors thrown by the service
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/end-sim', async (req, res) => {
  try {
    const clientData = req.body; 
    const externalResponseData = await endSim(clientData);
    console.log("received ", externalResponseData);
    
    // 3. Return the external API's response to the client
    res.json({
      success: true,
      data: externalResponseData // This contains the string/object/array from the external API
    });
    
  } catch (error) {
    // Handle errors thrown by the service
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/start-round', async (req, res) => {
  try {
    const clientData = req.body;
    const externalResponseData = await startRound(clientData);
    console.log("received ", externalResponseData);
    
    // 3. Return the external API's response to the client
    res.json({
      success: true,
      data: externalResponseData // This contains the string/object/array from the external API
    });
    
  } catch (error) {
    // Handle errors thrown by the service
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


module.exports = router;