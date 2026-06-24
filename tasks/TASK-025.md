# TASK-025 - QA validar vista Web de reportes MVP local

## Estado

Hecha

## Equipo responsable

Equipo/chat: QA
Prioridad: P1 pre-lanzamiento

## Contexto

`TASK-024` creo la vista Web de reportes MVP local. QA debe validar visualmente que la vista muestre reportes principales y maneje el fallback cuando la API local no responde.

## Objetivo

Validar la vista Web de reportes MVP local en la app base.

## Alcance

- Levantar app local.
- Validar vista `Reportes`.
- Validar resumen de ventas, productos/top items, caja y stock bajo minimo.
- Validar boton `Actualizar`.
- Validar estado/fallback si API local no esta disponible.
- Reportar hallazgos por severidad.

## Fuera de alcance

- No corregir codigo.
- No validar Azure SQL.
- No validar deploy.
- No validar persistencia real.
- No crear reportes nuevos.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/TASK_BOARD.md`
- `tasks/TASK-024-HANDOFF.md`
- `tasks/TASK-023-HANDOFF.md`
- `app/README.md`
- `api/README.md`

## Dependencia

- Liberada por `TASK-024`.

## Criterios de aceptacion

- [x] QA valida visualmente la vista de reportes.
- [x] Casos principales tienen resultado claro.
- [x] Fallback sin API queda validado o reportado.
- [x] El handoff indica `Uso Azure SQL: No`.
- [x] Si hay fallos, se reporta severidad y reproduccion.

## Verificacion esperada

- App local abierta en navegador o verificacion equivalente.
- API local levantada si se valida consumo real.
- Evidencia textual por caso.

## Handoff esperado

Crear o actualizar `tasks/TASK-025-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
