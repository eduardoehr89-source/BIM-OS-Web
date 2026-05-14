import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env.local") });
config();

/**
 * Dispara un deploy en Vercel usando un Deploy Hook (sin login CLI).
 *
 * 1. Vercel → tu proyecto → Settings → Git → Deploy Hooks → crea uno para `main`.
 * 2. En la raíz del proyecto, en `.env.local` (no subir a git): VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/...
 * 3. Ejecuta: npm run vercel:hook
 */

const url = process.env.VERCEL_DEPLOY_HOOK_URL?.trim();
if (!url) {
  console.error(
    "[vercel:hook] Falta VERCEL_DEPLOY_HOOK_URL. Crea un Deploy Hook en Vercel (Settings → Git) y pon la URL en .env.local"
  );
  process.exit(1);
}

const res = await fetch(url, { method: "POST" });
const text = await res.text();
console.log(`[vercel:hook] HTTP ${res.status}`, text.slice(0, 500));
process.exit(res.ok ? 0 : 1);
