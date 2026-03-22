import { spawnSync } from 'node:child_process';

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const useShell = process.platform === 'win32';
const steps = [
  ['run', 'lint'],
  ['run', 'type-check'],
  ['run', 'test'],
  ['run', 'build']
];

for (const step of steps) {
  const label = `${npmCommand} ${step.join(' ')}`;
  console.log(`\n> ${label}`);

  const result = spawnSync(npmCommand, step, {
    stdio: 'inherit',
    shell: useShell
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log('\nValidation completed successfully.');
