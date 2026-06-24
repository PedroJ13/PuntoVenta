# TASK-023 - Handoff

Nombre del equipo/chat: QA
Modo: QA
Nombre de la tarea: QA validar reportes MVP API local
Archivo de tarea: `tasks/TASK-023.md`

## Resultado

Status: aprobada

Se validaron los reportes MVP locales de ventas, productos, caja y stock bajo minimo contra la API fake.

Resultado general: aprobado. No hay P0/P1 abiertos.

## Ambiente

- Fecha: 2026-06-21
- API local: `http://127.0.0.1:7071`
- Runtime: Node local del workspace
- Datos: fake en memoria
- Uso DB cloud: No
- Uso Azure SQL: No
- Recursos Azure creados: No

## Archivos cambiados

- `docs/TASK_BOARD.md`
- `tasks/TASK-023.md`
- `tasks/TASK-023-HANDOFF.md`

## Verificacion ejecutada

- Lectura de `tasks/TASK-023.md`.
- Lectura de `tasks/TASK-022-HANDOFF.md`.
- Lectura de `docs/API_CONTRACTS.md`.
- Lectura de `api/README.md`.
- `node --test` desde `api/`: 25 tests pasan.
- Pruebas HTTP locales con servidor API fake embebido en `127.0.0.1:7071`.
- Busqueda local de secretos/SQL en `api/`.
- Verificacion de que no quedaron listeners activos en `7071` ni `5173`.

## Resultado por caso

| ID | Resultado | Evidencia / nota |
| --- | --- | --- |
| REP-000 | Pasa | `GET /api/health` responde 200 con `storage=fake`. |
| REP-001 | Pasa | Se crearon dos ventas fake para alimentar reportes: `PV-0001001` total `2091` y `PV-0001002` total `3616`. |
| REP-002 | Pasa | `GET /api/reports/sales-summary` devuelve `salesCount=2`, subtotal `5050`, impuesto `657`, total `5707`. |
| REP-003 | Pasa | `GET /api/reports/sales-by-item` agrupa por articulo: Capuchino qty `1` total `2091`, Croissant qty `2` total `3616`. |
| REP-004 | Pasa | `GET /api/reports/top-items?limit=1` devuelve Croissant como top item con qty `2`. |
| REP-005 | Pasa | `GET /api/reports/low-stock` devuelve Croissant bajo minimo: stock `16`, minimo `20`, faltante `4`. |
| REP-006 | Pasa | `GET /api/reports/cash-shift/5` devuelve caja fake: ventas `2`, total `5707`, esperado efectivo `30707`. |
| REP-007 | Pasa | Usuario `cashier` sin `reports.read` recibe `403 FORBIDDEN`. |
| REP-008 | Pasa | Usuario `none` recibe `401 UNAUTHORIZED`. |
| REP-009 | Pasa | Fecha invalida en `from` devuelve `400 VALIDATION_ERROR`. |

## Hallazgos

### P0/P1

- Ninguno.

### P2/P3

- Ninguno bloqueante.
- Observacion P3: los reportes dependen de ventas creadas durante la vida del proceso local fake; reiniciar el proceso borra los datos, como ya indica `api/README.md`.

## Riesgos o pendientes

- Validacion local fake solamente; no cubre Azure SQL, deploy ni persistencia real.
- `cash-shift` fake no incluye conteo real capturado por usuario ni cierre definitivo; fuera del alcance actual.
- CORS/seguridad productiva no se valida en esta tarea.

## Recomendacion QA

Avanzar:

- Proyecto puede procesar `TASK-023` y moverla a `Done`.
- Los reportes MVP locales quedan aptos para seguir con tareas de UI o refinamiento posterior, manteniendo claro que son datos fake en memoria.

## Movimiento de tablero

- De: In Progress
- A: Needs Review

