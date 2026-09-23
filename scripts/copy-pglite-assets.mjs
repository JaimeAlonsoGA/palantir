import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const dest = join(
  process.cwd(),
  ".vercel/output/functions/__server.func/_libs",
);
const src = join(process.cwd(), "node_modules/@electric-sql/pglite/dist");

if (!existsSync(dest)) {
  console.error("[pglite] function dir missing, skip");
  process.exit(0);
}

for (const file of ["pglite.data", "pglite.wasm", "initdb.wasm"]) {
  const from = join(src, file);
  if (!existsSync(from)) {
    console.error(`[pglite] missing ${from}`);
    process.exit(1);
  }
  copyFileSync(from, join(dest, file));
  console.log(`[pglite] copied ${file}`);
}
