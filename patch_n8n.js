const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.env.USERPROFILE || process.env.HOME, '.n8n', 'database.sqlite');
console.log('Opening database:', dbPath);

const db = new Database(dbPath);

const workflows = db.prepare('SELECT id, name, nodes FROM workflow_entity').all();

for (const workflow of workflows) {
    let nodes;
    try {
        nodes = JSON.parse(workflow.nodes);
    } catch (e) {
        continue;
    }

    let changed = false;
    for (const node of nodes) {
        if (node.type === 'n8n-nodes-base.github') {
            console.log(`\nFound GitHub node: "${node.name}"`);
            console.log(`  OLD filePath: ${node.parameters?.filePath}`);

            // Fix the broken expression
            const CORRECT_PATH = 'frontend/content/posts/={{ $json.city_en }}-{{ $json.slug }}.md';
            node.parameters.filePath = CORRECT_PATH;
            changed = true;

            console.log(`  NEW filePath: ${node.parameters?.filePath}`);
        }
    }

    if (changed) {
        db.prepare('UPDATE workflow_entity SET nodes = ? WHERE id = ?')
            .run(JSON.stringify(nodes), workflow.id);
        console.log(`\n✅ Workflow "${workflow.name}" updated!`);
    }
}

db.close();
console.log('\nDone! Please restart n8n for changes to take effect.');
