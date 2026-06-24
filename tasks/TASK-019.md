# TASK-019 - QA integracion app y API local

## Estado

Hecha

## Equipo responsable

Equipo/chat: QA
Prioridad: MVP bloqueante

## Contexto

Cuando la app base consuma la API local fake, QA debe validar que el flujo completo siga funcionando desde UI hasta API sin backend real ni Azure SQL.

## Objetivo

Ejecutar QA de integracion local app + API para caja, cuentas abiertas, checkout y ticket.

## Alcance

- Levantar app local y API local.
- Validar catalogo desde API.
- Validar cuentas abiertas desde UI/API.
- Validar checkout fake.
- Validar ticket desde payload API.
- Reportar hallazgos por severidad.

## Fuera de alcance

- No corregir codigo.
- No validar Azure.
- No validar SQL real.
- No validar deploy.
- No validar datos reales.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/TASK_BOARD.md`
- `docs/QA_CHECKLIST_FLUJO_CAJA.md`
- `docs/API_CONTRACTS.md`
- `tasks/TASK-018-HANDOFF.md`
- `tasks/TASK-008-HANDOFF.md`

## Dependencia

- Depende de `TASK-018`.

## Criterios de aceptacion

- [x] QA ejecuta flujo integrado app + API local.
- [x] Casos principales tienen resultado claro.
- [x] Hallazgos tienen severidad.
- [x] Queda recomendacion de avanzar, corregir o bloquear.
- [x] El handoff indica que no se uso Azure SQL.

## Verificacion esperada

- Evidencia textual por caso.
- URL local de app y API usada.
- Confirmar `Uso Azure SQL: No`.

## Handoff esperado

Crear o actualizar `tasks/TASK-019-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
