# TASK-074 - Provisionar Azure SQL pilot y configurar acceso seguro

## Estado

Blocked

## Nombre del Equipo

Ejecucion Tecnica

## Modo

Infra

## Nombre de la tarea

TASK-074 - Provisionar Azure SQL pilot y configurar acceso seguro

## Handoff esperado

Al finalizar, debe crear o actualizar `tasks/TASK-074-HANDOFF.md` usando el formato de handoff indicado.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/AZURE_INFRA_PLAN.md`
- `docs/FIRST_DEPLOY_DECISION_PACKAGE.md`
- `docs/CLOUD_DEPLOY_PREFLIGHT.md`
- `docs/PILOT_DEPLOY_CONFIG.md`
- `tasks/TASK-072-HANDOFF.md`
- `tasks/TASK-073-HANDOFF.md`

## Objetivo

Crear Azure SQL pilot con configuracion minima y segura para persistencia real, sin exponer secretos y sin usar credenciales admin para runtime.

## Alcance

- Confirmar suscripcion, tenant, region y resource group pilot.
- Crear o validar Azure SQL Server y Azure SQL Database pilot si estan autorizados.
- Configurar guardrails de costo apropiados para pilot.
- Preparar usuario runtime de permisos minimos o mecanismo equivalente.
- Configurar secrets/runtime settings en Function App sin escribir valores en repo.
- Documentar recursos creados, configuracion y costos esperados.

## Fuera de alcance

- No modificar Web.
- No cambiar codigo API.
- No ejecutar QA funcional completa.
- No guardar connection strings o passwords en archivos.
- No usar datos reales.
- No abrir reglas firewall permanentes innecesarias.

## Criterios de aceptacion

- [ ] Azure SQL pilot creado o bloqueo exacto documentado.
- [ ] Runtime access configurado con permisos minimos o plan claro.
- [ ] Secrets/config aplicados fuera del repo o bloqueo documentado.
- [ ] Costos/guardrails documentados.
- [ ] Handoff indica `Uso Azure SQL: Si` si se crea o conecta la base.

## Verificacion esperada

- Evidencia de recursos Azure sin secretos.
- Confirmacion de que no hay secretos en git.
- Health/config esperado para que Backend/API conecte en tarea posterior.

## Dependencia

Bloqueada hasta `TASK-072`, `TASK-073` y autorizacion explicita de Proyecto/PO para crear Azure SQL.
