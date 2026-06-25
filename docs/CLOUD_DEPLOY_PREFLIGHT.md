# Cloud Deploy Preflight

## Estado

Preflight tecnico para publicar el MVP de PuntoVenta en cloud.

Resultado: listo para decision, sin recursos creados y sin deploy ejecutado.

## Alcance validado

- Frontend estatico: `app/`.
- Configuracion Static Web Apps: `app/staticwebapp.config.json`.
- API local actual: `api/`, Node.js ESM con rutas HTTP bajo `/api`.
- Datos actuales: SQL Server Express local opcional y repositorios fake fallback.
- Futuro cloud: Azure Static Web Apps, Azure Functions y Azure SQL, solo con aprobacion posterior.

## Herramientas locales

Comandos no destructivos ejecutados:

| Herramienta | Resultado | Nota |
| --- | --- | --- |
| `git --version` | `git version 2.54.0.windows.1` | Disponible. |
| `node --version` | `v22.23.0` | Disponible. |
| `npm --version` | `10.9.8` | Disponible. |
| `func --version` | `4.12.0` | Disponible. |
| `swa --version` | `2.0.9` | Disponible; reporta fallo no bloqueante al revisar update config en `C:\Users\pj13e\.config`. |
| `gh --version` | `2.95.0` | Disponible. |
| `sqlcmd -?` | `Version 16.0.1000.6 NT` | Disponible; solo se consulto ayuda/version. |
| `az --version` | Falla por permiso en `C:\Users\pj13e\.azure\azureProfile.json` | Azure CLI existe, pero Codex no puede leer/escribir el perfil local en esta sesion. Probar desde PowerShell normal antes de reinstalar. |

## Rutas y componentes

### Web

- Ruta fuente: `app/`.
- Tipo actual: HTML/CSS/JS estatico sin build.
- Output location esperado: vacio.
- App location esperado: `app`.
- API location esperado en SWA: vacio, porque la API se publicaria como Azure Functions separado.

`app/staticwebapp.config.json` contiene fallback SPA:

```json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/assets/*", "/src/*", "/*.{css,js,png,jpg,jpeg,webp,svg,ico}"]
  }
}
```

### API

- Ruta fuente actual: `api/`.
- Runtime local: Node.js ESM.
- Servidor actual: `api/src/server.js`.
- Tests/check local: `npm run check` desde `api/`.
- Deploy futuro recomendado: Azure Functions separado de SWA.

Brecha tecnica antes de publicar API:

- El API actual es un servidor HTTP Node local, no un proyecto Azure Functions con `host.json`, funciones HTTP y bindings.
- Antes del primer deploy de API se requiere tarea tecnica para adaptar o envolver rutas actuales como Azure Functions sin cambiar contrato.
- Mantener tests locales antes del deploy y smoke corto posterior.

## Variables y secretos requeridos

No se crearon ni guardaron valores reales.

### GitHub Secrets / Variables

- `AZURE_STATIC_WEB_APPS_API_TOKEN_PUNTOVENTA`: token de deploy de Static Web Apps.
- Credenciales OIDC/federated credentials para Azure, si se usa deploy por GitHub Actions.
- `AZURE_FUNCTIONAPP_NAME`: nombre de Function App.
- `AZURE_RESOURCE_GROUP`: resource group objetivo.
- `API_BASE_URL`: URL publica del API.

### Azure Function App Settings

- `APP_ENV=pilot`
- `SQL_CONNECTION_STRING=<runtime-connection-string>`
- `ALLOWED_ORIGINS=https://<static-web-app-host>`

`SQL_CONNECTION_STRING` debe ser de usuario runtime con permisos minimos, no usuario admin.

## Riesgos y decisiones pendientes

- Confirmar region Azure final antes de crear recursos.
- Confirmar suscripcion/tenant que usara el proyecto.
- Confirmar si el primer ambiente sera solo `pilot`.
- Decidir si el primer deploy incluye solo Web estatica o Web + API.
- Definir si Azure SQL entra en el primer deploy o queda para una tarea posterior.
- Resolver acceso de Azure CLI en Codex o ejecutar provisionamiento desde una PowerShell normal autorizada.
- Crear tareas separadas para provisionamiento, workflows y migracion; este preflight no autoriza creacion de recursos.

## Guardrails

- No crear recursos Azure sin tarea y aprobacion explicita.
- No ejecutar `swa deploy` antes de la tarea de deploy.
- No conectar Azure SQL antes de una tarea de migracion/smoke aprobada.
- No guardar secrets, connection strings, tokens ni passwords en el repo.
- No cambiar billing, capacidad ni cuotas sin confirmacion explicita.

## Resultado

El preflight deja claro el camino tecnico y los bloqueos de decision. La siguiente accion es preparar el paquete de decision para Proyecto/PO antes de abrir tareas de provisionamiento o deploy.
