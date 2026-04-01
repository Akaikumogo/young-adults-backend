import * as fs from 'fs';
import * as path from 'path';

const ASSET_NAMES = [
  'Rectangle_3980_bg_removed_deep.svg',
  'Rectangle_3980_no_bg.svg',
  'customer-service.svg',
  'footerLogo.svg',
  'image.svg',
  'logo.svg',
  'logo_ya-coloured-black.svg',
  'photo_2025-07-28_10-42-28.svg',
  'travel.svg',
] as const;

function safeCopy(src: string, dst: string) {
  if (!fs.existsSync(src)) return false;
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

  for (const name of ASSET_NAMES) {
    const dst = path.join(uploadsSeedDir, name);
    if (fs.existsSync(dst)) {
      results[name] = 'skipped';
      continue;
    }

    let copied = false;
    for (const dir of candidates) {
      const src = path.join(dir, name);
      if (safeCopy(src, dst)) {
        copied = true;
        break;
      }
    }
    results[name] = copied ? 'copied' : 'missing';
  }

  console.log('✅ seed-assets done', results);
}

bootstrap().catch((e) => {
  console.error(e);
  process.exit(1);
});

