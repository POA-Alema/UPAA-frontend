import { copyFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const useShell = process.platform === 'win32';
const envExamplePath = '.env.example';
const envLocalPath = '.env.local';

if (!existsSync(envLocalPath)) {
  copyFileSync(envExamplePath, envLocalPath);
  console.log(`Created ${envLocalPath} from ${envExamplePath}.`);
} else {
  console.log(`${envLocalPath} already exists. Keeping current file.`);
}

console.log('Installing dependencies...');

const installResult = spawnSync(npmCommand, ['install'], {
  stdio: 'inherit',
  shell: useShell
});

if (installResult.status !== 0) {
  process.exit(installResult.status ?? 1);
}

console.log('');
console.log('Setup completed.');
console.log('Next steps:');
console.log(`1. Review ${envLocalPath}`);
console.log('2. Run npm run validate');
console.log('3. Run npm run dev');
