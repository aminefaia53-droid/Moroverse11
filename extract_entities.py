import re
import glob
import os

files = glob.glob(r"C:\Users\amine\OneDrive\Desktop\Moroverse\frontend\data\*.ts")

entities = {
    'city': [],
    'figure': [],
    'landmark': [],
    'battle': []
}

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        
        # Regex to find objects with id and name.en
        matches = re.finditer(r"id:\s*['\"]([^'\"]+)['\"].*?name:\s*{\s*en:\s*['\"]([^'\"]+)['\"]", content, re.DOTALL)
        
        filename = os.path.basename(file)
        category = 'other'
        if 'geography' in filename or 'cities' in filename:
            category = 'city'
        elif 'figures' in filename:
            category = 'figure'
        elif 'landmarks' in filename:
            category = 'landmark'
        elif 'battles' in filename:
            category = 'battle'
            
        for match in matches:
            id_val = match.group(1)
            name_val = match.group(2)
            entities[category].append(f"- ID: `{id_val}` | {name_val}")

print("### Cities")
for e in sorted(set(entities['city'])):
    print(e)
    
print("\n### Historical Figures")
for e in sorted(set(entities['figure'])):
    print(e)

print("\n### Landmarks")
for e in sorted(set(entities['landmark'])):
    print(e)
    
print("\n### Battles")
for e in sorted(set(entities['battle'])):
    print(e)
