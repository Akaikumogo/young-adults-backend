import * as fs from 'fs';
import * as path from 'path';

const ALLOWED_EXTS = new Set(['.svg', '.png', '.jpg', '.jpeg', '.webp', '.mp4']);

function isAllowedAsset(fileName: string) {
  return ALLOWED_EXTS.has(path.extname(fileName).toLowerCase());
}

function safeCopy(src: string, dst: string) {
  if (!fs.existsSync(src)) return false;
  if (fs.existsSync(dst)) return false;
  fs.copyFileSync(src, dst);
  return true;
}

async function bootstrap() {
  const repoRoot = process.cwd();
  const uploadsSeedDir = path.join(repoRoot, 'uploads', 'seed');
  fs.mkdirSync(uploadsSeedDir, { recursive: true });

  const candidates = [
    path.resolve(repoRoot, '../young-adults/src/assets'),
    path.resolve(repoRoot, '../ygw/src/assets'),
  ];

  const results: Record<string, 'copied' | 'skipped' | 'missing'> = {};

  for (const dir of candidates) {
    if (!fs.existsSync(dir)) continue;
    const entries = fs.readdirSync(dir);
    for (const name of entries) {
      if (!isAllowedAsset(name)) continue;
      const dst = path.join(uploadsSeedDir, name);
      const src = path.join(dir, name);
      const copied = safeCopy(src, dst);
      results[name] = copied ? 'copied' : 'skipped';
    }
  }

  if (Object.keys(results).length === 0) {
    console.log('✅ seed-assets done (no assets found in candidates)', candidates);
    return;
  }

  console.log('✅ seed-assets done', results);
}

bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});

