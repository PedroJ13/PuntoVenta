# Estado operativo

Fuente corta y viva para que Proyecto, QA, Pulso y Ejecucion Tecnica sepan que esta activo ahora.

Regla: mantener maximo 3 items en `Ahora`. La historia larga queda en `docs/MVP_RELEASE_STATUS.md`, `docs/BACKLOG.md` y handoffs.

## Ahora

- `TASK-081` asignada a PO Test: revisar plantilla/checklist y definir si existe fuente real inicial aprobable.
- `TASK-084` bloqueada: commit local listo, push a GitHub rechazado por politica del entorno.
- API deploy OIDC/RBAC funcionando; CORS pilot restringido; SCM/FTP basic publishing apagados.

## Siguiente

- Esperar `TASK-081-HANDOFF.md`.
- Publicar el commit local pendiente (`HEAD`) desde canal permitido externo a esta sesion, luego reintentar validacion publicada.
- Mantener datos reales fuera hasta aprobar archivo/fuente completado y abrir tarea explicita de scripts o carga.

## Bloqueado

- `TASK-084`: `git push origin main` rechazado por politica de exfiltracion del entorno; requiere canal permitido externo a esta sesion.

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
- `TASK-072`: decision/plan recomienda Azure SQL pilot con tareas separadas y autorizacion explicita antes de provisionar.
- `TASK-073`: paquete revisable de migraciones/seeds para Azure SQL pilot preparado sin ejecucion cloud.
- `TASK-074`: Azure SQL pilot provisionado con serverless bajo y connection string en Function App sin activar SQL runtime.
- `TASK-077`: auto-pause Azure SQL ajustado a 15 min, locks `CanNotDelete` confirmados y TLS/PITR documentados.
- `TASK-075`: API pilot conectada a Azure SQL; migraciones/seed demo ejecutados y smoke publicado paso con `sqlAvailable=true`.
- `TASK-076`: QA publicado Web/API con persistencia Azure SQL aprobado sin P0/P1.
- `TASK-078`: PO aprueba pilot publicado con persistencia Azure SQL.
- `TASK-079`: plan de carga inicial de datos reales preparado; recomienda tenant real separado del demo.
- `TASK-080`: plantilla XLSX de carga inicial real y checklist de validacion preparados; no se cargo data real.
- `TASK-082`: health cold start ajustado para refrescar disponibilidad SQL antes de responder.
- `TASK-083`: runbook baseline pilot actualizado para Azure SQL activo.
- Baseline local versionado en commit `e22521f Add PuntoVenta MVP local baseline`.

## Decision necesaria

- PO debe aprobar/corregir `docs/templates/puntoventa_carga_inicial_real_template.xlsx` y confirmar si la fuente real estara lista fuera del repo.
