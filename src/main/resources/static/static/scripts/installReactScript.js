const execSync = require('child_process').execSync;

// Install frontend dependencies using npm
execSync('npm install', { stdio: 'inherit' });