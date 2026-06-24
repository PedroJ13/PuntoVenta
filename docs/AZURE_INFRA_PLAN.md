# Azure Infra Plan

## Estado

Plan inicial definido en `TASK-006`.

Este documento es solo diseno de infraestructura. No se han creado recursos Azure, no se ha ejecutado deploy y no se ha conectado Azure SQL.

## Objetivo

Preparar una ruta simple y de bajo costo para publicar PuntoVenta como MVP/piloto:

- Frontend estatico en Azure Static Web Apps.
- API HTTP en Azure Functions.
- Datos en Azure SQL Database con guardrails de costo.
- Secretos fuera del repositorio.
- Despliegue automatizado desde GitHub Actions.

## Ambiente inicial

Ambiente recomendado para el primer piloto:

- `pilot`: ambiente unico para validacion controlada del MVP.

Ambientes posteriores:

- `prod`: cuando el piloto pase a operacion real.
- `staging`: solo si QA publicado necesita separarse de produccion.

## Region propuesta

Usar una region cercana y disponible para el tenant Azure del proyecto.

Nombre sugerido en ejemplos:

- `eastus2`

Antes de crear recursos, confirmar region real con disponibilidad, costo y preferencia de cuenta Azure.

## Nombres propuestos

Formato base:

```text
<servicio>-puntoventa-<env>-<region>
```

Para `pilot`:

| Recurso | Nombre sugerido | Nota |
| --- | --- | --- |
| Resource group | `rg-puntoventa-pilot-eastus2` | Contenedor de recursos del piloto. |
| Static Web App | `swa-puntoventa-pilot-eastus2` | Frontend estatico desde `app/`. |
| Function App | `func-puntoventa-pilot-eastus2` | API HTTP separada del frontend. |
| Storage Function App | `stpuntoventapiloteastus2` | Nombre debe ajustarse a reglas globales de Storage. |
| App Insights | `appi-puntoventa-pilot-eastus2` | Observabilidad basica. |
| Log Analytics | `log-puntoventa-pilot-eastus2` | Logs compartidos si se habilita App Insights. |
| SQL Server | `sqlserver-puntoventa-pilot-eastus2` | Servidor logico Azure SQL. |
| SQL Database | `sqldb-puntoventa-pilot` | Base de datos del piloto. |
| Runtime SQL user | `puntoventa_app_user` | Usuario de permisos minimos para API. |

## Frontend

Decision recomendada:

- Usar Azure Static Web Apps.
- App location: `app`.
- API location: vacio, porque la API vive en Azure Functions separado.
- Output location: vacio mientras la app sea HTML/CSS/JS estatico sin build.
- Mantener `app/staticwebapp.config.json` para fallback SPA.

Deploy recomendado:

- Workflow: `.github/workflows/azure-static-web-apps-puntoventa.yml`.
- Trigger por cambios en:
  - `app/**`
  - `.github/workflows/azure-static-web-apps-puntoventa.yml`
- Secret requerido en GitHub:
  - `AZURE_STATIC_WEB_APPS_API_TOKEN_PUNTOVENTA`

## API

Decision recomendada:

- Usar Azure Functions con runtime Node.js LTS del proyecto.
- Carpeta futura: `api/`.
- Exponer endpoints HTTP bajo `/api`.
- Mantener la Function App separada de Static Web Apps.

Deploy recomendado:

- Workflow: `.github/workflows/azure-functions-api.yml`.
- Trigger por cambios en:
  - `api/**`
  - `.github/workflows/azure-functions-api.yml`
- Usar OIDC/federated credentials para login Azure cuando sea posible.
- Ejecutar tests antes del deploy.
- Ejecutar smoke corto despues del deploy.

Variables no secretas sugeridas para workflow:

```text
AZURE_FUNCTIONAPP_NAME=func-puntoventa-pilot-eastus2
AZURE_RESOURCE_GROUP=rg-puntoventa-pilot-eastus2
API_BASE_URL=https://func-puntoventa-pilot-eastus2.azurewebsites.net/api
```

Secretos o IDs sensibles deben ir en GitHub Secrets o variables protegidas, no en el repo.

## Secretos y configuracion

