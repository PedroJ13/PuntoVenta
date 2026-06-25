# TASK-069 - Preparar paquete local de publicacion por patch o bundle

## Estado

Done

## Nombre del Equipo

Ejecucion Tecnica

## Modo

Infra

## Nombre de la tarea

TASK-069 - Preparar paquete local de publicacion por patch o bundle

## Handoff esperado

Al finalizar, debe crear o actualizar `tasks/TASK-069-HANDOFF.md` usando el formato de handoff indicado.

## Contexto

`TASK-068` confirmo que `git push origin main` sigue bloqueado por politica del entorno. `docs/GIT_PUSH_DEPLOY_BLOCKER_GUIDE.md` indica que, si Codex no puede empujar a GitHub por politica/red/remoto no confiable, no se debe forzar el bypass ni pegar tokens. El camino permitido es dejar el repo listo y usar un canal autorizado.

Como siguiente salida operativa, preparar un paquete local transportable por patch o bundle para que Ejecucion Tecnica / Infra pueda publicarlo desde un destino/canal permitido por politica.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/ESTADO_OPERATIVO.md`
- `docs/CURRENT_BLOCKERS.md`
- `docs/GIT_PUSH_DEPLOY_BLOCKER_GUIDE.md`
- `tasks/TASK-068-HANDOFF.md`

## Objetivo

Preparar un paquete local de publicacion con los commits pendientes de `origin/main..HEAD`, usando patch o bundle, y dejar evidencia clara para transporte/publicacion desde un canal permitido.

## Alcance

- Revisar estado Git:
  - `git status --short --branch`
  - `git log --oneline origin/main..HEAD`
  - `git remote -v`
- Confirmar si existen cambios sin commit antes de generar el paquete.
- Si hay cambios documentales de cierre pendientes y pertenecen al alcance, crear commit local antes del paquete.
- Crear carpeta `.handoff/` si no existe.
- Generar al menos uno de estos paquetes, segun convenga:
  - `.handoff/puntoventa-release.patch`
  - `.handoff/puntoventa-release.bundle`
- Documentar desde que base se genero el paquete y que commits contiene.
- No intentar `git push origin main` si la politica ya lo bloquea en este canal.
- Crear o actualizar `tasks/TASK-069-HANDOFF.md`.

## Fuera de alcance

- No crear ni usar Azure SQL.
- No modificar infraestructura Azure.
- No cambiar workflows.
- No hacer QA funcional completa.
- No crear features nuevas.
- No pegar tokens, publish profiles, passwords o connection strings.
- No cambiar el remoto para esquivar controles.
- No intentar rodear restricciones de politica del entorno.

## Criterios de aceptacion

- [x] Estado Git y commits pendientes quedan documentados.
- [x] Patch o bundle queda generado en `.handoff/`, o bloqueo exacto documentado.
- [x] El handoff indica base, commits incluidos y ruta del paquete generado.
- [x] No se exponen secretos.
- [x] No se crea ni usa Azure SQL.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- `git status --short --branch`
- `git log --oneline origin/main..HEAD`
- Verificacion de existencia del archivo generado en `.handoff/`
- `git diff --check` si se crea o modifica documentacion
- Busqueda textual de secretos si se crea commit adicional o paquete nuevo
