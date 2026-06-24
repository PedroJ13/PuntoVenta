# TASK-007 - Scaffold API local con tests

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Prioridad: MVP bloqueante

## Contexto

`TASK-004` dejo definido el contrato API MVP. El siguiente paso tecnico es crear la base local de `api/` con estructura, pruebas y dobles de repositorio, sin conectar Azure SQL ni implementar persistencia real.

## Objetivo

Crear un scaffold de API local verificable que permita empezar a implementar endpoints MVP con tests unitarios y repositorios falsos.

## Alcance

- Crear estructura inicial de `api/`.
- Definir runtime y scripts locales necesarios.
- Crear health/check basico o endpoint minimo de arranque.
- Agregar pruebas unitarias iniciales.
- Preparar dobles de repositorio o capa fake para no depender de Azure SQL.
- Documentar como ejecutar la API local y tests.

## Fuera de alcance

- No conectar Azure SQL.
- No aplicar migraciones.
- No crear recursos Azure.
- No implementar todos los endpoints MVP.
- No guardar secretos.
- No implementar autenticacion completa.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/TASK_BOARD.md`
- `docs/API_CONTRACTS.md`
- `docs/DATA_MODEL.md`
- `docs/ARCHITECTURE.md`
- `tasks/TASK-004-HANDOFF.md`

## Dependencia

- Liberada por `TASK-004`.

## Criterios de aceptacion

- [x] Existe carpeta `api/` con estructura inicial mantenible.
- [x] Hay scripts locales documentados para ejecutar tests.
- [x] Hay al menos una prueba unitaria ejecutable.
- [x] La API no depende de Azure SQL ni connection strings reales.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Ejecutar tests locales definidos por la tarea.
- Revisar que no existan secretos ni connection strings reales.
- Confirmar que no se crearon recursos Azure.

## Handoff esperado

Crear o actualizar `tasks/TASK-007-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
