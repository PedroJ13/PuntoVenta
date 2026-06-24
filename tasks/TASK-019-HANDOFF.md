# TASK-019 - Handoff

Nombre del equipo/chat: QA
Modo: QA
Nombre de la tarea: QA integracion app y API local
Archivo de tarea: `tasks/TASK-019.md`

## Resultado

Status: aprobada

Se ejecuto QA de integracion local app + API fake para catalogo, cuentas abiertas, lineas, checkout y ticket.

Resultado general: aprobado con observaciones. No hay P0/P1 abiertos para el alcance local fake.

## Ambiente

- Fecha: 2026-06-21
- App local: `http://127.0.0.1:5173/`
- API local usada: `http://127.0.0.1:7071`
- App: `app/index.html`
- API: `api/src/server.js` / app API creada desde `api/src/app.js`
- DB cloud: No
- Uso Azure SQL: No
- Recursos Azure creados: No

Nota operativa:

- `TASK-018` tenia handoff disponible, aunque seguia en `Needs Review` en tablero. QA ejecuto `TASK-019` por instruccion directa del usuario.

## Archivos cambiados

- `docs/TASK_BOARD.md`
- `tasks/TASK-019.md`
- `tasks/TASK-019-HANDOFF.md`

## Verificacion ejecutada

- Lectura de `tasks/TASK-019.md`.
- Lectura de `docs/QA_CHECKLIST_FLUJO_CAJA.md`.
- Lectura de `docs/API_CONTRACTS.md`.
- Lectura de `tasks/TASK-018-HANDOFF.md`.
- Lectura de `tasks/TASK-008-HANDOFF.md`.
- `node --test` desde `api/`: 19 tests pasan.
- HTTP app local `/`: 200.
- HTTP app local `/src/apiClient.js`: 200.
- Integracion app/API por `fetch` real contra `127.0.0.1:7071`.
- CORS preflight local: 204.
- Busqueda local de secretos/SQL en `app/` y `api/`.

## Resultado por caso

| ID | Resultado | Evidencia / nota |
| --- | --- | --- |
| INT-001 | Pasa | `GET /api/health` responde 200 con storage fake. |
| INT-002 | Pasa | CORS preflight local responde 204. |
| INT-003 | Pasa | `GET /api/categories?active=true` devuelve 3 categorias activas. |
| INT-004 | Pasa | `GET /api/items?active=true` devuelve catalogo activo e incluye Capuchino. |
| INT-005 | Pasa | La app carga estado inicial desde API: `state.api.connected=true`. |
| INT-006 | Pasa | Crear cuenta desde app usa API y devuelve cuenta con `apiId`. |
| INT-007 | Pasa | Renombrar cuenta desde app usa PATCH API y conserva cuenta activa. |
| INT-008 | Pasa | Agregar lineas desde app/API acumula cantidades correctamente. |
| INT-009 | Pasa | Cambiar cantidad desde app/API actualiza linea correctamente. |
| INT-010 | Pasa | Bajar cantidad a cero elimina linea via API. |
| INT-011 | Pasa con observacion | Totales API correctos funcionalmente, pero CRC vuelve con decimales: subtotal 1850, tax 240.5, total 2090.5. |
| INT-012 | Pasa | Checkout + ticket via API genera `PV-0001001` y pago `transfer` para SINPE. |
| INT-013 | Pasa con observacion | Ticket API devuelve `totalAmount=2090.5`, monto decimal en CRC. |
| INT-014 | Pasa | App guarda `lastTicket` desde payload API. |
| INT-015 | Pasa | Cuenta cobrada deja de aparecer en cuentas abiertas tras recarga. |
| INT-016 | Pasa | Checkout invalido responde error controlado `NOT_FOUND`. |

## Hallazgos

### P0/P1

- Ninguno.

### P2/P3

- P2: API fake devuelve montos CRC con decimales en totales/ticket (`tax=240.5`, `total=2090.5`). La UI puede redondear al mostrar, pero el payload API deberia mantener montos de CRC como enteros para evitar diferencias de caja/ticket cuando avance el MVP.

## Riesgos o pendientes

- `TASK-018` aun aparecia en `Needs Review`; Proyecto debe procesarlo formalmente.
- CORS `*` es aceptable solo para API local fake; debe acotarse antes de ambiente publicado.
- La API fake reinicia datos en memoria al reiniciar proceso.
- No se valido Azure, SQL real, deploy ni persistencia real.
- La prueba de integracion fue local y controlada por scripts HTTP/modulos; no corrige codigo.

## Recomendacion QA

Avanzar con observacion:

- La integracion local app/API queda funcional para caja, cuentas abiertas, checkout y ticket.
- Corregir en una tarea corta el redondeo/precision de montos CRC en API fake antes de usar estos payloads como referencia contractual de caja.
- Proyecto puede procesar `TASK-019` y decidir si abre un fix P2 para montos.

## Movimiento de tablero

- De: Blocked / In Progress
- A: Needs Review

