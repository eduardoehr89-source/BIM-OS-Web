import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const srcDir = join(root, "node_modules", "web-ifc");
const destDir = join(root, "public", "wasm");
const files = ["web-ifc.wasm", "web-ifc-mt.wasm", "web-ifc-mt.worker.js"];

mkdirSync(destDir, { recursive: true });

let copied = 0;
for (const name of files) {
  const src = join(srcDir, name);
  const dest = join(destDir, name);
  if (!existsSync(src)) {
    if (name === "web-ifc-mt.worker.js") continue;
    console.warn(`[copy-ifc-wasm] Missing source file: ${src}`);
    continue;
  }
  copyFileSync(src, dest);
  copied++;
  console.log(`[copy-ifc-wasm] Copied ${name} -> public/wasm/`);
}

if (copied < 2) {
  console.warn("[copy-ifc-wasm] Expected web-ifc.wasm and web-ifc-mt.wasm from web-ifc; IFC viewer may fail until they are present.");
  process.exitCode = 0;
}
