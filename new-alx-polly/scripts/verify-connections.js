// scripts/verify-connections.js
// This script verifies that all files in the project are correctly connected
// and that there are no inconsistencies in imports/exports

import * as fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Configuration
// Use import.meta.url instead of __dirname for ES modules
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

// Track issues found
const issues = [];

// Helper functions
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.next')) {
      getAllFiles(filePath, fileList);
    } else if (stat.isFile() && (
      file.endsWith('.ts') || 
      file.endsWith('.tsx') || 
      file.endsWith('.js') || 
      file.endsWith('.jsx')
    )) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function checkImports(filePath, content) {
  const importRegex = /import\s+(?:(?:\{[^}]*\}|[\w*]+)\s+from\s+)?['"]([^\'"]+)['"];?/g;
  const imports = [];
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  imports.forEach(importPath => {
    // Skip node modules and relative imports that go up directories
    if (importPath.startsWith('@/') || 
        (importPath.startsWith('./') || importPath.startsWith('../'))) {
      
      let resolvedPath;
      
      if (importPath.startsWith('@/')) {
        // Handle alias imports
        const aliasPath = importPath.replace('@/', '');
        resolvedPath = path.join(srcDir, aliasPath);
      } else {
        // Handle relative imports
        resolvedPath = path.join(path.dirname(filePath), importPath);
      }
      
      // Add extensions if needed
      const possibleExtensions = ['', '.ts', '.tsx', '.js', '.jsx'];
      let fileExists = false;
      
      for (const ext of possibleExtensions) {
        const pathWithExt = resolvedPath + ext;
        if (fs.existsSync(pathWithExt) || fs.existsSync(pathWithExt + '/index.ts') || fs.existsSync(pathWithExt + '/index.tsx')) {
          fileExists = true;
          break;
        }
      }
      
      if (!fileExists) {
        issues.push(`Import not found: ${importPath} in ${filePath}`);
      }
    }
  });
  
  return imports;
}

function checkDuplicateFiles() {
  // Check for duplicate files with similar names in different directories
  const allFiles = getAllFiles(srcDir);
  const fileMap = {};
  
  allFiles.forEach(file => {
    const fileName = path.basename(file);
    if (!fileMap[fileName]) {
      fileMap[fileName] = [];
    }
    fileMap[fileName].push(file);
  });
  
  Object.keys(fileMap).forEach(fileName => {
    if (fileMap[fileName].length > 1) {
      issues.push(`Duplicate file name: ${fileName} found in:\n  - ${fileMap[fileName].join('\n  - ')}`);
    }
  });
}

function checkSupabaseConsistency() {
  // Check for inconsistencies in Supabase directories
  const libSupabaseDir = path.join(srcDir, 'lib', 'supabase');
  const supabaseDir = path.join(srcDir, 'supabase');
  
  if (fs.existsSync(libSupabaseDir) && fs.existsSync(supabaseDir)) {
    issues.push(`Multiple Supabase directories found:\n  - ${libSupabaseDir}\n  - ${supabaseDir}\nConsider consolidating these directories.`);
    
    // Check for duplicate functionality
    const libSupabaseFiles = fs.readdirSync(libSupabaseDir);
    const supabaseFiles = fs.readdirSync(supabaseDir);
    
    const commonFiles = libSupabaseFiles.filter(file => supabaseFiles.includes(file));
    if (commonFiles.length > 0) {
      issues.push(`Duplicate files found in both Supabase directories:\n  - ${commonFiles.join('\n  - ')}`);
    }
  }
}

// Main execution
function main() {
  console.log('Verifying project connections...');
  
  // Get all files
  const allFiles = getAllFiles(srcDir);
  console.log(`Found ${allFiles.length} files to check`);
  
  // Check imports in each file
  allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    checkImports(file, content);
  });
  
  // Check for duplicate files
  checkDuplicateFiles();
  
  // Check Supabase consistency
  checkSupabaseConsistency();
  
  // Report results
  if (issues.length === 0) {
    console.log('✅ All files are correctly connected!');
  } else {
    console.log(`❌ Found ${issues.length} issues:`);
    issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue}`);
    });
  }
}

main();