# TASK-074 - Provisionar Azure SQL pilot y configurar acceso seguro

## Estado

Needs Review

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
- `C:\Work\azure-infra-templates\AZURE_SQL_DATABASE.md`

## Objetivo

Crear Azure SQL pilot con configuracion minima y segura para persistencia real, sin exponer secretos y sin usar credenciales admin para runtime.

## Alcance

- Confirmar suscripcion, tenant, region y resource group pilot.
- Crear o validar Azure SQL Server y Azure SQL Database pilot si estan autorizados.
- Configurar guardrails de costo minimo para pilot segun `C:\Work\azure-infra-templates\AZURE_SQL_DATABASE.md`:
  - preferir serverless si aplica;
  - max vCores bajo, por ejemplo `1` si alcanza;
  - min capacity bajo, por ejemplo `0.5` si esta disponible;
  - auto-pause en el minimo permitido;
  - documentar cualquier setting que pueda generar costo fuera de cuota gratis.
- Preparar usuario runtime de permisos minimos o mecanismo equivalente.
- Configurar secrets/runtime settings en Function App sin escribir valores en repo.
- Documentar recursos creados, configuracion y costos esperados.
- Usar reglas firewall temporales estrechas solo si son necesarias, retirarlas al final y verificar retiro.

## Fuera de alcance

- No modificar Web.
- No cambiar codigo API.
- No ejecutar QA funcional completa.
- No guardar connection strings o passwords en archivos.
- No usar datos reales.
- No abrir reglas firewall permanentes innecesarias.
- No despertar Azure SQL para tareas visuales, copy, responsive, QA repetitivo o desarrollo normal.

## Criterios de aceptacion

- [x] Azure SQL pilot creado o bloqueo exacto documentado.
- [x] Configuracion de costo minimo aplicada o excepcion justificada.
- [x] Runtime access configurado con permisos minimos o plan claro.
- [x] Secrets/config aplicados fuera del repo o bloqueo documentado.
- [x] Firewall temporal retirado y verificado si se uso.
- [x] Costos/guardrails documentados.
- [x] Handoff indica `Uso Azure SQL: Si` si se crea o conecta la base.

## Verificacion esperada

- Evidencia de recursos Azure sin secretos.
- Evidencia de SKU/serverless/auto-pause/costo minimo.
- Confirmacion de que no hay secretos en git.
- Confirmacion de firewall temporal creado/retirado o `No aplica`.
- Health/config esperado para que Backend/API conecte en tarea posterior.

## Dependencia

Liberada por autorizacion explicita del usuario. `TASK-072` y `TASK-073` estan cerradas.
