# Estado operativo

Fuente corta y viva para que Proyecto, QA, Pulso y Ejecucion Tecnica sepan que esta activo ahora.

Regla: mantener maximo 3 items en `Ahora`. La historia larga queda en `docs/MVP_RELEASE_STATUS.md`, `docs/BACKLOG.md` y handoffs.

## Ahora

- `TASK-072` entregada: decision/plan recomienda Azure SQL pilot con autorizacion explicita posterior.
- API deploy OIDC/RBAC funcionando; CORS pilot restringido; SCM/FTP basic publishing apagados.
- Azure SQL sigue fuera del primer deploy.

## Siguiente

- Procesar handoff de `TASK-072`.
- Mantener Azure SQL fuera hasta autorizar `TASK-074` o tarea equivalente.

## Bloqueado

- No hay bloqueo activo de push de cierre pilot; publicacion remota validada por `TASK-070`.

## Hecho reciente

- `TASK-038`: API ventas/checkout con SQL local opcional.
- `TASK-039`: reportes MVP API con SQL local opcional.
- `TASK-040`: Web local ajustada para estados SQL del API.
- `TASK-041`: smoke tecnico local app/API/SQL documentado.
- `TASK-042`: paquete tecnico para QA SQL local.
- `TASK-044`: timeout de smoke SQL local diagnosticado y smoke corregido.
- `TASK-045`: QA SQL local aprobada sin P0/P1 abiertos.
- `TASK-046`: Pulso post QA SQL local recomienda PO Test antes de tooling/cloud.
- `TASK-047`: PO aprueba MVP SQL local.
- `TASK-048`: tooling minimo local preparado sin reformat masivo.
- `TASK-049`: preflight cloud deploy sin crear recursos.
- `TASK-050`: paquete de decision para primer deploy.
- `TASK-051`: API adaptada a estructura compatible con Azure Functions sin Azure SQL.
- `TASK-052`: recursos Azure pilot Web/API creados sin Azure SQL.
- `TASK-053`: deploy Web/API configurado sin secrets en repo.
- `TASK-055`: Web pilot configurada para resolver API base publicada sin secrets.
- `TASK-056`: bloqueo de deploy Web/HTTP publico diagnosticado; ruta recomendada GitHub Actions.
- `TASK-057`: cambios de deploy pilot commiteados y publicados en GitHub.
- `TASK-058`: workflows existen en remoto; ejecucion queda bloqueada por `gh` invalido/herramientas disponibles.
- `TASK-059`: workflows ejecutados y fallaron por secrets faltantes; Web/API publicos responden 200.
- `TASK-060`: secrets configurados; Web workflow exitoso; API workflow bloqueado por SCM basic publishing deshabilitado.
- `TASK-061`: SCM pilot temporal habilitado; API workflow exitoso; Web/API publicos responden 200.
- `TASK-062`: QA publicado Web/API aprobado con observaciones, sin P0/P1.
- `TASK-063`: API deploy migrado a OIDC/RBAC; SCM y FTP basic publishing apagados.
- `TASK-064`: CORS efectiva de API pilot restringida al origen Web publicado.
- `TASK-065`: baseline reproducible Web/API pilot documentado.
- `TASK-066`: commits locales de cierre pilot creados; push bloqueado por aprobacion explicita.
- `TASK-067`: intento de push documentado; bloqueo persiste por politica del entorno.
- `TASK-068`: intento directo de `git push origin main` desde canal disponible rechazado por politica del entorno.
- `TASK-069`: paquete local de publicacion generado como patch y bundle en `.handoff/`.
- `TASK-070`: publicacion remota validada; `origin/main` coincide con `0c8d2deb2245552c67e61968849a6135066c3d4e`; API workflow por push exitoso.
- `TASK-071`: PO aprueba pantalla de ventas publicada para demo/piloto funcional.
- Baseline local versionado en commit `e22521f Add PuntoVenta MVP local baseline`.

## Decision necesaria

- Autorizar o ajustar la ruta Azure SQL pilot propuesta por `TASK-072`; Azure SQL sigue sin crearse.
