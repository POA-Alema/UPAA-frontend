import { spawnSync } from 'node:child_process';

function runCommand(command, args) {
  if (process.platform === 'win32') {
    return spawnSync(process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', command, ...args], {
      stdio: 'inherit',
      shell: false
    });
  }

  return spawnSync(command, args, {
    stdio: 'inherit',
    shell: false
  });
}

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const steps = [
  ['run', 'check:deps'],
  ['run', 'lint'],
  ['run', 'type-check'],
  ['run', 'test'],
  ['run', 'build']
];

for (const step of steps) {
  const label = `${npmCommand} ${step.join(' ')}`;
  console.log(`\n> ${label}`);

  const result = runCommand(npmCommand, step);

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log('\nValidation completed successfully.');
