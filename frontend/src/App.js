import React, { useEffect, useState } from 'react';
import NetworkMap from './components/NetworkMap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';

function App() {
  const [selectedAirport, setSelectedAirport] = useState(null);

  // Date fictive pentru grafic (Stânga Jos) - poți să le iei din backend mai târziu
  const penaltyData = [
    { name: 'Intarzieri', valoare: 4000 },
    { name: 'Mentenanta', valoare: 3000 },
    { name: 'Fuel Waste', valoare: 2000 },
    { name: 'Missing Crew', valoare: 2780 },
    { name: 'Weather', valoare: 1890 },
  ];

  return (
    <div className="app-container">
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