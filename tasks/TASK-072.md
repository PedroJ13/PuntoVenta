# TASK-072 - Definir decision y plan de persistencia real cloud

## Estado

Needs Review

## Nombre del Equipo

Ejecucion Tecnica

## Modo

Infra

## Nombre de la tarea

TASK-072 - Definir decision y plan de persistencia real cloud

## Handoff esperado

Al finalizar, debe crear o actualizar `tasks/TASK-072-HANDOFF.md` usando el formato de handoff indicado.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/ESTADO_OPERATIVO.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/FIRST_DEPLOY_DECISION_PACKAGE.md`
- `docs/AZURE_INFRA_PLAN.md`
- `docs/DATA_MODEL.md`
- `docs/SQL_SERVER_EXPRESS_LOCAL.md`
- `docs/PILOT_BASELINE_RUNBOOK.md`
- `tasks/TASK-071-HANDOFF.md`

## Objetivo

Preparar la decision tecnica y operativa para pasar del storage `fake` publicado a persistencia real cloud, sin crear recursos ni modificar Azure todavia.

## Alcance

- Revisar estado actual del pilot Web/API sin Azure SQL.
- Proponer alcance minimo de persistencia real para la siguiente fase.
- Confirmar si la ruta recomendada sigue siendo Azure SQL pilot.
- Identificar recursos, secretos y permisos que harian falta.
- Definir orden seguro de ejecucion:
  - migraciones revisables;
  - provisionamiento Azure SQL;
  - secrets/config runtime;
  - conexion API;
  - smoke tecnico;
  - QA publicado;
  - PO Test.
- Identificar riesgos de costo, seguridad, rollback y datos.
- Dejar recomendacion clara: avanzar, ajustar alcance o mantener fake por ahora.

## Fuera de alcance

- No crear Azure SQL.
- No modificar Azure, GitHub Actions, secrets ni infraestructura.
- No ejecutar migraciones.
- No conectar API a SQL cloud.
- No cambiar codigo.
- No guardar tokens, passwords, connection strings ni secretos.

## Criterios de aceptacion

- [x] Decision/recomendacion clara para persistencia real cloud.
- [x] Alcance minimo de Azure SQL pilot definido o alternativa justificada.
- [x] Orden de tareas siguientes validado.
- [x] Riesgos y guardrails documentados.
- [x] Confirma que no se creo ni uso Azure SQL.
- [x] Handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Handoff con recomendacion y secuencia de tareas.
- Lista de recursos/secrets necesarios sin valores sensibles.
- Confirmacion explicita de que no se modifico cloud.
- Siguiente accion recomendada para Proyecto.
