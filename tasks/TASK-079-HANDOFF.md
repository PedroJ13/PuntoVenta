# TASK-079 - Handoff

Equipo:
Ejecucion Tecnica

Modo de ejecucion:
SQL DEV/Data

Tarea completada:
TASK-079 - Preparar plan de carga inicial de datos reales

Archivos cambiados:
- `docs/INITIAL_REAL_DATA_LOAD_PLAN.md`
- `docs/ESTADO_OPERATIVO.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/CURRENT_BLOCKERS.md`
- `docs/TASK_BOARD.md`
- `tasks/TASK-079.md`
- `tasks/TASK-079-HANDOFF.md`

Verificacion ejecutada:
- Lectura de `AGENTS.md`, `chat-start/EJECUCION_TECNICA.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/TASK_BOARD.md`.
- Lectura de `tasks/TASK-079.md`.
- Lectura de `docs/ESTADO_OPERATIVO.md`, `docs/CURRENT_BLOCKERS.md`, `docs/DATA_MODEL.md`, `docs/CLOUD_PERSISTENCE_DECISION_PLAN.md`, `docs/AZURE_SQL_MIGRATION_REVIEW_PACKAGE.md`.
- Lectura de `tasks/TASK-075-HANDOFF.md`, `tasks/TASK-076-HANDOFF.md`, `tasks/TASK-078-HANDOFF.md`.
- Revision documental local; no se ejecuto Azure SQL, no se consulto la base y no se modificaron recursos cloud.

Resultado:
Plan seguro de carga inicial de datos reales preparado y documentado en `docs/INITIAL_REAL_DATA_LOAD_PLAN.md`.

Resumen del plan:
- Recomienda crear un tenant real separado del demo, no mezclar datos reales con `PV-DEMO-LOCAL`.
- Define datos obligatorios:
  - empresa/tenant;
  - roles;
  - usuarios sin passwords/PINs;
  - terminal;
  - categorias;
  - articulos/materiales;
  - recetas e ingredientes si aplica.
- Define datos opcionales:
  - clientes solo si son estrictamente necesarios;
  - proveedores solo si se usaran compras/inventario inicial;
  - plan de apertura de caja, sin abrir caja por SQL directo.
- Define formato recomendado:
  - `.xlsx` o carpeta `.csv`;
  - hojas/tablas: `company`, `roles`, `users`, `terminals`, `categories`, `items`, `recipes`, `recipe_ingredients`, `customers_optional`, `suppliers_optional`, `opening_cash_plan`.
- Define checklist de validacion previa:
  - no secretos;
  - no passwords/PINs planos;
  - no datos personales innecesarios;
  - unicidad por tenant;
  - referencias entre hojas;
  - montos CRC enteros;
  - unidades e inventario consistentes.
- Define rollback/mitigacion:
  - mantener API apuntando al tenant demo hasta validar carga real;
  - usar correcciones revisables, no `DROP`, `TRUNCATE` ni borrados masivos;
  - cambiar tenant runtime solo en tarea posterior aprobada.

Estrategia para datos demo existentes:
Mantener el tenant demo aislado por ahora. Crear tenant real nuevo y validar la carga sin borrar demo. La limpieza o desactivacion del demo debe quedar para una tarea explicita posterior.

Uso DB cloud:
No.
Motivo: tarea documental de planificacion SQL/Data.
Alcance: lectura de docs/handoffs y creacion del plan; no se conecto a Azure SQL, no se ejecutaron consultas, no se cargaron datos reales.

Riesgos o pendientes:
- La API publicada resuelve tenant por `PV_SQLSERVER_COMPANY_TAX_ID`; despues de cargar tenant real se requiere tarea Backend/API o Infra para cambiar runtime y smoke.
- Si se cargan clientes/proveedores reales, hay riesgo de datos personales innecesarios; el plan recomienda minimizarlos.
- La base pilot contiene datos demo y ventas de smoke; no borrar ni mezclar sin decision explicita.
- Se requiere fuente de datos real aprobada por Proyecto/PO antes de cualquier script de carga.

Siguiente recomendado:
Proyecto procesa este handoff. Si acepta el plan, crear la siguiente tarea SQL DEV/Data para preparar plantilla de carga inicial real en XLSX/CSV y checklist de validacion, todavia sin ejecutar carga.
