# TASK-020 - Corregir montos CRC enteros en API fake

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Prioridad: P1 pre-lanzamiento

## Contexto

`TASK-019` aprobo la integracion app/API local, pero reporto una observacion P2: la API fake devuelve montos CRC con decimales en checkout/ticket, por ejemplo `tax=240.5` y `total=2090.5`. Para caja y tickets, CRC debe manejarse como montos enteros.

## Objetivo

Corregir calculos monetarios de la API fake para que los montos CRC devueltos en checkout, cuentas y tickets sean enteros consistentes.

## Alcance

- Revisar calculo de subtotal, descuento, impuesto, total y pagos en API fake.
- Redondear o normalizar montos CRC a enteros de forma consistente.
- Ajustar tests de checkout/ticket para cubrir montos enteros.
- Confirmar que la app sigue mostrando montos coherentes.
- Documentar cualquier regla de redondeo aplicada.

## Fuera de alcance

- No conectar Azure SQL.
- No implementar impuestos fiscales avanzados.
- No cambiar moneda.
- No crear recursos Azure.
- No implementar persistencia real.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/TASK_BOARD.md`
- `docs/API_CONTRACTS.md`
- `tasks/TASK-016-HANDOFF.md`
- `tasks/TASK-017-HANDOFF.md`
- `tasks/TASK-019-HANDOFF.md`
- `api/README.md`

## Dependencia

- Liberada por `TASK-019`.

## Criterios de aceptacion

- [x] Checkout fake devuelve montos CRC enteros.
- [x] Ticket fake devuelve montos CRC enteros.
- [x] Tests cubren la regla de redondeo/normalizacion.
- [x] No hay dependencia de Azure SQL ni secretos reales.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Ejecutar tests locales de `api/`.
- Buscar patrones de secretos en archivos cambiados.
- Confirmar que no se crearon recursos Azure.

## Handoff esperado

Crear o actualizar `tasks/TASK-020-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
