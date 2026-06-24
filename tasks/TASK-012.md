# TASK-012 - Actualizar dialog de ticket MVP

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Prioridad: MVP bloqueante

## Contexto

`TASK-010` definio el formato MVP del ticket de caja. La app base todavia debe reflejar ese formato en el dialog de ticket con datos falsos, sin backend real.

## Objetivo

Actualizar el dialog de ticket en `app/` para seguir `docs/TICKET_FORMAT_MVP.md` usando datos falsos/locales.

## Alcance

- Mostrar encabezado de ticket con negocio, estado, numero interno fake, fecha, caja y cajero fake.
- Mostrar lineas, subtotal, descuento, impuesto, total y pagos.
- Incluir texto `Comprobante interno - no es factura electronica`.
- Mantener flujo de cobro actual con datos falsos.
- Mantener reimpresion/anulacion como marcas o estados preparados si aplica, sin persistencia real.

## Fuera de alcance

- No implementar backend.
- No persistir tickets.
- No implementar impresora termica real.
- No implementar facturacion electronica.
- No conectar Azure SQL.
- No crear recursos Azure.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/TASK_BOARD.md`
- `docs/TICKET_FORMAT_MVP.md`
- `docs/API_CONTRACTS.md`
- `app/index.html`
- `app/src/ui.js`
- `tasks/TASK-003-HANDOFF.md`
- `tasks/TASK-010-HANDOFF.md`

## Dependencia

- Liberada por `TASK-003` y `TASK-010`.

## Criterios de aceptacion

- [x] El dialog de ticket sigue el orden visual MVP.
- [x] El ticket muestra subtotal, descuento, impuesto, total y pagos.
- [x] El ticket indica claramente que no es factura electronica.
- [x] No se agrega dependencia de backend ni Azure SQL.
- [x] El handoff indica como verificar el ticket localmente.

## Verificacion esperada

- Ejecutar validaciones JS disponibles.
- Abrir app local y verificar cobro/ticket.
- Confirmar `Uso Azure SQL: No`.

## Handoff esperado

Crear o actualizar `tasks/TASK-012-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
