# TASK-041 - Preparar smoke tecnico local app API SQL

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Prioridad: P1 pre-lanzamiento

## Contexto

Despues de conectar API y Web al camino SQL local opcional, falta un smoke tecnico reproducible para levantar app/API, usar SQL Server Express local y validar el recorrido operativo principal antes de pasarlo a QA.

## Objetivo

Crear o documentar un smoke tecnico local reproducible para catalogo, caja diaria, venta/cobro, cuenta abierta y reportes usando SQL Server Express local.

## Alcance

- Documentar pasos de preparacion local sin secretos.
- Incluir comandos o scripts existentes para migraciones/seeds si aplican.
- Validar health, catalogo, apertura de caja, venta rapida, cuenta abierta/cobro y reportes.
- Registrar limitaciones o pasos manuales necesarios.
- Mantener evidencia suficiente para que QA replique.

## Fuera de alcance

- No crear recursos Azure.
- No conectar Azure SQL.
- No automatizar deploy.
- No guardar passwords, connection strings ni secretos.
- No hacer validacion QA formal.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/TASK_BOARD.md`
- `docs/SQL_SERVER_EXPRESS_LOCAL.md`
- `tasks/TASK-033-HANDOFF.md`
- `tasks/TASK-034-HANDOFF.md`
- `tasks/TASK-038-HANDOFF.md`
- `tasks/TASK-039-HANDOFF.md`
- `tasks/TASK-040-HANDOFF.md`
- `api/README.md`

## Dependencia

- Ejecutar despues de completar `TASK-040`.

## Criterios de aceptacion

- [x] Existe smoke tecnico local documentado o scriptado.
- [x] Smoke cubre catalogo, caja diaria, venta/cobro, cuentas abiertas y reportes.
- [x] Smoke no requiere secretos guardados en repo.
- [x] Evidencia permite a QA replicar el flujo.
- [x] No se conecta Azure SQL.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Ejecutar el smoke tecnico local si el entorno lo permite.
- Ejecutar tests locales relevantes.
- Buscar secretos en archivos cambiados.
- Confirmar que no se conecto Azure SQL ni se crearon recursos Azure.

## Handoff esperado

Crear o actualizar `tasks/TASK-041-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
