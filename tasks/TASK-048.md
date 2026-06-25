# TASK-048 - Preparar tooling minimo local sin reformat masivo

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Infra
Prioridad: P1 pre-lanzamiento

## Contexto

QA aprobo SQL local en `TASK-045`, PO aprobo MVP SQL local en `TASK-047` y el baseline local esta versionado. Segun `docs/PROYECTO_TOOLING_ADOPTION.md`, el siguiente paso puede ser preparar tooling minimo dentro del repo, sin reformat masivo ni cloud/deploy.

## Objetivo

Agregar tooling minimo de calidad local con ESLint/Prettier y scripts de checks comunes, cuidando no mezclar cambios funcionales ni reformatear todo el repo.

## Alcance

- Revisar `docs/PROYECTO_TOOLING_ADOPTION.md`.
- Confirmar `git status --short --branch` antes de tocar archivos.
- Instalar o configurar solo ESLint/Prettier si no existen.
- Agregar scripts locales de check sin romper `node --test` actual.
- Configurar exclusiones para `tmp/`, logs, `node_modules`, artefactos locales y secretos.
- Ejecutar checks basicos posibles.
- Documentar comandos en README o doc de tooling existente.

## Fuera de alcance

- No reformat masivo.
- No instalar Playwright/axe.
- No usar SWA CLI.
- No crear recursos Azure.
- No conectar Azure SQL.
- No hacer deploy.
- No cambiar funcionalidad del POS.
- No guardar passwords, connection strings ni secretos.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/ESTADO_OPERATIVO.md`
- `docs/CURRENT_BLOCKERS.md`
- `docs/PROYECTO_TOOLING_ADOPTION.md`
- `tasks/TASK-045-HANDOFF.md`
- `tasks/TASK-047-HANDOFF.md`
- `api/package.json`

## Dependencia

- Liberada por `TASK-047`.

## Criterios de aceptacion

- [x] Tooling minimo queda configurado o se documenta bloqueo claro.
- [x] `node --test` en `api/` sigue pasando.
- [x] Hay scripts claros para lint/format check o se documenta por que no aplican.
- [x] No hay reformat masivo.
- [x] No se instala Playwright/axe/SWA.
- [x] No se crean recursos Azure.
- [x] No se conecta Azure SQL.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- `git status --short --branch` antes y despues.
- `node --test` en `api/`.
- Scripts de tooling agregados, si aplican.
- Busqueda de secretos en archivos cambiados.

## Handoff esperado

Crear o actualizar `tasks/TASK-048-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
