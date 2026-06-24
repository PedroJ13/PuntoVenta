# TASK-026 - Definir flujo operativo de caja diaria

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Diseno/UX
Prioridad: MVP bloqueante

## Contexto

El MVP ya tiene caja rapida, cuentas abiertas, checkout, ticket y reportes locales. Falta definir el flujo operativo de caja diaria para que el sistema pueda modelar un turno real: apertura, movimientos, cierre, arqueo, diferencias y resumen por metodo de pago.

## Objetivo

Definir el flujo funcional y UX minimo de gestion operativa de caja diaria para el MVP local.

## Alcance

- Definir estados de caja: sin abrir, abierta y cerrada.
- Definir datos minimos de apertura de caja.
- Definir movimientos manuales: ingreso, egreso y ajuste.
- Definir datos minimos de cierre de caja.
- Definir reglas de arqueo y diferencias.
- Definir resumen por metodo de pago.
- Definir mensajes, errores y confirmaciones principales.
- Documentar casos borde que Backend/API y Web Dev deban respetar.

## Fuera de alcance

- No implementar codigo.
- No modificar API.
- No modificar base de datos.
- No conectar SQL Server local.
- No conectar Azure SQL.
- No crear recursos Azure.
- No hacer QA de implementacion.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/TASK_BOARD.md`
- `docs/DEFINICION_PROYECTO.md`
- `docs/API_CONTRACTS.md`
- `tasks/TASK-016-HANDOFF.md`
- `tasks/TASK-022-HANDOFF.md`
- `tasks/TASK-025-HANDOFF.md`

## Dependencia

- Sin dependencias pendientes.

## Criterios de aceptacion

- [x] Queda documentado el flujo de apertura de caja.
- [x] Queda documentado el flujo de movimientos manuales.
- [x] Queda documentado el flujo de cierre y arqueo.
- [x] Quedan definidas reglas de diferencia de caja.
- [x] Quedan definidos mensajes/errores minimos.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Validar que el documento resultante permita crear tareas separadas de Backend/API, Web Dev y QA.
- Confirmar que no se implemento codigo.
- Confirmar que no se crearon recursos Azure.

## Handoff esperado

Crear o actualizar `tasks/TASK-026-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
