# TASK-027 - Preparar base tecnica para SQL Server Express local

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: SQL DEV/Data
Prioridad: P1 pre-lanzamiento

## Contexto

El usuario va a avanzar con SQL Server Express local en su maquina. Antes de conectar la aplicacion o crear migraciones ejecutables, conviene dejar una base tecnica local documentada: convenciones, supuestos, nombres, seguridad, reset/dev seed y compatibilidad futura con Azure SQL.

## Objetivo

Documentar la preparacion tecnica para usar SQL Server Express local como ambiente de desarrollo, sin conectar aun la app ni crear recursos Azure.

## Alcance

- Definir convencion de instancia/base local sugerida sin guardar secretos.
- Definir estrategia de connection string local por variable de entorno.
- Definir criterios para scripts de migracion y seed local.
- Definir reglas de compatibilidad con Azure SQL.
- Definir precauciones de multiempresa/tenant desde el modelo de datos.
- Identificar cambios futuros necesarios en `docs/DATA_MODEL.md` o scripts SQL.

## Fuera de alcance

- No instalar SQL Server Express.
- No conectarse al SQL local del usuario.
- No crear base de datos real.
- No crear migraciones ejecutables todavia.
- No modificar API.
- No modificar app Web.
- No conectar Azure SQL.
- No crear recursos Azure.
- No guardar connection strings reales.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/TASK_BOARD.md`
- `docs/DATA_MODEL.md`
- `docs/AZURE_INFRA_PLAN.md`
- `tasks/TASK-002-HANDOFF.md`
- `tasks/TASK-006-HANDOFF.md`

## Dependencia

- Sin dependencias pendientes.

## Criterios de aceptacion

- [x] Queda documentado como preparar SQL Server Express local sin secretos.
- [x] Queda definida la estrategia de variable de entorno para connection string local.
- [x] Quedan definidos criterios para migraciones y seed local.
- [x] Quedan documentadas precauciones multiempresa/tenant.
- [x] Queda claro que no se conecto app/API a SQL local todavia.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Revisar que no haya secretos reales ni connection strings reales.
- Confirmar que no se crearon recursos Azure.
- Confirmar que la tarea deja insumos suficientes para una tarea posterior de migraciones SQL.

## Handoff esperado

Crear o actualizar `tasks/TASK-027-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
