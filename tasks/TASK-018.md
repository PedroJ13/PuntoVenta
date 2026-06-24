# TASK-018 - Conectar app base a API local fake

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Prioridad: MVP bloqueante

## Contexto

La app base funciona con datos locales en memoria. Cuando los endpoints fake de cuentas abiertas, checkout y ticket esten listos, la UI debe poder consumir la API local sin tocar Azure ni persistencia real.

## Objetivo

Conectar el flujo de caja de `app/` a la API local fake para catalogo, cuentas abiertas, checkout y ticket.

## Alcance

- Crear capa cliente/API en frontend.
- Consumir catalogo desde API local si esta disponible.
- Consumir cuentas abiertas desde API local fake.
- Ejecutar checkout contra API local fake.
- Mostrar ticket usando payload de API local fake.
- Mantener fallback o modo local si Proyecto lo considera necesario.
- Documentar como levantar app y API juntas.

## Fuera de alcance

- No conectar Azure SQL.
- No publicar deploy.
- No crear recursos Azure.
- No implementar auth real.
- No persistir datos reales.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/TASK_BOARD.md`
- `docs/API_CONTRACTS.md`
- `docs/TICKET_FORMAT_MVP.md`
- `app/`
- `api/README.md`
- `tasks/TASK-015-HANDOFF.md`
- `tasks/TASK-016-HANDOFF.md`
- `tasks/TASK-017-HANDOFF.md`

## Dependencia

- Depende de `TASK-015`, `TASK-016` y `TASK-017`.

## Criterios de aceptacion

- [x] La app puede operar caja contra API local fake.
- [x] Catalogo/cuentas/checkout/ticket usan endpoints locales donde corresponda.
- [x] El flujo sigue funcionando sin Azure SQL.
- [x] Hay verificacion local documentada.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Levantar API local y app local.
- Probar flujo de caja con cuenta, checkout y ticket.
- Confirmar que no se crearon recursos Azure.

## Handoff esperado

Crear o actualizar `tasks/TASK-018-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
