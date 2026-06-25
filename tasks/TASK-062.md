# TASK-062 - QA publicado Web API pilot sin Azure SQL

## Estado

Hecha

## Equipo responsable

Equipo/chat: QA
Modo de ejecucion: QA
Prioridad: P1 pre-lanzamiento

## Contexto

`TASK-061` dejo exitosos los workflows pilot Web/API y valido que Web y API publicos responden `HTTP 200`. Azure SQL sigue fuera del alcance; el API publicado reporta storage fake y `sqlConfigured:false`.

## Objetivo

Validar en ambiente publicado pilot que la Web y el API MVP responden correctamente para un smoke QA funcional basico, sin Azure SQL.

## Alcance

- Validar URL Web publicada:
  - `https://gray-beach-00a0f870f.7.azurestaticapps.net/`
- Validar API health publicada:
  - `https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health`
- Confirmar que la Web publicada carga sin errores criticos visibles.
- Confirmar que la Web apunta a la API pilot publicada segun configuracion de `TASK-055`.
- Ejecutar smoke funcional basico de flujos MVP disponibles en la superficie publicada:
  - caja rapida / venta basica si esta disponible.
  - cuentas abiertas si esta disponible.
  - caja diaria si esta disponible.
  - reportes si estan disponibles.
- Registrar severidad de hallazgos P0/P1/P2/P3.
- Confirmar que Azure SQL no esta en uso y que el API reporta `sqlConfigured:false`.

## Fuera de alcance

- No cambiar codigo.
- No crear Azure SQL.
- No probar SQL local.
- No modificar secrets, Azure, GitHub Actions ni workflows.
- No hacer migracion a OIDC/RBAC.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/QA_TEST_PLAN.md`
- `docs/PILOT_DEPLOY_CONFIG.md`
- `tasks/TASK-055-HANDOFF.md`
- `tasks/TASK-061-HANDOFF.md`

## Dependencia

- Ejecutar despues de `TASK-061`.

## Criterios de aceptacion

- [x] Web publicada responde y carga.
- [x] API health publicada responde.
- [x] Smoke funcional publicado ejecutado con evidencia.
- [x] Hallazgos clasificados por severidad.
- [x] Azure SQL confirmado fuera de uso.
- [x] Veredicto claro: aprobado, aprobado con observaciones o no aprobado.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Evidencia de URLs publicas.
- Capturas o descripcion puntual de pantallas/flujos validados.
- Resumen de severidad.
- Confirmacion de storage fake / `sqlConfigured:false`.

## Handoff esperado

Crear o actualizar `tasks/TASK-062-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
