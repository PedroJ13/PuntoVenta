# TASK-045 - QA reintentar integracion SQL local MVP

## Estado

Hecha

## Equipo responsable

Equipo/chat: QA
Prioridad: P1 pre-lanzamiento

## Contexto

`TASK-043` quedo bloqueada/no aprobada porque el smoke integrado SQL local excedio timeout y no dejo evidencia final. `TASK-044` diagnostico el bloqueo y dejo un smoke corregido con puerto configurable, logs por fase y timeout SQL configurable.

## Objetivo

Reintentar la validacion QA de la integracion SQL local MVP usando el smoke corregido y documentar un veredicto claro.

## Alcance

- Ejecutar el smoke SQL local corregido documentado por `TASK-044`.
- Usar puerto configurable, preferiblemente distinto de `7071`.
- Usar timeout externo minimo de 240s.
- Validar `storageDetails=sql-local` para catalogo, cuentas abiertas, caja diaria, ventas y reportes.
- Validar flujo caja diaria -> venta rapida -> ticket -> reportes.
- Validar flujo cuenta abierta -> cobro -> ticket -> reportes.
- Validar Web/modulos si el ambiente lo permite.
- Clasificar hallazgos por severidad P0/P1/P2/P3.

## Fuera de alcance

- No corregir codigo.
- No crear recursos Azure.
- No conectar Azure SQL.
- No hacer deploy.
- No guardar passwords, connection strings ni secretos.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/ESTADO_OPERATIVO.md`
- `docs/CURRENT_BLOCKERS.md`
- `docs/TASK_BOARD.md`
- `tasks/TASK-043-HANDOFF.md`
- `tasks/TASK-044-HANDOFF.md`
- `docs/QA_SQL_LOCAL_TECH_PACKAGE.md`
- `docs/SMOKE_LOCAL_APP_API_SQL.md`
- `docs/API_CONTRACTS.md`

## Dependencia

- Liberada por `TASK-044`.

## Criterios de aceptacion

- [x] QA ejecuta el smoke corregido o reporta bloqueo claro por ambiente.
- [x] QA valida `storageDetails=sql-local` para catalogo, cuentas, caja, ventas y reportes.
- [x] QA valida flujo venta rapida/ticket/reportes.
- [x] QA valida flujo cuenta abierta/cobro/ticket/reportes.
- [x] QA documenta hallazgos por severidad.
- [x] QA confirma `Uso Azure SQL: No`.
- [x] QA crea handoff con veredicto: aprobado, aprobado con observaciones o no aprobado.

## Verificacion esperada

Comando base sugerido desde `C:\Work\Productos Digitales\PuntoVenta`:

```powershell
$env:PV_SMOKE_API_PORT="7074"
$env:PV_SQLSERVER_QUERY_TIMEOUT_MS="45000"
node api/scripts/smoke-sql-local.js
```

Ejecutar con timeout externo minimo de 240s.

## Handoff esperado

Crear o actualizar `tasks/TASK-045-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
