# TASK-068 - Publicar cierre pilot desde canal permitido

## Estado

Assigned

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Infra
Prioridad: P2 recomendable

## Contexto

`TASK-067` documento que los commits locales de cierre pilot existen, pero `git push origin main` fue rechazado por politica del entorno. El bloqueo no es tecnico del repo ni del pilot; es una restriccion del canal actual para publicar a un remoto externo compartido.

El pilot Web/API ya esta operativo como baseline sin Azure SQL:

- API deploy OIDC/RBAC funcionando.
- CORS pilot restringido al origen Web publicado.
- SCM/FTP basic publishing apagados.
- Azure SQL fuera del primer deploy.

## Objetivo

Publicar los commits locales pendientes de cierre pilot en `origin/main` usando un canal permitido, o dejar bloqueo actualizado si el canal usado tampoco permite la publicacion.

## Alcance

- Leer el estado actual del repo.
- Confirmar commits pendientes con:
  - `git status --short --branch`
  - `git log --oneline origin/main..HEAD`
- Publicar los commits pendientes en `origin/main` solo si el canal/herramienta usada lo permite.
- Verificar despues de publicar:
  - `git status --short --branch`
  - `git log --oneline origin/main..HEAD`
  - estado remoto/local alineado o diferencia pendiente clara.
- Si la publicacion dispara workflows, registrar si se observa algun run relevante, sin abrir debugging amplio salvo fallo evidente de cierre pilot.
- Crear `tasks/TASK-068-HANDOFF.md`.

## Fuera de alcance

- No crear ni usar Azure SQL.
- No modificar infraestructura Azure.
- No cambiar workflows salvo que exista un bloqueo directamente causado por los commits de cierre y Proyecto lo autorice.
- No hacer QA funcional completa.
- No crear features nuevas.
- No intentar rodear restricciones de politica del entorno.
- No usar secretos ni pegar tokens, publish profiles, passwords o connection strings en archivos.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/ESTADO_OPERATIVO.md`
- `docs/CURRENT_BLOCKERS.md`
- `docs/PILOT_BASELINE_RUNBOOK.md`
- `tasks/TASK-067-HANDOFF.md`

## Dependencia

- Ejecutar despues de `TASK-067`.
- Requiere canal permitido para publicar a `origin/main`.

## Criterios de aceptacion

- [ ] Commits locales de cierre pilot quedan publicados en `origin/main`, o bloqueo exacto queda documentado.
- [ ] Estado local/remoto posterior queda documentado.
- [ ] No se exponen secretos.
- [ ] No se crea ni usa Azure SQL.
- [ ] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- `git status --short --branch`.
- `git log --oneline origin/main..HEAD`.
- Evidencia de push exitoso o bloqueo.
- Si aplica, referencia corta a workflow run observado despues del push.

## Handoff esperado

Crear `tasks/TASK-068-HANDOFF.md` con:

- resultado: publicado, bloqueado o parcial;
- commits publicados o pendientes;
- estado local/remoto final;
- evidencia de push o bloqueo;
- uso de Azure SQL declarado;
- secretos: confirmar que no se expusieron;
- siguiente recomendado.
