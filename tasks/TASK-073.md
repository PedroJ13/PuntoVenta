# TASK-073 - Preparar migraciones Azure SQL revisables para pilot

## Estado

Done

## Nombre del Equipo

Ejecucion Tecnica

## Modo

SQL DEV/Data

## Nombre de la tarea

TASK-073 - Preparar migraciones Azure SQL revisables para pilot

## Handoff esperado

Al finalizar, debe crear o actualizar `tasks/TASK-073-HANDOFF.md` usando el formato de handoff indicado.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/DATA_MODEL.md`
- `docs/SQL_SERVER_EXPRESS_LOCAL.md`
- `docs/QA_SQL_LOCAL_TECH_PACKAGE.md`
- `tasks/TASK-045-HANDOFF.md`
- `tasks/TASK-047-HANDOFF.md`
- `tasks/TASK-072-HANDOFF.md`

## Objetivo

Preparar el paquete de migraciones y seeds ficticios para ejecutar en Azure SQL pilot cuando Infra habilite la base, manteniendo compatibilidad con SQL Server/Azure SQL.

## Alcance

- Revisar migraciones existentes.
- Confirmar compatibilidad con Azure SQL.
- Preparar ajustes no destructivos si hacen falta.
- Preparar seeds ficticios minimos para pilot si se aprueban en `TASK-072`.
- Documentar orden de ejecucion y precondiciones.
- Documentar rollback o mitigacion para errores de migracion.

## Fuera de alcance

- No crear Azure SQL.
- No conectarse a Azure SQL.
- No ejecutar migraciones en cloud.
- No cambiar API/Web.
- No guardar secretos.
- No usar datos reales de clientes.

## Criterios de aceptacion

- [x] Migraciones revisadas para Azure SQL.
- [x] Seeds ficticios definidos o decision de no incluirlos documentada.
- [x] Orden de ejecucion documentado.
- [x] Riesgos de datos/tenant/integridad documentados.
- [x] Handoff indica si se uso Azure SQL.

## Verificacion esperada

- Validacion estatica de scripts.
- Checks locales disponibles si aplican.
- Handoff con lista exacta de scripts preparados.

## Dependencia

Liberada por Proyecto tras procesar `TASK-072`. Sigue fuera de alcance crear, conectar o usar Azure SQL.
