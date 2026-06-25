# TASK-049 - Handoff

Nombre del equipo/chat:
Ejecucion Tecnica

Modo:
Infra

Nombre de la tarea:
TASK-049 - Preflight cloud deploy sin crear recursos

Archivo de tarea:
`tasks/TASK-049.md`

## Nombre de tarea culminada

TASK-049 - Preflight cloud deploy sin crear recursos

## Status

entregada a revision

## Handoff

`tasks/TASK-049-HANDOFF.md`

## Resumen

Se preparo el preflight tecnico de cloud/deploy en `docs/CLOUD_DEPLOY_PREFLIGHT.md`, revisando plan Azure, tooling local, rutas a publicar, estrategia futura de API, variables/secrets necesarios y riesgos antes de crear recursos.

Uso Azure SQL: No.

## Ambiente

- Fecha: 2026-06-24
- Workspace: `C:\Work\Productos Digitales\PuntoVenta`
- Equipo/chat: Ejecucion Tecnica
- Modo: Infra
- Recursos Azure creados o modificados: No
- Uso DB cloud: No
- Uso Azure SQL: No
- Deploy ejecutado: No
- `swa deploy` ejecutado: No
- Secretos guardados en repo: No

## Archivos cambiados

- `docs/CLOUD_DEPLOY_PREFLIGHT.md`
- `docs/README.md`
- `docs/TASK_BOARD.md`
- `tasks/TASK-049.md`
- `tasks/TASK-049-HANDOFF.md`

## Verificacion ejecutada

Estado inicial:

```text
git status --short --branch
## main
 M .gitignore
 M api/README.md
 M api/package.json
 M docs/BACKLOG.md
 M docs/CURRENT_BLOCKERS.md
 M docs/ESTADO_OPERATIVO.md
 M docs/MVP_RELEASE_STATUS.md
 M docs/TASK_BOARD.md
 M tasks/TASK-046.md
?? api/.prettierignore
?? api/.prettierrc.json
?? api/eslint.config.js
?? api/package-lock.json
?? tasks/TASK-047-HANDOFF.md
?? tasks/TASK-047.md
?? tasks/TASK-048-HANDOFF.md
?? tasks/TASK-048.md
?? tasks/TASK-049.md
?? tasks/TASK-050.md
```

Comandos no destructivos:

```text
git --version
git version 2.54.0.windows.1

node --version
v22.23.0

npm --version
10.9.8

func --version
4.12.0

swa --version
2.0.9
Nota: reporto fallo no bloqueante al revisar update config en C:\Users\pj13e\.config.

gh --version
gh version 2.95.0 (2026-06-17)

sqlcmd -?
Version 16.0.1000.6 NT
```

Azure CLI:

```text
az --version
Resultado: falla por PermissionError en C:\Users\pj13e\.azure\azureProfile.json.
Interpretacion: CLI existe, pero el perfil local no es accesible desde esta sesion Codex. No se ejecuto contra recursos.
```

Revision documental:

- `docs/AZURE_INFRA_PLAN.md`
- `docs/PROYECTO_TOOLING_ADOPTION.md`
- `app/staticwebapp.config.json`
- `tasks/TASK-045-HANDOFF.md`
- `tasks/TASK-047-HANDOFF.md`
- `tasks/TASK-048-HANDOFF.md`

Verificacion final:

```text
git diff --check -- docs/CLOUD_DEPLOY_PREFLIGHT.md docs/README.md docs/TASK_BOARD.md tasks/TASK-049.md tasks/TASK-049-HANDOFF.md
Resultado: sin errores; solo advertencias CRLF de Git en archivos existentes.

rg "connectionString|password|token|SAS|sig=|local.settings.json|AzureWebJobsStorage|SQL_CONNECTION_STRING|AZURE_STATIC_WEB_APPS_API_TOKEN|client_secret|tenant|subscription|passwords|tokens" ...
Resultado: solo nombres de placeholders y textos de guardrail; no valores reales.
```

## Resultado por criterio

| Criterio | Resultado | Evidencia |
| --- | --- | --- |
| Preflight documenta estado de herramientas locales | Cumple | `docs/CLOUD_DEPLOY_PREFLIGHT.md` incluye tabla de herramientas. |
| Preflight documenta rutas/componentes a publicar | Cumple | Documenta `app/`, `app/staticwebapp.config.json` y `api/`. |
| Preflight documenta variables/secretos necesarios sin valores reales | Cumple | Lista placeholders y nombres de settings sin valores reales. |
| Preflight documenta riesgos y decisiones pendientes | Cumple | Incluye region, tenant/suscripcion, alcance Web/API/SQL y acceso Azure CLI. |
| No se crean recursos Azure | Cumple | No se ejecuto provisionamiento. |
| No se conecta Azure SQL | Cumple | Solo `sqlcmd -?`; no conexion. |
| El handoff indica `Uso Azure SQL: No` | Cumple | Indicado en este handoff. |

## Hallazgos

### P0/P1

- Ninguno.

### P2/P3

- P3: `az --version` falla en Codex por permisos del perfil local Azure. Antes de reinstalar o diagnosticar como ausencia de CLI, probar desde PowerShell normal o ajustar permisos del perfil fuera del repo.
- P3: `swa --version` devuelve version, pero falla el update check por permisos sobre `C:\Users\pj13e\.config`; no bloquea el preflight.
- P3: La API actual no es aun un proyecto Azure Functions; requiere tarea separada para adaptar/wrappear rutas antes de deploy API.

## Pendientes o riesgos

- Proyecto/PO debe decidir si primer deploy sera Web solamente, Web + API o Web + API + Azure SQL.
- Confirmar region, suscripcion/tenant y ambiente `pilot`.
- Crear tareas separadas para provisionamiento, workflows, adaptacion API y migracion Azure SQL si se aprueban.

## Movimiento de tablero

- De: Assigned
- A: Needs Review
