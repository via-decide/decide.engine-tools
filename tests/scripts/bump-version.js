#!/usr/bin/env node
/**
 * Version bump utility
 * Usage: node tests/scripts/bump-version.js patch|minor|major
 * Updates package.json version + prepends CHANGELOG entry
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '../..');
const type = process.argv[2] || 'patch';

if (!['patch', 'minor', 'major'].includes(type)) {
  console.error('Usage: node bump-version.js patch|minor|major');
  process.exit(1);
}

// Bump version
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const [maj, min, pat] = pkg.version.split('.').map(Number);
const newVersion = type === 'major' ? `${maj+1}.0.0`
                 : type === 'minor' ? `${maj}.${min+1}.0`
                 : `${maj}.${min}.${pat+1}`;

pkg.version = newVersion;
fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');

// Prepend CHANGELOG entry
const today = new Date().toISOString().slice(0, 10);
const newEntry = `## [${newVersion}] — ${today}\n\n### Changed\n- (fill in)\n\n---\n\n`;
const changelog = fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8');
const insertAt = changelog.indexOf('\n## [');
const updated = insertAt === -1
  ? changelog + '\n' + newEntry
  : changelog.slice(0, insertAt + 1) + newEntry + changelog.slice(insertAt + 1);

fs.writeFileSync(path.join(root, 'CHANGELOG.md'), updated);

console.log(`✓ Bumped to v${newVersion}`);
console.log(`✓ CHANGELOG.md updated — fill in the [${newVersion}] entry`);
