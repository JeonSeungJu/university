const execSync = require('child_process').execSync;

// Build the frontend using npm
execSync('npm run build', { stdio: 'inherit' });