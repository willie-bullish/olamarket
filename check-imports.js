const fs = require('fs');
const path = require('path');

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    if (line.includes('import') && line.includes('from')) {
      const match = line.match(/from\s+['\"]([^'\"]+)['\"]/);
      if (match) {
        console.log(path.basename(filePath) + ':' + (i+1), JSON.stringify(match[1]));
      }
    }
  });
}

function walkDir(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  files.forEach(file => {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      walkDir(fullPath);
    } else if (file.name.endsWith('.ts') || file.name.endsWith('.js')) {
      checkFile(fullPath);
    }
  });
}

walkDir('src');
