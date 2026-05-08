/** Reglas de layout PiP: colores vía variables copiadas del documento principal (claro/oscuro). */
const PIP_STRUCTURAL_CSS = `
* { box-sizing: border-box; }
body {
  margin: 0;
  min-height: 100vh;
  font-size: 13px;
  line-height: 1.45;
  background: var(--background);
  color: var(--foreground);
}
.pip-root {
  padding: 14px 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 100vh;
}
.pip-title {
  font-weight: 600;
  letter-spacing: 0.04em;
  font-size: 10px;
  text-transform: uppercase;
  color: var(--muted-foreground);
}
.pip-status {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: color-mix(in oklab, var(--card) 88%, transparent);
  border: 1px solid var(--border);
  border-radius: 10px;
}
.waves {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 22px;
}
.waves span {
  width: 4px;
  background: var(--accent);
  border-radius: 2px;
  animation: pip-wave 0.9s ease-in-out infinite;
}
.waves span:nth-child(2) { animation-delay: 0.15s; height: 65%; }
.waves span:nth-child(3) { animation-delay: 0.3s; height: 45%; }
.waves.listening span {
  animation-play-state: running;
}
.waves:not(.listening) span {
  animation: none;
  height: 35%;
  opacity: 0.35;
}
@keyframes pip-wave {
  0%, 100% { height: 35%; opacity: 0.45; }
  50% { height: 100%; opacity: 1; }
}
#transcript {
  flex: 1;
  min-height: 120px;
  padding: 10px 12px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  white-space: pre-wrap;
  overflow-y: auto;
  color: var(--foreground);
  font-size: 13px;
}
.pip-hint {
  font-size: 11px;
  color: var(--muted-foreground);
  margin: 0;
  line-height: 1.4;
}
.pip-error {
  color: var(--destructive);
  font-size: 12px;
}
`;

function copyThemeTokensFromMain(docEl: HTMLElement): string {
  try {
    const cs = getComputedStyle(docEl);
    const names = new Set<string>();
    for (let i = 0; i < cs.length; i++) {
      const prop = cs.item(i);
      if (prop.startsWith("--")) names.add(prop);
    }
    [
      "--background",
      "--foreground",
      "--muted",
      "--muted-foreground",
      "--card",
      "--card-foreground",
      "--border",
      "--input",
      "--accent",
      "--accent-foreground",
      "--destructive",
      "--destructive-foreground",
      "--font-geist-sans",
      "--font-geist-mono",
    ].forEach((n) => names.add(n));

    let block = ":root{";
    for (const name of names) {
      const v = cs.getPropertyValue(name).trim();
      if (v) block += `${name}:${v};`;
    }
    block += "}";
    return block;
  } catch {
    return ":root{}";
  }
}

function pipDocumentStyles(): string {
  const tokens = copyThemeTokensFromMain(document.documentElement);
  const ff = getComputedStyle(document.body).fontFamily || "ui-sans-serif, system-ui, sans-serif";
  return `${tokens}body{font-family:${ff};}${PIP_STRUCTURAL_CSS}`;
}

