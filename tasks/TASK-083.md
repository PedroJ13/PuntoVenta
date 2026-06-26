# TASK-083 - Actualizar runbook baseline pilot con Azure SQL activo

## Estado

Done

## Nombre del Equipo

Ejecucion Tecnica

## Modo

Infra

## Nombre de la tarea

TASK-083 - Actualizar runbook baseline pilot con Azure SQL activo

## Handoff esperado

Al finalizar, debe crear o actualizar `tasks/TASK-083-HANDOFF.md` usando el formato de handoff indicado.

## Contexto

`TASK-076` dejo como P3 que `docs/PILOT_BASELINE_RUNBOOK.md` todavia describia el baseline anterior sin Azure SQL. El estado actual del pilot usa Azure SQL activo para la API segun `TASK-075`, `TASK-076` y `docs/PILOT_DEPLOY_CONFIG.md`.

## Objetivo

Actualizar el runbook de baseline pilot para que refleje Azure SQL activo, recursos, guardrails, health esperado y reglas de seguridad actuales.

## Alcance

- Actualizar `docs/PILOT_BASELINE_RUNBOOK.md`.
- Mantener valores secretos fuera del repo.
- No ejecutar cambios de infraestructura.
- No despertar Azure SQL ni consultar datos de negocio.

## Fuera de alcance

- No cambiar recursos Azure.
- No cambiar App Settings.
- No hacer deploy.
- No ejecutar consultas SQL.
- No cargar datos reales.

## Criterios de aceptacion

- [x] Runbook ya no afirma que Azure SQL esta fuera del baseline.
- [x] Runbook lista recursos Azure SQL y guardrails relevantes.
- [x] Health esperado refleja `sqlConfigured=true` y `sqlAvailable=true`.
- [x] Reglas de seguridad siguen prohibiendo secretos y datos reales sin tarea explicita.
- [x] Handoff creado.

## Verificacion esperada

- Revision documental contra `docs/PILOT_DEPLOY_CONFIG.md`, `tasks/TASK-075-HANDOFF.md` y `tasks/TASK-076-HANDOFF.md`.
- `git diff --check`
