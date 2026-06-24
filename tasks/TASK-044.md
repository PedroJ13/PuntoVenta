# TASK-044 - Diagnosticar timeout de smoke SQL local QA

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Prioridad: P1 pre-lanzamiento

## Contexto

`TASK-043` quedo bloqueada en QA porque el smoke integrado app/API/SQL local no completo: el puerto `7071` estaba ocupado, el reintento en `7072` excedio timeout y diagnosticos posteriores tambien quedaron colgados. QA no pudo confirmar `storageDetails=sql-local` ni completar los flujos de venta/cuenta/reportes.

## Objetivo

Diagnosticar y corregir el bloqueo operativo del smoke SQL local para que QA pueda reintentar `TASK-043` con evidencia completa.

## Alcance

- Revisar el handoff de `TASK-043` y reproducir el bloqueo si el ambiente lo permite.
- Identificar si el timeout viene de puertos ocupados, proceso API colgado, cliente SQL local, script smoke o combinacion.
- Dejar un camino reproducible para ejecutar el smoke en puerto configurable sin depender de `7071`.
- Agregar logs, timeouts o pasos de diagnostico suficientes para que un nuevo cuelgue indique en que fase fallo.
- Confirmar health/storage SQL local para catalogo, cuentas abiertas, caja diaria, ventas y reportes si el ambiente local lo permite.
- Mantener fallback fake y contrato API existentes.

## Fuera de alcance

- No ejecutar QA formal.
- No crear recursos Azure.
- No conectar Azure SQL.
- No hacer deploy.
- No guardar passwords, connection strings ni secretos.
- No modificar reglas funcionales del POS salvo correccion tecnica indispensable para desbloquear el smoke.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/TASK_BOARD.md`
- `tasks/TASK-043-HANDOFF.md`
- `tasks/TASK-043.md`
- `docs/QA_SQL_LOCAL_TECH_PACKAGE.md`
- `docs/SMOKE_LOCAL_APP_API_SQL.md`
- `docs/API_CONTRACTS.md`
- `api/README.md`

## Dependencia

- Liberada por bloqueo de `TASK-043`.

## Criterios de aceptacion

- [x] Se identifica causa probable del timeout o se reduce a un punto diagnostico concreto.
- [x] Existe un comando/proceso reproducible para smoke SQL local en puerto configurable.
- [x] El smoke deja evidencia clara por fase: health, catalogo, caja, venta, cuenta, reportes y Web/modulos si aplica.
- [x] Si el ambiente lo permite, se confirma `storageDetails=sql-local` para catalogo, cuentas, caja, ventas y reportes.
- [x] No se guardan connection strings ni secretos reales.
- [x] No se conecta Azure SQL.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Ejecutar tests locales de `api/`.
- Ejecutar smoke SQL local corregido o diagnostico equivalente.
- Buscar secretos en archivos cambiados.
- Confirmar que no se conecto Azure SQL ni se crearon recursos Azure.

## Handoff esperado

Crear o actualizar `tasks/TASK-044-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
