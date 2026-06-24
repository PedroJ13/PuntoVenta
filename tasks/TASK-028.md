# TASK-028 - Implementar API fake de caja diaria

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Prioridad: MVP bloqueante

## Contexto

`TASK-026` definio el flujo operativo de caja diaria para apertura, movimientos manuales, cierre, arqueo, diferencias y resumen por metodo de pago. La API local sigue usando datos fake/en memoria y aun no debe conectarse a SQL Server local ni Azure SQL.

## Objetivo

Implementar endpoints locales fake de gestion operativa de caja diaria con tests, respetando el flujo documentado en `docs/CASH_DAILY_FLOW_MVP.md`.

## Alcance

- Agregar endpoints locales para consultar estado/resumen de caja diaria.
- Agregar apertura de caja con monto inicial.
- Agregar movimientos manuales: ingreso, egreso y ajuste.
- Agregar cierre de caja con arqueo y diferencia.
- Bloquear cobros cuando no exista caja abierta, si aplica al checkout local.
- Mantener montos CRC enteros.
- Mantener resolucion de empresa/tenant server-side desde auth fake.
- Agregar tests unitarios o de endpoint para casos principales y errores.

## Fuera de alcance

- No conectar SQL Server local.
- No crear migraciones.
- No modificar UI Web.
- No crear recursos Azure.
- No conectar Azure SQL.
- No implementar permisos reales fuera del fake local existente.
- No implementar cierre contable avanzado.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/TASK_BOARD.md`
- `docs/API_CONTRACTS.md`
- `docs/CASH_DAILY_FLOW_MVP.md`
- `tasks/TASK-026-HANDOFF.md`
- `tasks/TASK-016-HANDOFF.md`
- `tasks/TASK-022-HANDOFF.md`
- `api/README.md`

## Dependencia

- Liberada por `TASK-026`.

## Criterios de aceptacion

- [x] Existen endpoints fake de estado/resumen de caja diaria.
- [x] Existe endpoint o accion fake para abrir caja.
- [x] Existen movimientos manuales fake con validaciones minimas.
- [x] Existe cierre fake con efectivo contado, diferencia y nota cuando aplique.
- [x] Checkout local bloquea cobro sin caja abierta o documenta claramente la limitacion si se deja fallback.
- [x] Hay tests para apertura, movimientos, cierre y errores principales.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Ejecutar tests locales de `api/`.
- Revisar que no haya connection strings ni secretos reales.
- Confirmar que no se conecto SQL Server local.
- Confirmar que no se crearon recursos Azure.

## Handoff esperado

Crear o actualizar `tasks/TASK-028-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
