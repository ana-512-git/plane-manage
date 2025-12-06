const mlService = require('./mlService');

async function sendMLRequest(req, res){
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
}

module.exports = { sendMLRequest };