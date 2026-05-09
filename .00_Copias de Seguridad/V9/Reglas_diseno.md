# Reglas de diseño — Repositorio técnico

Documento de referencia para mantener coherencia visual y de UX en la aplicación. Aplica a todas las vistas (Dashboard, Proyectos, Clientes, cabecera, asistente PiP).

---

## 1. Modo de visualización

- Implementar soporte **nativo** para **modo claro** y **modo oscuro**.
- El tema puede seguir al sistema por defecto y debe poder alternarse de forma explícita en la interfaz (por ejemplo, icono sol/luna en la cabecera).
- Los tokens de color deben definirse en variables CSS para `:root` y `.dark`, de modo que componentes y utilidades (Tailwind) usen los mismos nombres semánticos (`background`, `foreground`, `muted`, `accent`, `border`, etc.).

---

## 2. Estilo general

- **Minimalista**: priorizar espacio en blanco, jerarquía tipográfica y pocos niveles de anidación visual.
- **Sin exceso de contenedores**: evitar cajas innecesarias con borde + sombra en cascada; preferir agrupación por espaciado, divisores suaves o fondos `muted` discretos.
- **Formularios**: cuando sea posible, campos con **solo línea inferior** (subrayado) en lugar de rectángulos con borde completo en todos los lados.
- **Tablas**: cabeceras discretas, filas separadas con divisores ligeros; fondos de soporte tipo `muted` suaves en lugar de marcos pesados.

---

## 3. Paleta de colores

- Usar **exclusivamente** una paleta **fría**:
  - Escalas de **gris** y **zinc** / **slate**.
  - **Azules profundos** para acentos en modo claro y, en oscuro, acentos fríos (por ejemplo cyan/azul hielo) que mantengan contraste con el fondo.
- No introducir colores cálidos dominantes (naranjas, marrones decorativos, verdes saturados de marca) salvo semántica muy acotada (por ejemplo mensajes de error con tonos fríos o rojos apagados alineados a la paleta).
- Texto secundario: `muted-foreground`; bordes: `border` con opacidad moderada cuando haga falta (`border-border/60`, etc.).

---

## 4. Iconografía

- Utilizar una librería de iconos **simple y consistente**: **Lucide React** (`lucide-react`).
- Grosor de trazo recomendado: ~**1.75** para alineación con UI fina.
- **Prohibido** el uso de **emojis** en la interfaz, mensajes de ayuda, botones y documentación orientada al producto (sustituir siempre por iconos Lucide o texto plano).

---

## 5. Asistente de voz (ventana Document PiP)

- La ventana PiP debe **inyectar CSS propio** y, además, **heredar la estética fría** y el **modo activo** (claro/oscuro) de la ventana principal:
  - Copiar variables CSS del `documentElement` principal (y tipografía del `body`).
  - Aplicar la clase `dark` en el documento PiP cuando corresponda.
- UI del asistente: **onda animada** para estado de escucha y **transcripción en tiempo real**; colores derivados de `--accent`, `--foreground`, `--muted-foreground`, `--card`, `--border`.

---

## 6. Accesibilidad y motion

- Respetar `prefers-reduced-motion` para animaciones no esenciales.
- Botones con estado discreto: `aria-label` / `title` donde solo se muestre icono (tema, asistente).

---

## 7. Stack de referencia en código

- Tokens definidos en `src/app/globals.css` (`@custom-variant dark`).
- Proveedor de tema: `next-themes` (`ThemeProvider`).
- Componentes de shell: cabecera minimal, navegación con iconos Lucide, sin emojis.

---

*Última actualización alineada con los requisitos del repositorio técnico (PDF/DWG), vistas Dashboard / Proyectos / Clientes y asistente PiP.*
