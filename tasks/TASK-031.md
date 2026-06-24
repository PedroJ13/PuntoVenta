# TASK-031 - QA validar gestion operativa de caja diaria

## Estado

Hecha

## Equipo responsable

Equipo/chat: QA
Prioridad: MVP bloqueante

## Contexto

`TASK-028` implemento API fake de caja diaria y `TASK-030` creo la UI local. El handoff de `TASK-030` indica que la validacion funcional por modulos paso, pero quedo pendiente validacion visual/browser real por comportamiento del servidor estatico en esa sesion.

## Objetivo

Validar de punta a punta el flujo local de gestion operativa de caja diaria desde la app Web contra la API fake local.

## Alcance

- Levantar API local fake y app local.
- Validar vista `Caja diaria`.
- Validar apertura de caja con monto inicial.
- Validar resumen de caja abierta.
- Validar movimientos manuales: ingreso, egreso y ajuste.
- Validar cierre de caja con efectivo contado, diferencia y nota cuando aplique.
- Validar bloqueo de checkout cuando no hay caja abierta.
- Validar cierre bloqueado si existen cuentas abiertas pendientes.
- Validar fallback o mensaje claro cuando API local no responde.
- Reportar hallazgos por severidad.

## Fuera de alcance

- No corregir codigo.
- No conectar SQL Server local.
- No ejecutar migraciones.
- No crear recursos Azure.
- No conectar Azure SQL.
- No validar persistencia real.
- No hacer PO Test formal.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/TASK_BOARD.md`
- `docs/CASH_DAILY_FLOW_MVP.md`
- `tasks/TASK-026-HANDOFF.md`
- `tasks/TASK-028-HANDOFF.md`
- `tasks/TASK-030-HANDOFF.md`
- `app/README.md`
- `api/README.md`

## Dependencia

- Liberada por `TASK-030`.

## Criterios de aceptacion

- [x] QA valida visualmente la vista de caja diaria.
- [x] QA valida apertura, movimientos y cierre.
- [x] QA valida bloqueo de checkout sin caja abierta.
- [x] QA valida fallback o error claro sin API.
- [x] Los hallazgos quedan clasificados por severidad.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- App local abierta en navegador o verificacion equivalente si browser no esta disponible.
- API local levantada para validar consumo real.
- Evidencia textual por caso probado.
- Confirmar que no se conecto SQL Server local.
- Confirmar que no se crearon recursos Azure.

## Handoff esperado

Crear o actualizar `tasks/TASK-031-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
