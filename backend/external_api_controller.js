const axios = require('axios');
const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;
let SESSION_ID;

async function startSimulation(req, res) {
  try {
      const clientData = req.body; 
      const externalResponseData = await startSim(clientData);
      console.log("received ", externalResponseData);
      
      res.json({
        success: true,
        data: externalResponseData
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
}

async function endSimulation(req, res){
  try {
    const clientData = req.body; 
    const externalResponseData = await endSim(clientData);
    console.log("received ", externalResponseData);
    
    res.json({
      success: true,
      data: externalResponseData
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

async function startRound(req, res) {
  try {
    const clientData = req.body;
    const externalResponseData = await startRound(clientData);
    console.log("received ", externalResponseData);

    res.json({
      success: true,
      data: externalResponseData
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

async function startSim(requestPayload) {
  try {
    const response = await axios.post(`${API_URL}/api/v1/session/start`, requestPayload, {
      headers: {
        'API-KEY': `${API_KEY}`, 
      }
    });
    SESSION_ID = response.data;
    return response.data; 

  } catch (error) {
    console.error('New External API Request Failed:', error.response?.data || error.message);
    throw new Error(`New External API failed: ${error.response?.status} - ${error.response?.statusText || 'Connection error'}`);
  }
}

async function endSim(requestPayload) {
  try {
    const response = await axios.post(`${API_URL}/api/v1/session/end`, requestPayload, {
      headers: {
        'API-KEY': `${API_KEY}`, 
      }
    });

    // The data returned from the external API (can be a string, object, or array)
    return response.data; 

  } catch (error) {
    // Log the detailed error (for server debugging)
    console.error('New External API Request Failed:', error.response?.data || error.message);
    
    // Throw a simple, client-safe error message
    throw new Error(`New External API failed: ${error.response?.status} - ${error.response?.statusText || 'Connection error'}`);
  }
}

async function startRound(requestPayload) {
  try {
    console.log("session id is: ", SESSION_ID);
    const response = await axios.post(`${API_URL}/api/v1/play/round`,requestPayload, {
      headers: {
        'API-KEY': `${API_KEY}`,
        'SESSION-ID': SESSION_ID
      }
    });

    // The data returned from the external API (can be a string, object, or array)
    return response.data; 

  } catch (error) {
    // Log the detailed error (for server debugging)
    console.error('New External API Request Failed:', error.response?.data || error.message);
    
    // Throw a simple, client-safe error message
    throw new Error(`New External API failed: ${error.response?.status} - ${error.response?.statusText || 'Connection error'}`);
  }
}

module.exports = { startSim, endSim, startRound, startSimulation, endSimulation, startRound };