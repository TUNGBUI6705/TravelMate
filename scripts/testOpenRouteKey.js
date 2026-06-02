#!/usr/bin/env node
// Usage: node scripts/testOpenRouteKey.js KEY
// Test OpenRoute Service API key using POST with Authorization header

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node scripts/testOpenRouteKey.js API_KEY');
  process.exit(1);
}

const apiKey = args[0];
const SAMPLE_START = [49.41461, 8.681495];
const SAMPLE_END = [49.420318, 8.687872];

async function testKeyWithHeader() {
  try {
    const url = 'https://api.openrouteservice.org/v2/directions/driving-car';
    const body = {
      coordinates: [[SAMPLE_START[1], SAMPLE_START[0]], [SAMPLE_END[1], SAMPLE_END[0]]],
      format: 'geojson'
    };
    
    console.log('Testing POST with Authorization header...');
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey
      },
      body: JSON.stringify(body)
    });
    
    console.log('Response status:', resp.status);
    if (resp.ok) {
      const data = await resp.json();
      console.log('✅ SUCCESS! Key works with POST header.');
      console.log('Route distance:', (data.routes[0]?.summary?.distance / 1000).toFixed(2), 'km');
      console.log('Route duration:', Math.round(data.routes[0]?.summary?.duration / 60), 'minutes');
      return true;
    } else {
      const text = await resp.text();
      console.log('❌ Failed. Status:', resp.status);
      console.log('Response body:', text.substring(0, 200));
      return false;
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    return false;
  }
}

testKeyWithHeader();
