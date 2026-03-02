import sqlite3
import json

db_path = r"C:\Users\amine\.n8n\database.sqlite"

try:
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Get all workflows
    cursor.execute("SELECT id, name, nodes FROM workflow_entity")
    rows = cursor.fetchall()
    
    found = False
    for row in rows:
        nodes = json.loads(row['nodes'])
        for node in nodes:
            if node['type'] == 'n8n-nodes-base.github':
                print(f"Workflow ID: {row['id']}, Name: {row['name']}")
                print("Found GitHub node:", json.dumps(node, indent=2))
                found = True
                break
    if not found:
        print("No GitHub node found in any workflow.")
except Exception as e:
    print("Error:", e)
finally:
    if 'conn' in locals():
        conn.close()
