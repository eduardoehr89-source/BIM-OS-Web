# BIM.OS — DNA del ecosistema (marketing y producto)

Documento de referencia para **contenido en LinkedIn**, propuestas comerciales y alineación interna. Describe capacidades del producto sin detalle de implementación técnica.

**Seguridad:** no se documentan credenciales. Las acciones sensibles se cubren solo como **Validación de PIN de Seguridad**.

---

## A quién va dirigido

BIM.OS nace en el **sector AEC** (arquitectura, ingeniería y construcción) y habla con quienes viven el modelo y la información del proyecto día a día:

- **Modeladores BIM** — producción y revisión de modelos y entregables.
- **Coordinadores BIM** — alineación entre disciplinas, calidad de datos y plazos.
- **BIM managers** — gobierno del método, estándares y cumplimiento (ISO 19650, BEP, flujos CDE).

**No se limita a esos perfiles:** también encaja con **jefes de proyecto**, **documentalistas**, **dirección de obra**, **compras/licitación** y **mandantes** que necesitan visibilidad, trazabilidad y comunicación sin perder el hilo técnico. La plataforma ordena la información para **todo el equipo** que toca el activo, no solo para quien modela.

---

## 1. Gestión y gobernanza de proyectos

**Control centralizado**  
La creación de **proyectos** y **clientes** está acotada al rol **Admin Supremo** (Eduardo), para mantener orden en la cartera y coherencia de la información maestra.

**Estatus ISO 19650**  
El sistema refleja el cumplimiento del estándar en el propio estado del proyecto: si **no** hay un **BEP (BIM Execution Plan)** vinculado, el proyecto queda marcado como **INCOMPLETO** hasta completar ese requisito.

**Hitos de entrega**  
Seguimiento explícito de fases desde **Diseño esquemático (SD)** y **Desarrollo de diseño (DD)** hasta **Documentación de construcción (CD)**, **licitación** y **As-Built**, con fechas de control en el ciclo del proyecto.

**Complementos de gobierno**  
Código de proyecto alineado con buenas prácticas de nomenclatura, **disciplinas involucradas** (Arquitectura, Estructura, MEP, Paisajismo, Seguridad, Telecomunicaciones) y relación clara proyecto–cliente.

---

## 2. Ecosistema de información técnica (CDE)

**Requisitos de cliente**  
En el alta de empresas, la plataforma exige la gestión documental de **OIR**, **AIR** y **EIR**, de modo que los requisitos de información organizacional, del activo y del intercambio queden registrados desde el origen.

**Visor IFC**  
Visualización de **modelos BIM** en formato IFC **dentro de la aplicación**, para que modeladores y coordinadores revisen geometría y federación sin saltar a otro entorno en cada iteración.

**Gestión de tareas**  
Módulo de **asignación y seguimiento** ligado a proyectos, con enfoque por **disciplinas** y estados de avance: útil para repartir trabajo entre modeladores, validar entregables y dar visibilidad al BIM manager y al equipo de obra.

**Documentación y adjuntos**  
Clasificación de documentación técnica (incluido BEP y otros PDF relevantes) y **adjuntos generales** (por ejemplo PDF, DWG, IFC) con versionado y descarga controlada según permisos.

---

## 3. Comunicación e innovación

**Chat integrado**  
Mensajería en **tiempo real** con canales y conversaciones alineadas al trabajo colaborativo: coordinación entre disciplinas, avisos al BIM manager y seguimiento con el cliente, con filtros y preferencias de notificación por proyecto y canal.

**Notificaciones nativas**  
**Alertas de escritorio en Windows** (mediante Service Worker) para **chat** y **carga de archivos**, de forma que el equipo reciba avisos aunque la ventana del navegador no esté al frente: menos fricción, mayor continuidad operativa.

**Comunicaciones y directorio**  
Apoyo a coordinación entre usuarios y equipos dentro del mismo entorno digital del proyecto.

---

## 4. Auditoría y seguridad avanzada

**Trazabilidad total (soft delete)**  
Los archivos eliminados no desaparecen sin dejar rastro: pasan a una **papelera de auditoría** con registro de **usuario**, **fecha y hora**, **tamaño** y **extensión**, además del contexto del proyecto o documento de empresa cuando aplica.

**Protección de datos**  
**Acceso basado en roles (RBAC)** y compartición explícita de recursos. Las operaciones de **borrado definitivo** o vaciado de papelera exigen **Validación de PIN de Seguridad** y privilegios de administración, reduciendo errores y usos indebidos.

**Panel y cumplimiento**  
Herramientas de configuración y resumen que refuerzan la visibilidad del estado de proyectos, clientes y políticas de notificación.

---

## Mensaje único para LinkedIn (sugerencia)

*En AEC, modeladores, coordinadores y BIM managers necesitan un solo lugar donde gobierno ISO 19650, CDE, tareas, IFC y chat convivan — BIM.OS lo concentra, con alertas nativas para que dirección de proyecto y obra también entren al ritmo del dato, sin quedar restringido solo al núcleo BIM.*

---

## Uso de este documento

Es la **fuente de verdad narrativa** para marketing y producto. Para comportamiento exacto en código o políticas internas de despliegue, contrastar siempre con el repositorio y la configuración del entorno. **No incluir PINs, claves ni datos personales** en copias públicas.
