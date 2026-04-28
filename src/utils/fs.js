// src/utils/fs.js
const fs = require('fs');
const path = require('path');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf-8');
}

function readFile(filePath, defaultValue = '') {
  if (!fs.existsSync(filePath)) return defaultValue;
  return fs.readFileSync(filePath, 'utf-8');
}

function readJson(filePath, defaultValue = {}) {
  if (!fs.existsSync(filePath)) return defaultValue;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return defaultValue;
  }
}

function writeJson(filePath, data) {
  writeFile(filePath, JSON.stringify(data, null, 2));
}

function listDirs(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath).filter((name) => {
    const full = path.join(dirPath, name);
    return fs.statSync(full).isDirectory() && !name.startsWith('.');
  });
}

function listFiles(dirPath, pattern = null) {
  if (!fs.existsSync(dirPath)) return [];
  const files = fs.readdirSync(dirPath).filter((name) => {
    const full = path.join(dirPath, name);
    return fs.statSync(full).isFile();
  });
  if (pattern) {
    const regex = new RegExp(pattern.replace('*', '.*'));
    return files.filter((f) => regex.test(f));
  }
  return files;
}

module.exports = {
  ensureDir,
  writeFile,
  readFile,
  readJson,
  writeJson,
  listDirs,
  listFiles,
};
