// In your MERN backend: ml/mlService.js

const axios = require('axios');

// Target the running Docker container on the host's mapped port
const ML_API_URL = 'http://localhost:5001/test-call'; // <-- New endpoint!

class MLService {
  // ... constructor and other methods

  async processData(data) {
    try {
      // Send a POST request with the data
      const response = await axios.post(ML_API_URL, data);
      
      // Return the JSON data received from the Python server
      return response.data; 

    } catch (error) {
      // Handle connection and API errors
      throw new Error(`Failed to communicate with Python ML API: ${error.message}`);
    }
  }
}

module.exports = new MLService();