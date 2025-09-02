/**
 * Supabase Directory Migration Script
 * 
 * This script helps consolidate the two Supabase directories:
 * - /src/supabase
 * - /src/lib/supabase
 * 
 * It identifies files that need to be merged and updates import paths.
 */

import * as fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// For ES modules, we need to create __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root directory
const rootDir = path.resolve(__dirname, '..');

// Source and destination directories
const srcDir = path.join(rootDir, 'src', 'supabase');
const destDir = path.join(rootDir, 'src', 'lib', 'supabase');

// Ensure destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Get list of files in source directory
const srcFiles = fs.readdirSync(srcDir);

console.log('\n=== Supabase Directory Migration ===\n');
console.log(`Source: ${srcDir}`);
console.log(`Destination: ${destDir}\n`);

// Process each file
console.log('Files to process:');
srcFiles.forEach(file => {
  const srcPath = path.join(srcDir, file);
  const destPath = path.join(destDir, file);
  const destExists = fs.existsSync(destPath);
  
  console.log(`- ${file}${destExists ? ' (exists in destination)' : ''}`);
});

console.log('\nImport paths to update:');

// Find all files that import from @/supabase
try {
  const grepResult = execSync(
    'grep -r "from \'@/supabase" --include="*.ts" --include="*.tsx" ./src',
    { cwd: rootDir, encoding: 'utf8' }
  );
  
  const importLines = grepResult.split('\n').filter(line => line.trim());
  importLines.forEach(line => {
    const [filePath, importStatement] = line.split(':', 2);
    console.log(`- ${filePath}: ${importStatement.trim()}`);
  });
} catch (error) {
  console.log('No imports from @/supabase found or grep command failed.');
}

console.log('\n=== Migration Instructions ===');
console.log('1. Review the files listed above');
console.log('2. For each file that exists in both directories:');
console.log('   - Compare the contents');
console.log('   - Merge functionality into the destination file');
console.log('3. For files that only exist in the source directory:');
console.log('   - Copy them to the destination directory');
console.log('4. Update all import paths from @/supabase to @/lib/supabase');
console.log('5. Run tests to ensure everything works');
console.log('6. Remove the source directory when complete');

console.log('\nRun this script with --execute to perform the migration automatically (not implemented yet)\n');