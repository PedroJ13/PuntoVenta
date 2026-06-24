# TASK-043 - QA validar integracion SQL local MVP

## Estado

Blocked

## Equipo responsable

Equipo/chat: QA
Prioridad: P1 pre-lanzamiento

## Contexto

`TASK-038` a `TASK-042` dejaron conectado y documentado el camino SQL Server Express local para ventas/checkout, reportes, Web local y paquete tecnico de QA. Falta validacion formal de QA sobre el flujo integrado local antes de considerar esta fase lista.

## Objetivo

Validar la integracion SQL local del MVP usando el paquete tecnico y smoke documentado, separando resultado local, limitaciones y riesgos.

## Alcance

- Validar setup local segun `docs/QA_SQL_LOCAL_TECH_PACKAGE.md`.
- Validar smoke de `docs/SMOKE_LOCAL_APP_API_SQL.md`.
- Validar health y `storageDetails` para catalogo, cuentas abiertas, caja diaria, ventas y reportes.
- Validar flujo caja diaria abierta -> venta rapida -> ticket -> reportes.
- Validar flujo cuenta abierta -> cobro -> cierre -> ticket -> reportes.
- Validar mensajes/estados Web principales contra API local.
- Registrar hallazgos por severidad P0/P1/P2/P3.

## Fuera de alcance

- No corregir codigo.
- No crear recursos Azure.
- No conectar Azure SQL.
- No hacer deploy.
- No guardar passwords, connection strings ni secretos.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/TASK_BOARD.md`
- `docs/QA_SQL_LOCAL_TECH_PACKAGE.md`
- `docs/SMOKE_LOCAL_APP_API_SQL.md`
- `docs/API_CONTRACTS.md`
- `docs/QA_CHECKLIST_FLUJO_CAJA.md`
- `tasks/TASK-038-HANDOFF.md`
- `tasks/TASK-039-HANDOFF.md`
- `tasks/TASK-040-HANDOFF.md`
- `tasks/TASK-041-HANDOFF.md`
- `tasks/TASK-042-HANDOFF.md`

## Dependencia

- Liberada por `TASK-042`.

## Criterios de aceptacion

- [x] QA valida o reporta bloqueo claro para setup SQL local.
- [ ] QA valida health/storage SQL local sin secretos.
- [ ] QA valida caja diaria, venta rapida, cuenta abierta, ticket y reportes.
- [ ] QA valida estados/mensajes Web principales.
- [x] QA documenta hallazgos por severidad.
- [x] QA confirma `Uso Azure SQL: No`.
- [x] QA crea handoff con veredicto claro: aprobado, aprobado con observaciones o rechazado.

## Verificacion esperada

- Ejecutar smoke local si el ambiente lo permite.
- Ejecutar pruebas API si aplica.
- Usar navegador/app local si esta disponible.
- No exponer secretos ni datos reales.

## Handoff esperado

Crear o actualizar `tasks/TASK-043-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
