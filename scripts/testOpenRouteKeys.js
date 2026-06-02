#!/usr/bin/env node
// Usage: node scripts/testOpenRouteKeys.js KEY1 KEY2 ...
// This script prefers the global `fetch` (Node 18+). If not present,
// it will try to dynamically import `node-fetch`.

let fetchFn = globalThis.fetch;
if (!fetchFn) {
  try {
    // node-fetch v2 uses default export; v3 is ESM. Try dynamic import.
    const mod = await import('node-fetch');
    fetchFn = mod.default || mod;
  } catch (err) {
    console.error('No global fetch and failed to import node-fetch. Install node-fetch or run on Node 18+.');
    process.exit(1);
  }
const fetch = fetchFn;

// Usage: node scripts/testOpenRouteKeys.js KEY1 KEY2 ...
// The script will try each key using two methods:
// 1) POST to /v2/directions/driving-car with Authorization header
// 2) GET to /v2/directions/driving-car with api_key query parameter

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Provide at least one API key as argument.');
  process.exit(1);
}

const SAMPLE_START = [49.41461, 8.681495];
const SAMPLE_END = [49.420318, 8.687872];

async function testKey(key) {
  const results = { key, headerOk: false, queryOk: false, headerError: null, queryError: null };

  // Try POST with Authorization header
  try {
    const url = 'https://api.openrouteservice.org/v2/directions/driving-car';
    const body = {
      coordinates: [[SAMPLE_START[1], SAMPLE_START[0]], [SAMPLE_END[1], SAMPLE_END[0]]],
      format: 'geojson'
    };
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': key
      },
      body: JSON.stringify(body),
      timeout: 10000
    });
    if (resp.ok) {
      results.headerOk = true;
    } else {
      results.headerError = { status: resp.status, text: await resp.text().catch(()=>'<no body>') };
    }
  } catch (err) {
    results.headerError = { message: err.message };
  }

  // Try GET with api_key param
  try {
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${encodeURIComponent(key)}&start=${SAMPLE_START[1]},${SAMPLE_START[0]}&end=${SAMPLE_END[1]},${SAMPLE_END[0]}`;
    const resp = await fetch(url, { method: 'GET', timeout: 10000 });
    if (resp.ok) {
      results.queryOk = true;
    } else {
      results.queryError = { status: resp.status, text: await resp.text().catch(()=>'<no body>') };
    }
  } catch (err) {
    results.queryError = { message: err.message };
  }

  return results;
}

(async function main() {
  for (const key of args) {
    console.log('\nTesting key:', key.substring(0, 10) + '...');
    const r = await testKey(key);
    console.log(' Header POST OK:', r.headerOk);
    if (r.headerError) console.log(' Header error:', r.headerError);
    console.log(' Query GET OK:', r.queryOk);
    if (r.queryError) console.log(' Query error:', r.queryError);
  }
  console.log('\nDone.');
})();
