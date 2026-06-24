# TASK-004 - Definir contrato API MVP

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Prioridad: MVP bloqueante

## Contexto

Antes de implementar persistencia o endpoints, el proyecto necesita contratos API claros para ventas, catalogo, inventario, recetas, caja y reportes basicos.

## Objetivo

Definir contratos API MVP para Azure Functions o API HTTP equivalente, sin implementar persistencia real todavia.

## Alcance

- Definir contratos para articulos, categorias, materia prima/insumos y recetas.
- Definir contratos para cuentas abiertas, ventas, pagos y tickets.
- Definir contratos para compras y movimientos de inventario.
- Definir contratos para caja/turnos y movimientos de caja.
- Definir contratos para reportes basicos MVP.
- Documentar payloads, respuestas, errores esperados y validaciones server-side principales.

## Fuera de alcance

- No implementar endpoints productivos.
- No conectar Azure SQL.
- No crear Azure Functions reales.
- No guardar secretos.
- No resolver autenticacion completa salvo notas de requerimiento.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/TASK_BOARD.md`
- `docs/DEFINICION_PROYECTO.md`
- `docs/DECISION_LOG.md`
- `C:\Work\azure-infra-templates\WEB_AZURE_STATIC_APPS_FUNCTIONS.md`
- `tasks/TASK-001-HANDOFF.md`
- `tasks/TASK-002-HANDOFF.md`

## Dependencia

- Liberada por `TASK-001` y `TASK-002`.

## Criterios de aceptacion

- [x] Los contratos cubren los modulos MVP necesarios.
- [x] Los errores y validaciones principales quedan documentados.
- [x] Los contratos respetan el modelo de datos definido en `TASK-002`.
- [x] No se implementa ni conecta persistencia real.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Revision documental del contrato API.
- Confirmar que no se crearon secretos ni recursos Azure.

## Handoff esperado

Crear o actualizar `tasks/TASK-004-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
