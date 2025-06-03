#!/usr/bin/env node

/**
 * GitHub Authentication Switcher for FI-Toolbox
 * 
 * Usage:
 *   /gh-auth rnd         - Switch to lenny-miller for inner-agility-dev
 *   /gh-auth prod        - Switch to lennylmiller
 *   /gh-auth status      - Show current auth status
 *   /gh-auth help        - Show this help
 */

const { execSync } = require('child_process');

const AUTH_MAPPING = {
  'rnd': {
    user: 'lenny-miller',
    description: 'R&D (inner-agility-dev)',
    remote: 'inner-agility-dev',
    url: 'https://github.com/inner-agility-dev/fi-toolbox.git'
  },
  'prod': {
    user: 'lennylmiller', 
    description: 'Production',
    remote: 'lennylmiller',
    url: 'git@github.com:lennylmiller/fi-toolbox.git'
  }
};

function run(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8' }).trim();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

function showStatus() {
  console.log('🔍 GitHub Authentication Status\n');
  
  // Current gh auth
  const currentAuth = run('gh auth status 2>&1');
  const match = currentAuth.match(/Logged in to github\.com as (\S+)/);
  const currentUser = match ? match[1] : 'unknown';
  
  console.log(`Current GitHub CLI auth: ${currentUser}`);
  console.log('');
  
  // Git remotes
  console.log('Git Remotes:');
  Object.entries(AUTH_MAPPING).forEach(([key, config]) => {
    const remoteUrl = run(`git remote get-url ${config.remote} 2>/dev/null || echo "not configured"`);
    console.log(`  ${config.remote}: ${remoteUrl}`);
  });
  console.log('');
  
  // Recommendations
  console.log('💡 Quick Reference:');
  console.log('  • R&D work → /gh-auth rnd');
  console.log('  • Production work → /gh-auth prod');
}

function switchAuth(target) {
  const config = AUTH_MAPPING[target];
  if (!config) {
    console.error(`❌ Invalid target: ${target}`);
    console.error('Use: rnd, prod, or status');
    process.exit(1);
  }
  
  console.log(`🔄 Switching to ${config.description} (${config.user})...`);
  
  // Switch gh auth
  run(`gh auth switch -u ${config.user}`);
  console.log(`✅ Switched GitHub CLI to ${config.user}`);
  
  // Show which remote to use
  console.log(`\n📌 Remember to use the '${config.remote}' remote for this context`);
  console.log(`   Example: git push ${config.remote} main`);
}

function showHelp() {
  console.log(`
🔐 GitHub Authentication Switcher for FI-Toolbox

This tool manages GitHub authentication contexts for the dual-repository workflow.

Commands:
  /gh-auth rnd      Switch to R&D context (lenny-miller)
  /gh-auth prod     Switch to Production context (lennylmiller)  
  /gh-auth status   Show current authentication status
  /gh-auth help     Show this help message

Context Mapping:
  • R&D (inner-agility-dev) → uses 'lenny-miller' GitHub account
  • Production (lennylmiller) → uses 'lennylmiller' GitHub account

Note: Production remote uses SSH, R&D uses HTTPS.
`);
}

// Main
const args = process.argv.slice(2);
const command = args[0] || 'status';

switch (command) {
  case 'status':
    showStatus();
    break;
  case 'help':
  case '--help':
  case '-h':
    showHelp();
    break;
  case 'rnd':
  case 'prod':
    switchAuth(command);
    break;
  default:
    console.error(`❌ Unknown command: ${command}`);
    showHelp();
    process.exit(1);
}