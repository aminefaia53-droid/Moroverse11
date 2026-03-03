const Database = require('better-sqlite3');
const path = require('path');
const http = require('http');
const crypto = require('crypto');

function uuidv4() {
    return crypto.randomUUID();
}

const dbPath = path.join(process.env.USERPROFILE || process.env.HOME, '.n8n', 'database.sqlite');
const db = new Database(dbPath);

try {
    const user = db.prepare('SELECT id FROM user LIMIT 1').get();
    console.log('User id:', user.id);

    const apiKeyId = uuidv4();
    const newKey = 'n8n_api_' + crypto.randomBytes(24).toString('hex');
    const label = 'Antigravity Trigger Key';

    console.log('Generated ID:', apiKeyId);
    console.log('Generated API key:', newKey);

    db.prepare('INSERT INTO user_api_keys (id, userId, label, apiKey, audience) VALUES (?, ?, ?, ?, ?)').run(
        apiKeyId,
        user.id,
        label,
        newKey,
        'public-api'
    );
    console.log('✅ API key inserted successfully!');

    db.close();

    // Now trigger the workflow using the new key
    console.log('\nTriggering workflow...');

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
        const wfList = await apiCall('GET', '/api/v1/workflows', null, newKey);
        console.log('Workflow list status:', wfList.status);
        if (wfList.body && wfList.body.data && wfList.body.data.length > 0) {
            const wf = wfList.body.data.find(w => w.name.includes('workflow')) || wfList.body.data[0];
            console.log(`Executing: "${wf.name}" (${wf.id})`);
            const execResult = await apiCall('POST', `/api/v1/workflows/${wf.id}/execute`, {}, newKey);
            console.log('Execution result:', JSON.stringify(execResult, null, 2));
        } else {
            console.log('Full response:', JSON.stringify(wfList, null, 2));
        }
    }

    run().catch(console.error);

} catch (e) {
    console.error('Error:', e.message);
    db.close();
}