function buildPiPRuntime(originLiteral: string): string {
  return `(function(){
    var ORIGIN = ${originLiteral};
    var transcriptEl = document.getElementById('transcript');
    var wavesEl = document.querySelector('.waves');
    var parentWin = window.opener || window.parent;
    function send(cmd, payload, text) {
      try {
        if (!parentWin || parentWin.closed) return;
        parentWin.postMessage({
          type: 'voice-command',
          command: cmd,
          payload: payload,
          text: text || ''
        }, ORIGIN);
      } catch (e) {}
    }
    function parseAndDispatch(lower) {
      if (/dashboard|\\binicio\\b/.test(lower)) {
        send('navigate', '/dashboard', lower);
        return;
      }
      if (/proyectos?/.test(lower)) {
        send('navigate', '/proyectos', lower);
        return;
      }
      if (/tareas?/.test(lower)) {
        send('navigate', '/tareas', lower);
        return;
      }
      if (/clientes?/.test(lower)) {
        send('navigate', '/clientes', lower);
        return;
      }
      if (/reglamentos?/.test(lower)) {
        send('navigate', '/reglamentos', lower);
        return;
      }
      if (/filtrar/.test(lower)) {
        if (/terminad/.test(lower)) send('filter-status', 'TERMINADO', lower);
        else if (/proceso|en curso/.test(lower)) send('filter-status', 'EN_PROCESO', lower);
        else if (/pausad/.test(lower)) send('filter-status', 'PAUSADO', lower);
        else if (/cancelad/.test(lower)) send('filter-status', 'CANCELADO', lower);
        else if (/inicio|pendient/.test(lower)) send('filter-status', 'INICIO_PENDIENTE', lower);
        else if (/todas?|limpiar|todo/.test(lower)) send('filter-status', 'all', lower);
        return;
      }
      var m = lower.match(/buscar\\s+(.+)/);
      if (m && m[1]) send('search', m[1].trim(), m[1].trim());
    }
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      transcriptEl.textContent = 'SpeechRecognition no disponible en este navegador.';
      transcriptEl.className = 'pip-error';
      return;
    }
    var rec = new SR();
    rec.lang = 'es-ES';
    rec.continuous = true;
    rec.interimResults = true;
    var closed = false;
    window.addEventListener('pagehide', function() { closed = true; try { rec.stop(); } catch(e) {} });
    var finals = '';
    rec.onresult = function(ev) {
      var interim = '';
      for (var i = ev.resultIndex; i < ev.results.length; i++) {
        var r = ev.results[i];
        var t = r[0].transcript;
        if (r.isFinal) {
          var chunk = t.trim().toLowerCase();
          if (chunk) parseAndDispatch(chunk);
          finals += (finals ? ' ' : '') + t.trim();
        } else {
          interim += t;
        }
      }
      transcriptEl.textContent = (finals ? finals + '\\n' : '') + interim.trim();
      send('transcript-update', '', transcriptEl.textContent);
    };
    rec.onerror = function(ev) {
      wavesEl.classList.remove('listening');
      transcriptEl.textContent = (transcriptEl.textContent || '') + '\\n[' + (ev.error || 'error') + ']';
    };
    rec.onstart = function() {
      wavesEl.classList.add('listening');
    };
    rec.onend = function() {
      wavesEl.classList.remove('listening');
      if (closed) return;
      setTimeout(function() {
        try { rec.start(); } catch (e) {}
      }, 280);
    };
    try {
      rec.start();
    } catch (e) {
      transcriptEl.textContent = 'No se pudo iniciar el micrófono.';
      transcriptEl.className = 'pip-error';
    }
  })();`;
}

export async function openVoiceAssistantPiP(): Promise<void> {
  const pipApi = window.documentPictureInPicture;
  if (!pipApi?.requestWindow) {
    throw new Error(
      "Document Picture-in-Picture no está disponible. Usa Chrome u Edge recientes en HTTPS o localhost.",
    );
  }

  const pipWin = await pipApi.requestWindow({
    width: 380,
    height: 460,
    disallowReturnToOpener: false,
  });

  const doc = pipWin.document;
  doc.title = "Asistente de voz";

  if (document.documentElement.classList.contains("dark")) {
    pipWin.document.documentElement.classList.add("dark");
  }

  const style = doc.createElement("style");
  style.textContent = pipDocumentStyles();
  doc.head.appendChild(style);

  doc.body.innerHTML = `
    <div class="pip-root">
      <div class="pip-title">Asistente / escucha continua</div>
      <div class="pip-status">
        <div class="waves listening" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
        <span style="font-size:12px;color:var(--muted-foreground)">Escuchando</span>
      </div>
      <div id="transcript"></div>
      <p class="pip-hint">
        Comandos: "dashboard", "proyectos", "tareas", "clientes", "reglamentos",
        "filtrar inicio pendiente", "filtrar en proceso", "filtrar pausado", "filtrar terminado", "filtrar cancelado", "filtrar todo",
        "buscar …" (proyectos, archivos y clientes).
      </p>
    </div>
  `;

  const originLiteral = JSON.stringify(window.location.origin);
  const script = doc.createElement("script");
  script.textContent = buildPiPRuntime(originLiteral);
  doc.body.appendChild(script);
}
