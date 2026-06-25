# TASK-065 - Handoff

Nombre del equipo/chat:
Ejecucion Tecnica

Modo:
Infra

Nombre de la tarea:
TASK-065 - Documentar baseline pilot reproducible Web API

Archivo de tarea:
`tasks/TASK-065.md`

## Nombre de tarea culminada

TASK-065 - Documentar baseline pilot reproducible Web API

## Status

entregada a revision

## Handoff

`tasks/TASK-065-HANDOFF.md`

## Resumen

Se creo el runbook reproducible del baseline pilot Web/API en `docs/PILOT_BASELINE_RUNBOOK.md` y se enlazo desde `docs/PILOT_DEPLOY_CONFIG.md`. El documento deja claras las URLs publicas, recursos Azure, workflows GitHub Actions, autenticacion de deploy, OIDC/RBAC, CORS esperada tras `TASK-064`, politicas SCM/FTP, checks no destructivos y la regla de que Azure SQL queda fuera del baseline.

Uso Azure SQL: No.

## Ambiente

- Fecha: 2026-06-25
- Workspace: `C:\Work\Productos Digitales\PuntoVenta`
- Equipo/chat: Ejecucion Tecnica
- Modo: Infra
- Azure SQL creado o usado: No
- Secretos modificados o expuestos: No

## Archivos cambiados

- `docs/PILOT_BASELINE_RUNBOOK.md`
- `docs/PILOT_DEPLOY_CONFIG.md`
- `docs/TASK_BOARD.md`
- `tasks/TASK-065.md`
- `tasks/TASK-065-HANDOFF.md`

## Contenido documentado

El runbook incluye:

- URLs publicas Web/API pilot.
- Resource group, Static Web App, Function App y region.
- Workflows `.github/workflows/puntoventa-web-pilot.yml` y `.github/workflows/puntoventa-api-pilot.yml`.
- Criterios de exito por workflow.
- Deploy Web por Static Web Apps token fuera del repo.
- Deploy API por GitHub OIDC + `azure/login@v2` + RBAC minimo.
- Secrets/config esperados por nombre, sin valores.
- Publish profile API retirado y no esperado.
- App settings no secretos: `APP_ENV`, `PV_SQLSERVER_ENABLED`, `ALLOWED_ORIGINS`.
- CORS restringido al origen `https://gray-beach-00a0f870f.7.azurestaticapps.net`.
- Politicas esperadas `scm allow:false` y `ftp allow:false`.
- Checks no destructivos para Web, API, CORS, politicas y ausencia de Azure SQL.

## Verificacion

Revision documental:

```text
docs/PILOT_BASELINE_RUNBOOK.md creado
docs/PILOT_DEPLOY_CONFIG.md enlaza el runbook operativo
```

Busqueda textual de secretos en archivos tocados:

```text
No se pegaron valores de tokens, passwords, publish profiles ni connection strings.
El documento contiene solo nombres de secrets/config esperados.
```

## Resultado por criterio

| Criterio | Resultado | Evidencia |
| --- | --- | --- |
| Baseline pilot reproducible documentado en `docs/` | Cumple | `docs/PILOT_BASELINE_RUNBOOK.md`. |
| URLs, workflows, OIDC/RBAC, CORS y SCM/FTP claros | Cumple | Secciones dedicadas en el runbook. |
| Azure SQL explicitamente fuera del baseline | Cumple | Se documenta no configurar `SQL_CONNECTION_STRING` y check esperado `[]`. |
| Checks de verificacion documentados | Cumple | Comandos `curl.exe` y `az` no destructivos incluidos. |
| No se exponen secretos | Cumple | Solo nombres de secrets/config; sin valores. |
| Handoff indica `Uso Azure SQL: No` | Cumple | Indicado en resumen y ambiente. |

## Movimiento de tablero

- De: Assigned
- A: Needs Review
