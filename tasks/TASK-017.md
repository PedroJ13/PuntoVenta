# TASK-017 - Endpoint local fake de ticket de venta

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Prioridad: MVP bloqueante

## Contexto

El formato de ticket ya fue definido y el dialog Web ya fue actualizado con datos falsos. Falta un endpoint local fake para que Backend/API pueda entregar el payload del ticket segun contrato.

## Objetivo

Implementar `GET /api/sales/{saleId}/ticket` local fake con payload alineado a `docs/TICKET_FORMAT_MVP.md`.

## Alcance

- Implementar ruta local fake de ticket por venta.
- Devolver negocio, estado, numero interno, fecha, caja, cajero, lineas, totales y pagos.
- Responder `NOT_FOUND` si la venta fake no existe o no pertenece al `companyId`.
- Agregar tests unitarios.
- Mantener compatibilidad con `docs/API_CONTRACTS.md`.

## Fuera de alcance

- No implementar venta persistida real.
- No conectar Azure SQL.
- No crear recursos Azure.
- No implementar impresion real.
- No implementar facturacion electronica.
- No modificar UI.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/TASK_BOARD.md`
- `docs/API_CONTRACTS.md`
- `docs/TICKET_FORMAT_MVP.md`
- `docs/AUTH_PERMISSIONS.md`
- `api/README.md`
- `tasks/TASK-010-HANDOFF.md`
- `tasks/TASK-011-HANDOFF.md`

## Dependencia

- Liberada por `TASK-010` y `TASK-011`.

## Criterios de aceptacion

- [x] Existe endpoint local fake de ticket.
- [x] El payload incluye campos obligatorios del formato MVP.
- [x] Hay tests para ticket existente y `NOT_FOUND`.
- [x] No hay dependencia de Azure SQL ni secretos reales.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Ejecutar tests locales de `api/`.
- Buscar patrones de secretos en archivos cambiados.
- Confirmar que no se crearon recursos Azure.

## Handoff esperado

Crear o actualizar `tasks/TASK-017-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
