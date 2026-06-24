# TASK-004 - Handoff

Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Tarea completada: Definir contrato API MVP.

Archivos cambiados:

- `docs/API_CONTRACTS.md`
- `docs/TASK_BOARD.md`
- `tasks/TASK-004.md`
- `tasks/TASK-004-HANDOFF.md`

Verificacion ejecutada:

- Revision documental de `TASK-004`, `docs/DATA_MODEL.md`, `tasks/TASK-002-HANDOFF.md`, `docs/ARCHITECTURE.md` y guia Azure Functions.
- Revision de cobertura contra modulos MVP: catalogo, insumos, recetas, cuentas abiertas, ventas, pagos, tickets, compras, inventario, caja/turnos y reportes.
- Busqueda local de patrones de secreto en `docs/API_CONTRACTS.md` y este handoff.
- No se creo carpeta `api/`, no se implementaron endpoints, no se conecto Azure SQL y no se crearon recursos Azure.

Resultado:

- Contrato API MVP documentado en `docs/API_CONTRACTS.md`.
- Se definieron convenciones globales de respuesta, errores y validaciones server-side.
- Se documentaron payloads y respuestas principales para checkout, ticket, cuentas abiertas, compras, ajustes, turnos y reportes.
- El contrato respeta el modelo de `TASK-002`: cuentas abiertas no descuentan inventario, venta cobrada es transaccional, preparados descuentan receta y todo debe filtrar por empresa actual.

Uso DB cloud: No
Uso Azure SQL: No
Motivo: tarea documental de contrato API; persistencia real y migraciones estan fuera de alcance.
Recursos Azure creados: No
Endpoints implementados: No
Secretos creados o expuestos: No

Riesgos o pendientes:

- Autenticacion completa queda pendiente de decision.
- Reversa exacta de inventario/caja al anular ventas o compras debe definirse en implementacion Backend.
- Cuando se implemente `api/`, se deben crear tests unitarios y dobles de repositorio antes de usar Azure SQL.

Siguiente recomendado:

- Proyecto procesa este handoff.
- Crear tarea Backend/API separada para scaffold de `api/` y tests locales.
- Crear tarea de migracion Azure SQL solo cuando Proyecto autorice aplicar schema.

Movimiento de tablero:

- De: Ready/Assigned
- A: Needs Review
