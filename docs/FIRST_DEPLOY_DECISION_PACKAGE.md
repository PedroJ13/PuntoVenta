# First Deploy Decision Package

## Estado

Paquete de decision para autorizar o rechazar el primer deploy cloud del MVP PuntoVenta.

Este documento no crea recursos, no ejecuta deploy y no conecta Azure SQL.

## Decision solicitada

Proyecto/PO debe decidir:

- si se autoriza primer deploy;
- que alcance tendra;
- que ambiente se usara;
- si Azure SQL entra ahora o queda para una fase posterior;
- quien ejecuta provisionamiento y bajo que cuenta/suscripcion.

## Opcion recomendada

Recomendacion tecnica: primer deploy controlado en ambiente `pilot`, empezando por Web estatica y preparando API en Azure Functions como tarea separada.

Ruta recomendada:

1. Provisionar recursos base `pilot`.
2. Publicar Web estatica desde `app/` en Azure Static Web Apps.
3. Adaptar API local actual a Azure Functions en una tarea tecnica separada.
4. Publicar API cuando el wrapper de Functions y los checks locales pasen.
5. Mantener Azure SQL fuera del primer deploy salvo aprobacion explicita de migracion/smoke.

## Opciones

| Opcion | Alcance | Ventaja | Riesgo / costo |
| --- | --- | --- | --- |
| A. Web estatica primero | Static Web Apps para `app/`, API local/fake sigue fuera de cloud | Menor riesgo, valida hosting web y configuracion publica | No valida API publicada ni persistencia cloud. |
| B. Web + API | SWA para `app/` y Azure Functions para `api/` | Valida flujo publicado mas completo | Requiere adaptar API a Functions y configurar CORS/secrets. |
| C. Web + API + Azure SQL | SWA, Functions y Azure SQL | Se acerca al piloto real con persistencia cloud | Mayor costo/riesgo; requiere migracion, firewall, usuario runtime y smoke controlado. |

## Recursos que requeririan aprobacion

Nombres sugeridos desde `docs/AZURE_INFRA_PLAN.md`:

- Resource group: `rg-puntoventa-pilot-eastus2`
- Static Web App: `swa-puntoventa-pilot-eastus2`
- Function App: `func-puntoventa-pilot-eastus2`
- Storage para Function App: `stpuntoventapiloteastus2`
- Application Insights: `appi-puntoventa-pilot-eastus2`
- Log Analytics: `log-puntoventa-pilot-eastus2`
- Azure SQL Server: `sqlserver-puntoventa-pilot-eastus2`
- Azure SQL Database: `sqldb-puntoventa-pilot`
- Usuario runtime SQL: `puntoventa_app_user`

Antes de crear recursos, confirmar region real, suscripcion/tenant, presupuesto y alcance.

## Secrets y configuracion requerida

No guardar valores en repo. Crear solo despues de aprobacion.

- `AZURE_STATIC_WEB_APPS_API_TOKEN_PUNTOVENTA`
- Credenciales federadas/OIDC para GitHub Actions si se automatiza deploy.
- `AZURE_FUNCTIONAPP_NAME`
- `AZURE_RESOURCE_GROUP`
- `API_BASE_URL`
- `APP_ENV`
- `SQL_CONNECTION_STRING`
- `ALLOWED_ORIGINS`

## Costos y guardrails

- Usar ambiente unico `pilot` para validacion controlada.
- Mantener Static Web Apps en opcion de bajo costo.
- Habilitar Application Insights con logging basico y sin payloads sensibles.
- Si se autoriza Azure SQL, usar serverless/bajo consumo con auto-pause cuando aplique.
- No despertar Azure SQL para tareas visuales, copy, responsive o QA repetitivo.
- No crear reglas firewall permanentes para IP local.
- Registrar en handoff cada uso de DB cloud.

## Separacion SQL local vs Azure SQL

SQL Server Express local sigue siendo la base validada del MVP local.

Azure SQL debe entrar solo con tarea explicita para:

- provisionar servidor/base;
- aplicar migraciones aprobadas;
- crear usuario runtime de permisos minimos;
- configurar secrets en Function App;
- ejecutar smoke corto de endpoints criticos.

La primera publicacion puede hacerse sin Azure SQL si el objetivo es validar hosting web y pipeline.

## Orden de tareas posterior si se aprueba

1. Infra: provisionar recursos `pilot` sin deploy funcional.
2. Infra: configurar GitHub Actions para Static Web Apps.
3. Web Dev / Infra: publicar Web estatica y validar ruta publica.
4. Backend/API: adaptar API local a Azure Functions manteniendo contratos.
5. Infra: configurar workflow de Azure Functions con tests.
6. SQL DEV / Data: preparar migracion Azure SQL revisable.
7. Infra / SQL DEV: ejecutar migracion Azure SQL solo con aprobacion.
8. QA: smoke publicado Web/API y evidencia de no filtrado de secretos.

## Recomendacion final

Autorizar primero la opcion A o B. Posponer opcion C hasta que Proyecto/PO confirme costo, tenant/suscripcion y necesidad de persistencia cloud real para piloto.
