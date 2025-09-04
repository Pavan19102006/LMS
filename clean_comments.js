const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  try {
    console.log(`Processing: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf8');
    const ext = path.extname(filePath).toLowerCase();
    
    if (['.js', '.ts', '.tsx'].includes(ext)) {
      
      content = content.replace(/\/\*[\s\S]*?\*\
      
      
      content = content.replace(/\/\/.*$/gm, '');
    } else if (ext === '.css') {
      
      content = content.replace(/\/\*[\s\S]*?\*\
    }
    
    
    content = content.replace(/(\r?\n){2,}/g, '\n\n');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed: ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
  }
}

if (process.argv.length <= 2) {
  console.log('Usage: node clean_comments.js <file1> <file2> ...');
} else {
  const files = process.argv.slice(2);
  files.forEach(processFile);
  console.log(`Done processing ${files.length} files!`);
}
