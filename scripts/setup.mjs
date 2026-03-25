import { copyFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const envExamplePath = '.env.example';
const envLocalPath = '.env.local';

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

if (!existsSync(envLocalPath)) {
  copyFileSync(envExamplePath, envLocalPath);
  console.log(`Created ${envLocalPath} from ${envExamplePath}.`);
} else {
  console.log(`${envLocalPath} already exists. Keeping current file.`);
}

console.log('Installing dependencies...');

const installResult = runCommand(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install']);

if (installResult.status !== 0) {
  process.exit(installResult.status ?? 1);
}

console.log('');
console.log('Setup completed.');
console.log('Next steps:');
console.log(`1. Review ${envLocalPath}`);
console.log('2. Run npm run validate');
console.log('3. Run npm run dev');
