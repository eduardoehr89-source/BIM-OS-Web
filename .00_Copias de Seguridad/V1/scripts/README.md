# Scripts

## Build de Vercel / `npm run build`

- **`copy-ifc-wasm.mjs`** — Invocado desde `package.json` (`build`). Copia los `.wasm` de `web-ifc` a `public/wasm`. **No mover ni renombrar** sin actualizar el script `build`.

## NPM (fuera del pipeline por defecto de Vercel)

- **`migrate-iso-attachments-wip.ts`** — Referenciado como `db:migrate-iso-wip` en `package.json`. Migración de datos; ejecutar manualmente cuando aplique.

## Mantenimiento / una sola vez

- **`backfill-canal-isdirect.ts`** — Script auxiliar; no forma parte de `build` ni de `postinstall`.
