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
// It also runs as an unprivileged user against a harness-owned
// /output on a read-only file system: never remove, rename or chmod
// the output directory itself, and never write anywhere but inside
// it (see the cleaning step below for the rejection this caused).
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The repository root is the directory holding this file.
const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Start from a clean output directory so a stale file from an
// earlier run can never leak into the entry. Only the CONTENTS are
// removed, never the directory itself: the grader creates /output
// itself and runs this program as an unprivileged user, so deleting
// the directory (rmdir on a harness-owned, possibly mounted path)
// throws EACCES/EBUSY and the run dies before writing anything —
// that is exactly what rejected the first submission. Deleting the
// children of a writable directory is all the cleanliness we need,
// and it is what the kit's starter does (it never removes /output).
mkdirSync(outDir, { recursive: true });
for (const name of readdirSync(outDir)) {
  rmSync(join(outDir, name), { recursive: true, force: true });
}

// The site itself, plain static files under app/.
cpSync(join(repoRoot, 'app'), join(outDir, 'app'), { recursive: true });

// The screenshots, real renders of the site's own code. cpSync
// creates the destination directory itself, as in the kit starter.
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
