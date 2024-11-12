// copy-wasm.ts
import { resolve } from 'path'
import console from 'consola'
import { copyFileSync, mkdirSync } from 'fs'

const rootDir = process.cwd();
const source = resolve(rootDir, 'node_modules/tiny-secp256k1/lib/secp256k1.wasm');
const destination = resolve(rootDir, '.output/server/node_modules/tiny-secp256k1/lib/secp256k1.wasm');

mkdirSync(resolve(destination, '..'), { recursive: true });
try {
  copyFileSync(source, destination);
  console.success(`Copied ${source} to ${destination}`);
} catch (err) {
  console.error(`Failed to copy ${source} to ${destination}`, err);
}
