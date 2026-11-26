// Meridia National Statistics — hand-in program (Node 22, standard
// library only). It assembles the entry the grader reads: it copies
// this repository's app/ (the site) and screenshots/ (its renders)
// into the output directory and writes /output/dossier.json with the
// vendored make.fun library, which the gate rebuilds itself and
// compares byte for byte — so vendor/makefun-frontend.ts must stay
// exactly as the kit shipped it.
//
// The grader runs this program twice and both runs must write the
// same bytes: copying files and calling buildDossier are both
// deterministic, and nothing here reads the clock, the network, or
// any environment value except the output directory override.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The repository root is the directory holding this file.
const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Start from a clean output directory so a stale file from an
// earlier run can never leak into the entry.
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

// The site itself, plain static files under app/.
cpSync(join(repoRoot, 'app'), join(outDir, 'app'), { recursive: true });

// The screenshots, real renders of the site's own code.
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// The dossier the judge reads: the site's first load, its source,
// and its screenshots, as the library writes them. The caps mirror
// the gate (RULES.txt): at most 4 screenshots of 256 KiB, at most
// 993 files and 16 MiB in app/, dossier text at most 160 KiB.
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
