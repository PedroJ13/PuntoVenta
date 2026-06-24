# TASK-008 - Ejecutar QA manual del flujo de caja

## Estado

Hecha

## Equipo responsable

Equipo/chat: QA
Prioridad: MVP bloqueante

## Contexto

`TASK-005` creo el checklist QA inicial y `TASK-003` creo la app base con datos falsos. Falta ejecutar validacion manual contra la app base y reportar hallazgos por severidad.

## Objetivo

Ejecutar `docs/QA_CHECKLIST_FLUJO_CAJA.md` contra `app/index.html` y entregar resultado QA del flujo de caja actual.

## Alcance

- Levantar o abrir la app base local segun indique `TASK-003-HANDOFF.md`.
- Ejecutar casos de caja rapida, cuentas abiertas, cantidades, cobro y ticket.
- Reportar resultado por caso: pasa, falla, bloqueado o no aplica.
- Clasificar hallazgos por severidad.
- Recomendar si la app base queda lista para PO Test o si requiere fixes previos.

## Fuera de alcance

- No corregir UI ni codigo.
- No implementar pruebas automatizadas.
- No validar backend real.
- No validar Azure SQL, deploy ni recursos cloud.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/TASK_BOARD.md`
- `docs/QA_CHECKLIST_FLUJO_CAJA.md`
- `docs/QA_TEST_PLAN.md`
- `tasks/TASK-003-HANDOFF.md`
- `tasks/TASK-005-HANDOFF.md`

## Dependencia

- Liberada por `TASK-003` y `TASK-005`.

## Criterios de aceptacion

- [x] El checklist se ejecuto contra la app base.
- [x] Cada caso tiene resultado claro.
- [x] Los hallazgos tienen severidad.
- [x] El handoff recomienda PO Test, fixes o bloqueo.

## Verificacion esperada

- Evidencia textual del resultado QA por caso.
- Indicar URL local o metodo usado para abrir la app.

## Handoff esperado

Crear o actualizar `tasks/TASK-008-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
