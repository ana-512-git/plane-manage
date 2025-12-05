const { spawn } = require('child_process');
const path = require('path');

class MLService {
  constructor() {
    this.pythonPath = path.join(__dirname, 'python', 'ml_model.py');
    console.log('Python script path:', this.pythonPath); // Debug log
  }

  async processData(data) {
    return new Promise((resolve, reject) => {
      // Stringify data for command line
      const dataString = JSON.stringify(data);
      onsole.log('Calling Python with:', dataString); // Debug log
      
      // Spawn Python process
      const pythonProcess = spawn('python3', [this.pythonPath, dataString], {
        cwd: path.dirname(this.pythonPath) // Run from script's directory
      });
      
      let result = '';
      let error = '';

      // Collect data from Python stdout
      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });

      // Collect errors
      pythonProcess.stderr.on('data', (data) => {
        error += data.toString();
      });

      // Handle process completion
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python process exited with code ${code}: ${error}`));
          return;
        }
        
        try {
          const parsedResult = JSON.parse(result);
          resolve(parsedResult);
        } catch (parseError) {
          reject(new Error(`Failed to parse Python output: ${parseError.message}`));
        }
      });

      pythonProcess.on('error', (err) => {
        console.error('Failed to spawn Python:', err);
        reject(new Error(`Failed to start Python: ${err.message}`));
      });
      
    });
  }
}

module.exports = new MLService();