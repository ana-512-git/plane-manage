import React, { useEffect, useState } from 'react';
import NetworkMap from './components/NetworkMap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';

function App() {
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [mlTest, setMlTest] = useState('');
  const [simStart, setSimStart] = useState('');
  const [roundStart, setRoundStart] = useState('');
  const [simEnd, setSimEnd] = useState('');
  const [hour, setHour] = useState(0);
  const [day, setDay] = useState(0);
  const [playSim, setPlaySim] = useState('');

  // Date fictive pentru grafic (Stânga Jos) - poți să le iei din backend mai târziu
  const penaltyData = [
    { name: 'Intarzieri', valoare: 4000 },
    { name: 'Mentenanta', valoare: 3000 },
    { name: 'Fuel Waste', valoare: 2000 },
    { name: 'Missing Crew', valoare: 2780 },
    { name: 'Weather', valoare: 1890 },
  ];


  const testML = async () => {
    const response = await fetch('/api/test-ml', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { test: 'sample data' } })
    });
    const result = await response.json();
    setMlTest(result.message);
  };


  const startSim = async () => {
    const payload = {
      // nimic mmtan
    };

    try {
      const response = await fetch('/api/start-sim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();

      if (response.ok && result.success) {
        setSimStart(`Session Started! ID: ${result.data}`);
      } else {
        setSimStart(`Session Start Failed: ${result.error || 'Server error'}`);
      }
    } catch (error) {
      setSimStart(`Network Error: ${error.message}`);
    }
  };

  const startRound = async () => {
    const testData = {
      "day": day,
      "hour": hour,
      "flightLoads": [
        {
          "flightId": "63a2022d-a90f-40fc-8c29-cad16627ae78",
          "loadedKits": {
            "first": 0,
            "business": 0,
            "premiumEconomy": 0,
            "economy": 0
          }
        }
      ],
      "kitPurchasingOrders": {
        "first": 0,
        "business": 0,
        "premiumEconomy": 0,
        "economy": 0
      }
    }
    const payload = testData;
    if (hour === 23) {
      setDay(day => day + 1);
      setHour(hour => hour - 23);
    } else {
      setHour(hour => hour + 1);
    }


    try {
      const response = await fetch('/api/start-round', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      console.log("round result is: ", result);

      if (response.ok && result.success) {
        setRoundStart(`Round Started! You received: ${result.data.day} and ${result.data.hour}`);
      } else {
        setRoundStart(`Round Start Failed: ${result.error || 'Server error'}`);
      }
    } catch (error) {
      setRoundStart(`Network Error: ${error.message}`);
    }
  };

  const endSim = async () => {
    const payload = {
      // nimic mmtan
    };

    try {
      const response = await fetch('/api/end-sim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      console.log("end response: ", response);

      if (response.ok && result.success) {
        setSimEnd(`Session ended!`);
      } else {
        setSimEnd(`Session end Failed: ${result.error || 'Server error'}`);
      }
    } catch (error) {
      setSimEnd(`Network Error: ${error.message}`);
    }
  };

  const runSim = async() => {
      try {
        let hour = 0, day = 0;
        for (let i = 0; i < 720; i++) {
          const testData = {
            "day": day,
            "hour": hour,
            "flightLoads": [
              {
                "flightId": "63a2022d-a90f-40fc-8c29-cad16627ae78",
                "loadedKits": {
                  "first": 5,
                  "business": 5,
                  "premiumEconomy": 5,
                  "economy": 5
                }
              }
            ],
            "kitPurchasingOrders": {
              "first": 0,
              "business": 0,
              "premiumEconomy": 0,
              "economy": 0
            }
          }
          const payload = testData;
          
          if (hour == 23) {
            day += 1;
            hour = 0;
          } else {
            hour += 1;
          }

          try {
            const response = await fetch('/api/start-round', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });
            
            const result = await response.json();
            console.log("round result is: ", result);

            if (!response.ok || !result.success) {
              setPlaySim(`Round Start Failed: ${result.error || 'Server error'}`);
            }
          } catch (error) {
            setPlaySim(`Network Error: ${error.message}`);
            break;
          }
          }
        } catch (error) {
          console.log(error);
        }
  }

  return (
    <div className="app-container">
      <div style={{ padding: '20px' }}>
      <h1>MERN + ML Project</h1>

      <button onClick={runSim}>Run the whole sim</button>
      {mlTest && <p>ML Test: {mlTest}</p>}

      <button onClick={testML}>Test ML Integration</button>
      {mlTest && <p>ML Test: {mlTest}</p>}

      <button onClick={startSim}>Start Simulation</button>
      {simStart && <p>Received: {simStart}</p>}

      <button onClick={endSim}>End Simulation</button>
      {simEnd && <p>Received: {simEnd}</p>}

      <button onClick={startRound}>Start round</button>
      {roundStart && <p>Received: {roundStart}</p>}
    </div>
      <h1 style={{ color: '#334155', marginBottom: '20px' }}>Rotables Optimization Dashboard</h1>

      {/* GRILA 2x2 */}
      <div className="dashboard-grid">
        
        {/* 1. STÂNGA SUS: Harta */}
        <div className="dashboard-card card-map">
          <NetworkMap onAirportSelect={setSelectedAirport} />
        </div>

        {/* 2. DREAPTA SUS: Info HUB Principal */}
        <div className="dashboard-card">
          <h2>Main HUB Status (OTP)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ padding: '10px', background: '#e0f2fe', borderRadius: '8px' }}>
              <strong>Operational Status:</strong> <span style={{ color: 'green' }}>Active</span>
            </div>
            <div>
              <strong>Total Planes Managed:</strong> 42
            </div>
            <div>
              <strong>Current Processing Load:</strong> 78%
            </div>
            <div>
              <strong>Next Scheduled Maintenance:</strong> 12:00 PM
            </div>
            <button style={{ marginTop: '20px', padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
              Generate HUB Report
            </button>
          </div>
        </div>

        {/* 3. STÂNGA JOS: Grafic Penalizări */}
        <div className="dashboard-card">
          <h2>Total Network Penalties</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={penaltyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="valoare" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 4. DREAPTA JOS: Detalii Aeroport Selectat */}
        <div className="dashboard-card">
          <h2>Airport Details</h2>
          
          {selectedAirport ? (
            <div className="airport-details-content">
              <h3 style={{ color: '#0f172a' }}>{selectedAirport.displayLocation || selectedAirport.name} ({selectedAirport.displayCode || 'N/A'})</h3>
              
              <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div><strong>Cod Intern:</strong> {selectedAirport.code}</div>
                <div><strong>Tip:</strong> {selectedAirport.code === 'HUB1' ? 'HUB CENTRAL' : 'Spoke'}</div>
                
                <div style={{ marginTop: '10px' }}><strong>Cost Procesare:</strong></div>
                <div style={{ color: '#dc2626', fontWeight: 'bold' }}>{selectedAirport.economy_processing_cost || 0} €</div>
                
                <div><strong>Timp Procesare:</strong></div>
                <div>{selectedAirport.economy_processing_time || 0} min</div>

                <div><strong>Latitudine:</strong> {selectedAirport.lat?.toFixed(4)}</div>
                <div><strong>Longitudine:</strong> {selectedAirport.lng?.toFixed(4)}</div>
              </div>
            </div>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              Selectează un pin de pe hartă pentru detalii... 
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;