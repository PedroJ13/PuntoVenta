# TASK-016 - Checkout local fake con pagos e inventario simulado

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Prioridad: MVP bloqueante

## Contexto

El flujo central del MVP es cobrar una cuenta o venta rapida. Antes de persistencia real, se necesita un checkout local fake que valide totales, pagos y movimientos simulados para poder integrar y probar el flujo.

## Objetivo

Implementar `POST /api/sales/checkout` local con repositorios fake y tests, sin Azure SQL.

## Alcance

- Implementar checkout desde cuenta abierta fake.
- Implementar checkout de venta rapida con lineas en payload.
- Validar turno/caja fake segun contrato minimo.
- Validar pagos y totales.
- Generar `saleId`, `ticketNumber` y estado `paid` fake.
- Simular descuento de inventario segun tipo de articulo de forma local/fake.
- Agregar tests para checkout exitoso, pagos incorrectos, stock insuficiente simulado y cuenta invalida.

## Fuera de alcance

- No persistir ventas reales.
- No conectar Azure SQL.
- No aplicar migraciones.
- No implementar anulacion real.
- No implementar reportes.
- No crear recursos Azure.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/TASK_BOARD.md`
- `docs/API_CONTRACTS.md`
- `docs/DATA_MODEL.md`
- `docs/AUTH_PERMISSIONS.md`
- `api/README.md`
- `tasks/TASK-004-HANDOFF.md`
- `tasks/TASK-011-HANDOFF.md`
- `tasks/TASK-015-HANDOFF.md` si existe

## Dependencia

- Depende de `TASK-011`.
- Recomendado despues de `TASK-015` si se usara cuenta abierta fake.

## Criterios de aceptacion

- [x] Existe checkout local fake.
- [x] El checkout valida pagos y totales.
- [x] El checkout genera ticket interno fake.
- [x] Hay tests de casos felices y errores principales.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Ejecutar tests locales de `api/`.
- Buscar patrones de secretos en archivos cambiados.
- Confirmar que no se crearon recursos Azure.

## Handoff esperado

Crear o actualizar `tasks/TASK-016-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
