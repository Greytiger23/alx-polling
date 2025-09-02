// Simple test script to verify ES module functionality
import { fileURLToPath } from 'url';
import path from 'path';

// Get directory name using ES module approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Script directory:', __dirname);
console.log('Project root:', path.resolve(__dirname, '..'));

// Test successful
console.log('ES module test successful!');