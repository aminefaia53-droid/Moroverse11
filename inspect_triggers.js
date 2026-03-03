const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.env.USERPROFILE || process.env.HOME, '.n8n', 'database.sqlite');
const db = new Database(dbPath);

try {
    // Use single quotes for string literals in SQLite
    const workflow = db.prepare("SELECT name, nodes FROM workflow_entity WHERE name LIKE '%workflow 6%'").get();
    if (workflow) {
        console.log(`Found Workflow: ${workflow.name}`);
        const nodes = JSON.parse(workflow.nodes);
        console.log('--- NODES ANALYSIS ---');
        nodes.forEach(n => {
            console.log(`- ${n.name} (Type: ${n.type})`);
        });

        console.log('\n--- TRIGGERS/WEBHOOKS ---');
        const triggers = nodes.filter(n =>
            n.type.toLowerCase().includes('trigger') ||
            n.type.toLowerCase().includes('webhook')
        );

        if (triggers.length > 0) {
            triggers.forEach(t => {
                console.log(`Node: ${t.name} (Type: ${t.type})`);
                if (t.parameters) console.log('Parameters:', JSON.stringify(t.parameters, null, 2));
            });
        } else {
            console.log('No specific trigger/webhook nodes found.');
        }
    } else {
        console.log('Workflow matching "%workflow 6%" not found.');
        const allWorkflows = db.prepare("SELECT name FROM workflow_entity").all();
        console.log('Available workflows:', allWorkflows.map(w => w.name).join(', '));
    }
} catch (e) {
    console.error('Error:', e.message);
} finally {
    db.close();
}
