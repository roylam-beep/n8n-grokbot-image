#!/usr/bin/env node
/**
 * Unlock feat:advancedPermissions for self-hosted internal use.
 * Does NOT inject a pirated license key — forces the feature flag checks to true.
 */
const fs = require('fs');

const replacements = [
  {
    file: '/usr/local/lib/node_modules/n8n/node_modules/@n8n/backend-common/dist/license-state.js',
    find: /isAdvancedPermissionsLicensed\(\)\s*\{\s*return this\.isLicensed\(['"]feat:advancedPermissions['"]\);\s*\}/m,
    replace: 'isAdvancedPermissionsLicensed() { return true; }',
  },
  {
    file: '/usr/local/lib/node_modules/n8n/dist/license.js',
    find: /isAdvancedPermissionsLicensed\(\)\s*\{\s*return this\.isLicensed\([^\)]+\);\s*\}/m,
    replace: 'isAdvancedPermissionsLicensed() { return true; }',
  },
];

let ok = 0;
for (const { file, find, replace } of replacements) {
  if (!fs.existsSync(file)) {
    console.error('MISSING', file);
    process.exit(1);
  }
  const before = fs.readFileSync(file, 'utf8');
  if (!find.test(before)) {
    // already patched?
    if (before.includes('isAdvancedPermissionsLicensed() { return true; }') || before.includes('isAdvancedPermissionsLicensed(){return true;}')) {
      console.log('ALREADY', file);
      ok++;
      continue;
    }
    console.error('PATTERN_NOT_FOUND', file);
    process.exit(1);
  }
  const after = before.replace(find, replace);
  fs.writeFileSync(file, after);
  console.log('PATCHED', file);
  ok++;
}

// Force frontend settings default + runtime assignment path still uses license method (already patched).
// Also hard-set the static default in frontend.service.js for safety.
const fe = '/usr/local/lib/node_modules/n8n/dist/services/frontend.service.js';
if (fs.existsSync(fe)) {
  let s = fs.readFileSync(fe, 'utf8');
  const s2 = s
    .replace(/advancedPermissions:\s*false/g, 'advancedPermissions: true')
    .replace(/advancedPermissions:\s*this\.license\.isAdvancedPermissionsLicensed\(\)/g, 'advancedPermissions: true');
  if (s2 !== s) {
    fs.writeFileSync(fe, s2);
    console.log('PATCHED', fe);
  } else {
    console.log('FE_NOCHANGE_OR_ALREADY', fe);
  }
}

console.log('DONE', ok);
