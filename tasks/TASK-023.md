# TASK-023 - QA validar reportes MVP API local

## Estado

Hecha

## Equipo responsable

Equipo/chat: QA
Prioridad: P1 pre-lanzamiento

## Contexto

`TASK-022` agrego endpoints locales fake para reportes MVP. QA debe validar que los reportes principales respondan correctamente con datos locales y respeten permisos.

## Objetivo

Validar reportes MVP locales de ventas, productos, caja y stock bajo minimo contra la API fake.

## Alcance

- Validar `GET /api/reports/sales-summary`.
- Validar `GET /api/reports/sales-by-item`.
- Validar `GET /api/reports/top-items`.
- Validar `GET /api/reports/low-stock`.
- Validar `GET /api/reports/cash-shift/{shiftId}`.
- Validar caso sin permiso `reports.read`.
- Reportar hallazgos por severidad.

## Fuera de alcance

- No corregir codigo.
- No validar Azure SQL.
- No validar deploy.
- No validar persistencia real.
- No crear reportes UI.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/TASK_BOARD.md`
- `docs/API_CONTRACTS.md`
- `tasks/TASK-022-HANDOFF.md`
- `api/README.md`

## Dependencia

- Liberada por `TASK-022`.

## Criterios de aceptacion

- [x] QA valida los endpoints de reportes MVP locales.
- [x] Casos principales tienen resultado claro.
- [x] Permisos de reportes quedan validados.
- [x] El handoff indica `Uso Azure SQL: No`.
- [x] Si hay fallos, se reporta severidad y reproduccion.

## Verificacion esperada

- Ejecutar pruebas HTTP locales o tests API relevantes.
- Documentar ambiente local usado.
- Confirmar que no se usaron recursos Azure.

## Handoff esperado

Crear o actualizar `tasks/TASK-023-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
