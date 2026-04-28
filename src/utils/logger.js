// src/utils/logger.js
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

function info(msg)    { console.log(`${colors.cyan}[agentflow]${colors.reset} ${msg}`); }
function success(msg) { console.log(`${colors.green}[agentflow] ✓${colors.reset} ${msg}`); }
function warn(msg)    { console.log(`${colors.yellow}[agentflow] ⚠${colors.reset} ${msg}`); }
function error(msg)   { console.error(`${colors.red}[agentflow] ✗${colors.reset} ${msg}`); }
function agent(name, msg) { console.log(`${colors.gray}[${name}]${colors.reset} ${msg}`); }

module.exports = { info, success, warn, error, agent };
