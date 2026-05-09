# Repositorio técnico (Next.js + Prisma + SQLite)

Aplicación web para gestionar proyectos de arquitectura/ingeniería con adjuntos **PDF** y **DWG**, dashboard de métricas y **asistente de voz** en ventana **Document Picture-in-Picture** (Chrome / Edge). Interfaz en paleta fría (grises / slate / azul), **modo claro y oscuro** (por defecto según el sistema) e iconografía **Lucide**.

## Requisitos

- Node.js 20+
- Navegador con **Document Picture-in-Picture** y **Web Speech API** (recomendado: Chrome o Edge en `https://` o `localhost`).

## Instalación

```bash
npm install
```

Copia `env.example` a `.env` (o crea `.env` con la misma variable `DATABASE_URL`).

```bash
npx prisma migrate dev
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000): redirige al dashboard.

## Producción

```bash
npm run build
npm start
```

El script `postinstall` ejecuta `prisma generate` para regenerar el cliente en `src/generated/prisma` (carpeta ignorada por git).

## Tema

El interruptor sol/luna en la cabecera alterna entre modo claro y oscuro. La ventana PiP copia las variables CSS del tema activo para mantener la misma estética.

## Asistente PiP

1. Pulsa **Asistente** en la cabecera.
2. Permite el micrófono si el navegador lo solicita.
3. En la ventana flotante verás la animación de escucha y la **transcripción** en tiempo real.
4. Los comandos se envían a la ventana principal con `postMessage` (origen validado).

Ejemplos de frases (español):

- «dashboard», «proyectos», «clientes» — navegación.
- «filtrar completadas», «filtrar en curso», «filtrar pendientes», «filtrar todo» — filtro de estatus en la tabla de proyectos.
- «buscar auditorio» — texto de búsqueda en proyectos y en la lista de clientes.

Limitaciones: Safari/Firefox pueden no soportar Document PiP; el reconocimiento de voz depende del motor del navegador y puede cortarse; el código **reinicia** el reconocimiento en `onend` mientras la ventana PiP sigue abierta.

## Archivos

Los adjuntos se guardan bajo `storage/uploads/` y se descargan por `/api/files/[id]/download`. Los **DWG** no tienen previsualización en el navegador; solo metadatos y descarga.

## Base de datos

SQLite en la ruta definida por `DATABASE_URL` (por defecto `file:./prisma/dev.db`). Prisma 7 usa el adaptador `better-sqlite3` configurado en [`src/lib/prisma.ts`](src/lib/prisma.ts).
