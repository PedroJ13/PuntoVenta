# TASK-061 - Habilitar SCM pilot temporal y reintentar deploy API

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Infra
Prioridad: P1 pre-lanzamiento

## Contexto

`TASK-060` dejo el Web workflow pilot exitoso y Web/API publicos respondiendo `HTTP 200`, pero el API workflow falla con Kudu `401` porque la Function App pilot tiene `basicPublishingCredentialsPolicies/scm allow:false`. Proyecto/PO aprobo usar el camino rapido para pilot: habilitar SCM basic publishing temporalmente, mantener FTP deshabilitado y reintentar el deploy API con publish profile.

## Objetivo

Desbloquear el deploy API pilot por GitHub Actions habilitando temporalmente SCM basic publishing solo en la Function App pilot, sin habilitar FTP y sin crear Azure SQL.

## Alcance

- Confirmar estado actual de:
  - `basicPublishingCredentialsPolicies/scm`
  - `basicPublishingCredentialsPolicies/ftp`
- Habilitar `scm allow:true` solo para `func-puntoventa-pilot-eastus2`.
- Mantener o forzar `ftp allow:false`.
- Re-ejecutar workflow `PuntoVenta API Pilot`.
- Validar que el workflow API quede exitoso o documentar bloqueo exacto.
- Validar que el workflow Web siga exitoso o no haya regresion relevante.
- Validar de nuevo:
  - `https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health`
  - `https://gray-beach-00a0f870f.7.azurestaticapps.net/`
- Confirmar que no se crea ni usa Azure SQL.
- Documentar que `scm allow:true` es temporal para pilot y que debe migrarse a OIDC/RBAC.

## Fuera de alcance

- No crear Azure SQL.
- No migrar datos.
- No exponer publish profiles, secrets, tokens ni connection strings.
- No habilitar FTP basic publishing.
- No hacer QA funcional completo.
- No migrar todavia a OIDC/RBAC.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `tasks/TASK-060-HANDOFF.md`
- `docs/PILOT_DEPLOY_CONFIG.md`
- `docs/CURRENT_BLOCKERS.md`
- `C:\Work\Productos Digitales\PuntoEvento\docs\AZURE_FUNCTIONS_GITHUB_ACTIONS_DEPLOY_DECISION.md`
- `.github/workflows/puntoventa-api-pilot.yml`
- `.github/workflows/puntoventa-web-pilot.yml`

## Dependencia

- Aprobacion Proyecto/PO recibida en este hilo para camino rapido pilot: SCM basic publishing temporal, FTP deshabilitado.

## Criterios de aceptacion

- [x] `scm allow:true` queda aplicado solo a Function App pilot, o bloqueo exacto documentado.
- [x] `ftp allow:false` queda confirmado.
- [x] Workflow `PuntoVenta API Pilot` queda exitoso, o bloqueo exacto documentado.
- [x] Web publica responde `HTTP 200`.
- [x] API health publica responde `HTTP 200`.
- [x] No se crea ni usa Azure SQL.
- [x] No se exponen secretos.
- [x] Queda recomendacion clara para QA publicado y para migracion posterior a OIDC/RBAC.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Evidencia de politicas SCM/FTP antes/despues, sin secretos.
- Evidencia de run de GitHub Actions API.
- Checks HTTP no destructivos contra Web/API.
- Consulta Azure para confirmar ausencia de SQL.
- `git status --short --branch`.

## Handoff esperado

Crear o actualizar `tasks/TASK-061-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
