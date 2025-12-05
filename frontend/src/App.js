import { useEffect, useState } from 'react';

function App() {
  const [backendStatus, setBackendStatus] = useState('');
  const [mlTest, setMlTest] = useState('');

  useEffect(() => {
    // Test backend connection
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setBackendStatus(data.message));
  }, []);

  const testML = async () => {
    const response = await fetch('/api/test-ml', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { test: 'sample data' } })
    });
    const result = await response.json();
    setMlTest(result.message);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>MERN + ML Project</h1>
      <p>Backend: {backendStatus}</p>
      <button onClick={testML}>Test ML Integration</button>
      {mlTest && <p>ML Test: {mlTest}</p>}
    </div>
  );
}

export default App;