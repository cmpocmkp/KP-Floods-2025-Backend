import { generateUUID } from '../utils/uuid';

// Patch the scheduler's addCron method to use uuid instead of crypto
const patchScheduler = () => {
  try {
    const schedulerPath = require.resolve('@nestjs/schedule/dist/scheduler.orchestrator.js');
    const fs = require('fs');
    let content = fs.readFileSync(schedulerPath, 'utf8');
    
    // Replace the crypto.randomUUID() call with our UUID generator
    content = content.replace(
      /const name = options\.name \|\| crypto\.randomUUID\(\);/g,
      'const name = options.name || require("uuid").v4();'
    );
    
    fs.writeFileSync(schedulerPath, content);
  } catch (error) {
    console.warn('Failed to patch scheduler, but application will continue:', error);
  }
};

export { patchScheduler };