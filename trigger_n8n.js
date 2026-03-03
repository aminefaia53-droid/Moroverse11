const http = require('http');

// Step 1: Get all workflows
function apiCall(method, path, body) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5678,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch { resolve(data); }
            });
        });
        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function main() {
    try {
        console.log('Checking n8n connection...');
        const workflows = await apiCall('GET', '/api/v1/workflows');
        console.log('Workflows:', JSON.stringify(workflows, null, 2));

        if (workflows.data && workflows.data.length > 0) {
            const wf = workflows.data.find(w => w.name.includes('workflow')) || workflows.data[0];
            console.log(`\nExecuting workflow: ${wf.name} (id: ${wf.id})`);

            const result = await apiCall('POST', `/api/v1/workflows/${wf.id}/execute`);
            console.log('Result:', JSON.stringify(result, null, 2));
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}

main();
