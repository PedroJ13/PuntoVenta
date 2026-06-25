# TASK-058 - Handoff

Nombre del equipo/chat:
Ejecucion Tecnica

Modo:
Infra

Nombre de la tarea:
TASK-058 - Ejecutar deploy pilot por GitHub Actions

Archivo de tarea:
`tasks/TASK-058.md`

## Nombre de tarea culminada

TASK-058 - Ejecutar deploy pilot por GitHub Actions

## Status

entregada a revision con bloqueo documentado

## Handoff

`tasks/TASK-058-HANDOFF.md`

## Resumen

`TASK-057` dejo los cambios en GitHub `main` y los workflows pilot existen en el remoto. No se pudieron ejecutar manualmente los workflows desde esta sesion porque `gh auth status` sigue reportando token invalido y las herramientas GitHub disponibles no exponen `workflow_dispatch` ni listado completo de runs/secrets. No se pudo validar Web/API por HTTP desde este entorno porque las conexiones TCP a Azure siguen fallando por 443.

Uso Azure SQL: No.

## Ambiente

- Fecha: 2026-06-24
- Workspace: `C:\Work\Productos Digitales\PuntoVenta`
- Equipo/chat: Ejecucion Tecnica
- Modo: Infra
- Repo GitHub: `PedroJ13/PuntoVenta`
- Branch: `main`
- Commit deploy pilot: `00c726c Add PuntoVenta pilot deploy pipeline`
- Commit ajuste handoff 057: `e7118e1 Update TASK-057 handoff after push`
- Web URL: `https://gray-beach-00a0f870f.7.azurestaticapps.net/`
- API health URL: `https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health`
- Azure SQL creado o usado: No
- Secretos expuestos: No

## Evidencia GitHub

Repositorio:

```text
PedroJ13/PuntoVenta
visibility: public
default_branch: main
permissions: admin/push disponibles por conector GitHub
```

Workflow Web existe en remoto:

```text
.github/workflows/puntoventa-web-pilot.yml
```

Contenido relevante:

```text
name: PuntoVenta Web Pilot
on: workflow_dispatch, push main paths app/** y workflow
secret requerido: AZURE_STATIC_WEB_APPS_API_TOKEN_PUNTOVENTA
app_location: app
```

Workflow API existe en remoto:

```text
.github/workflows/puntoventa-api-pilot.yml
```

Contenido relevante:

```text
name: PuntoVenta API Pilot
on: workflow_dispatch, push main paths api/** y workflow
secret requerido: AZURE_FUNCTIONAPP_PUBLISH_PROFILE_PUNTOVENTA
app-name: func-puntoventa-pilot-eastus2
package: api
```

Estado de checks/runs por commit:

```text
GitHub combined status para e7118e1: []
GitHub combined status para 00c726c: []
fetch_commit_workflow_runs e7118e1: []
fetch_commit_workflow_runs 00c726c: []
```

Nota: la herramienta disponible para workflow runs esta orientada a commits de PR y no equivale a listado completo de Actions. `gh` local no se puede usar por token invalido.

```text
gh auth status
```

Resultado:

```text
The token in default is invalid.
```

## Smoke HTTP publico

Web:

```text
curl.exe -I --connect-timeout 15 https://gray-beach-00a0f870f.7.azurestaticapps.net/
```

Resultado:

```text
curl: (7) Failed to connect to gray-beach-00a0f870f.7.azurestaticapps.net port 443
```

API:

```text
curl.exe -i --connect-timeout 15 https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health
```

Resultado:

```text
curl: (7) Failed to connect to func-puntoventa-pilot-eastus2.azurewebsites.net port 443
```

## Azure SQL

```text
az resource list --resource-group rg-puntoventa-pilot-eastus2 --query "[?contains(type, 'Sql') || contains(type, 'sql')].{name:name,type:type}" --output json
```

Resultado:

```text
[]
```

## Secretos

No se leyeron ni expusieron valores de secrets.

No se pudo confirmar existencia de secrets desde esta sesion porque:

- `gh auth status` tiene token invalido.
- El conector GitHub disponible no expone listado de GitHub Actions secrets.

Secrets requeridos a confirmar en GitHub repo/ambiente `pilot`:

- `AZURE_STATIC_WEB_APPS_API_TOKEN_PUNTOVENTA`
- `AZURE_FUNCTIONAPP_PUBLISH_PROFILE_PUNTOVENTA`

## Resultado por criterio

| Criterio | Resultado | Evidencia |
| --- | --- | --- |
| Workflows pilot ejecutados correctamente o bloqueo exacto documentado | Cumple con bloqueo | Workflows existen en remoto; no hay `workflow_dispatch` disponible y `gh` esta invalido. |
| Web publica responde o bloqueo exacto documentado | Cumple con bloqueo | `curl` falla TCP por 443 hacia SWA desde este entorno. |
| API health publica responde o bloqueo exacto documentado | Cumple con bloqueo | `curl` falla TCP por 443 hacia Function App desde este entorno. |
| No se crea ni usa Azure SQL | Cumple | Lista de recursos SQL vacia. |
| No se exponen secretos | Cumple | No se leyeron valores; solo nombres de secrets. |
| Queda recomendacion clara | Cumple | Ver seccion siguiente. |
| El handoff indica `Uso Azure SQL: No` | Cumple | Indicado en resumen y ambiente. |

## Recomendacion

No crear QA publicado todavia.

Siguiente desbloqueo recomendado:

1. En GitHub web UI, confirmar que los secrets existen en repo o ambiente `pilot`.
2. Ejecutar manualmente:
   - `PuntoVenta API Pilot`
   - `PuntoVenta Web Pilot`
3. Revisar runs/logs de Actions en GitHub.
4. Validar desde una red externa:
   - `https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health`
   - `https://gray-beach-00a0f870f.7.azurestaticapps.net/`
5. Crear QA publicado solo si ambos endpoints responden.

## Hallazgos

### P0/P1

- P1: Workflows no pudieron ejecutarse desde esta sesion por falta de `workflow_dispatch` en herramientas disponibles y `gh` local invalido.
- P1: HTTP publico no verificable desde este entorno por fallo TCP hacia Azure.

### P2/P3

- P2: Los workflows estan presentes en `main`, pero no hay evidencia local/connector de runs exitosos.
- P2: No se pudo confirmar existencia de GitHub Actions secrets sin exponer valores.

## Movimiento de tablero

- De: Assigned
- A: Needs Review
