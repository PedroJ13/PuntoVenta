# TASK-084 - Publicar correccion health API pilot y validar baseline

## Estado

Blocked

## Nombre del Equipo

Ejecucion Tecnica

## Modo

Infra

## Nombre de la tarea

TASK-084 - Publicar correccion health API pilot y validar baseline

## Handoff esperado

Al finalizar, debe crear o actualizar `tasks/TASK-084-HANDOFF.md` usando el formato de handoff indicado.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/ESTADO_OPERATIVO.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/TASK_BOARD.md`
- `docs/PILOT_DEPLOY_CONFIG.md`
- `docs/PILOT_BASELINE_RUNBOOK.md`
- `tasks/TASK-082-HANDOFF.md`
- `tasks/TASK-083-HANDOFF.md`

## Objetivo

Publicar en el pilot la correccion de `GET /api/health` preparada por `TASK-082` y validar que el baseline documentado por `TASK-083` coincide con el comportamiento publicado.

## Alcance

- Revisar estado Git y confirmar los cambios a publicar.
- Consolidar commit de los cambios de `TASK-082` y `TASK-083` si todavia no estan commiteados.
- Publicar por el canal permitido del repo.
- Ejecutar o monitorear el workflow/deploy API pilot correspondiente.
- Validar `GET /api/health` publicado:
  - `sqlConfigured=true`;
  - `sqlAvailable=true` cuando Azure SQL responde;
  - respuesta sin secretos;
  - CORS sigue restringido segun baseline.
- Validar que Web/API sigan respondiendo.
- Documentar evidencia sin exponer tokens, connection strings, passwords ni secretos.
- Confirmar que no se cargaron datos reales.

## Fuera de alcance

- No modificar codigo funcional nuevo salvo ajuste menor imprescindible para publicar la correccion ya preparada.
- No cargar datos reales.
- No ejecutar migraciones ni seeds.
- No cambiar `PV_SQLSERVER_COMPANY_TAX_ID`.
- No cambiar firewall, secrets, App Settings ni recursos Azure salvo lo estrictamente requerido por el deploy ya existente.
- No relajar CORS, OIDC/RBAC, SCM/FTP basic publishing ni guardrails de seguridad.

## Criterios de aceptacion

- [x] Cambios de `TASK-082` y `TASK-083` publicados en remoto o se documenta bloqueo exacto.
- [x] Deploy/API workflow pilot queda exitoso o se documenta bloqueo exacto.
- [ ] `GET /api/health` publicado refleja disponibilidad SQL real sin depender de calentar otros modulos.
- [ ] La respuesta publicada no expone secretos.
- [ ] Web/API publicos siguen respondiendo.
- [x] Handoff incluye evidencia de commit/workflow/URL/health sin secretos.
- [x] Handoff indica que no se cargaron datos reales.

## Verificacion esperada

- `git status --short --branch`
- Validacion del workflow/deploy API pilot.
- Checks HTTP publicados contra health y Web/API.
- `git diff --check` si quedan cambios locales.
