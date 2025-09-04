const fs = require('fs');
const path = require('path');
function removeJSComments(content) {
  content = content.replace(/\/\/.*$/gm, '');
  content = content.replace(/\/\*[\s\S]*?\*\
  content = content.replace(/^\s*[\r\n]/gm, '');
  return content;
}
function removeCSSComments(content) {
  content = content.replace(/\/\*[\s\S]*?\*\
  content = content.replace(/^\s*[\r\n]/gm, '');
  return content;
}
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const ext = path.extname(filePath).toLowerCase();
    let newContent;
    if (['.js', '.ts', '.tsx'].includes(ext)) {
      newContent = removeJSComments(content);
    } else if (ext === '.css') {
      newContent = removeCSSComments(content);
    } else {
      console.log(`Skipping unsupported file type: ${filePath}`);
      return;
    }
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Processed: ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
  }
}
const filesToProcess = process.argv.slice(2);
filesToProcess.forEach(processFile);
console.log('Done processing files!');
