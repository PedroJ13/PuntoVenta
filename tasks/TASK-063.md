# TASK-063 - Migrar API deploy pilot a OIDC RBAC y apagar SCM

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Infra
Prioridad: P1 pre-lanzamiento

## Contexto

`TASK-061` habilito `basicPublishingCredentialsPolicies/scm allow:true` como excepcion temporal para desbloquear el deploy API pilot con publish profile. `TASK-062` aprobo QA publicado Web/API sin P0/P1, pero dejo como P2 cerrar esa excepcion temporal y migrar el deploy API a GitHub OIDC + `azure/login` + RBAC minimo.

## Objetivo

Migrar el workflow API pilot a autenticacion federada/RBAC, verificar deploy exitoso y volver `basicPublishingCredentialsPolicies/scm allow:false` manteniendo `ftp allow:false`.

## Alcance

- Crear o reutilizar identidad/app registration para GitHub Actions pilot sin client secret.
- Crear federated credential para el repo/branch o environment `pilot`.
- Asignar RBAC minimo para deploy de Function App pilot, preferiblemente scope Function App y rol `Website Contributor`.
- Configurar GitHub secrets/variables no secretas necesarias sin exponer valores:
  - `AZURE_CLIENT_ID`
  - `AZURE_TENANT_ID`
  - `AZURE_SUBSCRIPTION_ID`
- Actualizar workflow `PuntoVenta API Pilot` para usar `azure/login` + OIDC/RBAC.
- Ejecutar workflow API pilot y validar resultado.
- Si el deploy OIDC/RBAC funciona, volver:
  - `basicPublishingCredentialsPolicies/scm allow:false`
  - `basicPublishingCredentialsPolicies/ftp allow:false`
- Validar de nuevo API health y Web publicados.
- Confirmar que no se crea ni usa Azure SQL.

## Fuera de alcance

- No crear Azure SQL.
- No migrar datos.
- No guardar client secrets, publish profiles, tokens ni connection strings en repo.
- No exponer valores de secrets en logs, handoff ni chat.
- No hacer QA funcional completo.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `tasks/TASK-061-HANDOFF.md`
- `tasks/TASK-062-HANDOFF.md`
- `docs/PILOT_DEPLOY_CONFIG.md`
- `docs/CURRENT_BLOCKERS.md`
- `C:\Work\Productos Digitales\PuntoEvento\docs\AZURE_FUNCTIONS_GITHUB_ACTIONS_DEPLOY_DECISION.md`
- `.github/workflows/puntoventa-api-pilot.yml`

## Dependencia

- Ejecutar despues de `TASK-062`.

## Criterios de aceptacion

- [x] Workflow API pilot usa OIDC/RBAC y queda exitoso, o bloqueo exacto documentado.
- [x] No se usan publish profiles para API deploy si OIDC queda funcionando.
- [x] `scm allow:false` queda restaurado si OIDC queda funcionando.
- [x] `ftp allow:false` queda confirmado.
- [x] API health publica responde `HTTP 200`.
- [x] Web publica responde `HTTP 200`.
- [x] No se crea ni usa Azure SQL.
- [x] No se exponen secretos.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Evidencia de identidad/federated credential sin secretos.
- Evidencia de RBAC con scope minimo.
- Evidencia de run GitHub Actions API.
- Evidencia de politicas SCM/FTP finales.
- Checks HTTP no destructivos contra Web/API.
- Consulta Azure para confirmar ausencia de SQL.
- `git status --short --branch`.

## Handoff esperado

Crear o actualizar `tasks/TASK-063-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
