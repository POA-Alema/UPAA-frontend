import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');

function readJson(relativePath) {
  return JSON.parse(readFileSync(path.join(repoRoot, relativePath), 'utf8'));
}

function stableObjectEntries(object) {
  return Object.fromEntries(Object.entries(object ?? {}).sort(([left], [right]) => left.localeCompare(right)));
}

function compareSection(sectionName, current, expected) {
  const currentJson = JSON.stringify(stableObjectEntries(current));
  const expectedJson = JSON.stringify(stableObjectEntries(expected));

  if (currentJson !== expectedJson) {
    throw new Error(`Dependency baseline mismatch in "${sectionName}".`);
  }
}

const baseline = readJson('scripts/dependency-baseline.json');
const packageJson = readJson('package.json');
const packageLockRaw = readFileSync(path.join(repoRoot, 'package-lock.json'), 'utf8');

compareSection('dependencies', packageJson.dependencies, baseline.dependencies);
compareSection('devDependencies', packageJson.devDependencies, baseline.devDependencies);

const lockHash = createHash('sha256').update(packageLockRaw).digest('hex').toUpperCase();

if (lockHash !== baseline.packageLockSha256) {
  throw new Error('Dependency baseline mismatch in "package-lock.json".');
}

console.log('Dependency baseline check passed.');
