const http = require('http');

const apiKey = 'n8n_api_74b0d8f5f9d6fad7ebe6aff53971ada188491963b5bccc06';

function apiCall(method, apiPath, body, key) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5678,
            path: apiPath,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-N8N-API-KEY': key
            }
        };
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
                catch { resolve({ status: res.statusCode, body: data }); }
            });
        });
        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function run() {
    try {
        console.log('Fetching workflows...');
        const res = await apiCall('GET', '/api/v1/workflows', null, apiKey);
        if (res.body && res.body.data && res.body.data.length > 0) {
            const wf = res.body.data.find(w => w.name.includes('workflow')) || res.body.data[0];
            console.log(`Executing: "${wf.name}" (${wf.id})`);

            // Try /run endpoint
            const execResult = await apiCall('POST', `/api/v1/workflows/${wf.id}/run`, {}, apiKey);
            console.log('Execution result:', JSON.stringify(execResult, null, 2));
        } else {
            console.log('No workflows found or error:', JSON.stringify(res, null, 2));
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}

run();