No guardar en el repositorio:

- Tokens de Static Web Apps.
- Connection strings.
- Passwords.
- API keys.
- Tokens admin internos.
- Cookies o sesiones.

Usar:

- GitHub Secrets para tokens de deploy y credenciales federadas.
- Azure Function App Settings para secretos runtime.
- `api/local.settings.json` para desarrollo local, ignorado por git.
- `local-secrets/` para scripts locales de admin, ignorado por git.

App Settings esperados en Azure Functions:

```text
APP_ENV=pilot
SQL_CONNECTION_STRING=<runtime-connection-string>
ALLOWED_ORIGINS=https://<static-web-app-host>
```

`SQL_CONNECTION_STRING` debe pertenecer al usuario runtime de permisos minimos, no al admin.

## Azure SQL

Decision recomendada:

- Azure SQL Database serverless para piloto si el patron de uso es intermitente.
- Max vCores bajo, por ejemplo `1` si alcanza.
- Min capacity bajo, por ejemplo `0.5` si esta disponible.
- Auto-pause en el minimo permitido.
- Una base por ambiente: `sqldb-puntoventa-pilot`.

Usuarios:

- `puntoventa_app_user`: runtime API con permisos minimos.
- Usuario admin/migracion: solo para migraciones aprobadas, nunca runtime.

Permisos runtime esperados:

- `SELECT`, `INSERT`, `UPDATE`, `DELETE` sobre tablas necesarias.
- Sin `ALTER`, `CREATE` ni `DROP` salvo decision explicita.

## Guardrails de costo y uso

Por defecto, no despertar Azure SQL.

Azure SQL solo se usa para:

- Migraciones aprobadas.
- Smoke final de endpoints criticos.
- Bug que solo ocurre contra Azure.
- Verificacion puntual de configuracion de Infra o secretos.

Azure SQL no se usa para:

- Tareas visuales.
- Frontend.
- Copy.
- Responsive.
- QA repetitivo.
- Seeds masivos.
- Monitores permanentes.

Antes de conectar a Azure SQL, responder:

1. La tarea exige persistencia real en Azure?
2. Se puede validar con mock, test local o API local?
3. Esta claro que consulta, smoke o migracion se va a ejecutar?
4. Hay autorizacion para crear firewall temporal si hace falta?
5. Se retirara la regla temporal al terminar?

## Firewall temporal

Si una tarea aprobada requiere acceso local a Azure SQL:

- Crear regla temporal por IP local.
- Nombre: `tmp-task###-sql-<purpose>-<ip>`.
- Retirar la regla al finalizar.
- Verificar que la lista queda vacia para ese nombre.
- Registrar en handoff si se creo y retiro.

## Observabilidad minima

Para el piloto:

- Habilitar Application Insights para Azure Functions.
- Registrar errores de API sin payloads sensibles.
- No loguear connection strings, tokens, passwords, PINs ni datos completos de clientes.
- Para frontend, empezar con errores visibles al usuario y logs de navegador solo en desarrollo.

## Estrategia de publicacion

Flujo recomendado:

1. Implementar local.
2. Ejecutar checks locales.
3. QA valida local si aplica.
4. Publicar con tarea separada.
5. Confirmar GitHub Actions en `success`.
6. Verificar frontend publicado con cache busting.
7. Ejecutar smoke corto de API publicada.
8. Registrar URL, commit, workflow run y uso de DB cloud en handoff.

## Fuera de alcance para este plan

- Crear recursos Azure.
- Configurar DNS custom.
- Implementar autenticacion completa.
- Aplicar migraciones.
- Ejecutar deploy.
- Crear secretos reales.
- Cambiar billing, cuotas o capacidad sin aprobacion.

## Pendientes antes de crear recursos

- Confirmar region Azure final.
- Confirmar nombre de suscripcion/tenant que usara el proyecto.
- Confirmar si `pilot` sera el unico ambiente inicial.
- Crear tarea explicita de provisionamiento Infra.
- Crear tarea explicita para workflow de frontend.
- Crear tarea explicita para workflow de API cuando exista `api/`.
- Crear tarea explicita de migracion Azure SQL cuando Proyecto apruebe ejecutar el schema.
