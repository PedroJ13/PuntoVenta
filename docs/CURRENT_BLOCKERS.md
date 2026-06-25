# Current Blockers

Bloqueos activos del proyecto. Mantener corto: bloqueo, responsable, siguiente accion y evidencia.

## Activos

| Bloqueo | Responsable | Siguiente accion | Evidencia |
| --- | --- | --- | --- |
| Azure SQL pausado | Proyecto/PO | Mantener fuera del primer deploy; requiere tarea explicita futura | `docs/FIRST_DEPLOY_DECISION_PACKAGE.md` |
| Push cierre pilot pendiente | Ejecucion Tecnica / Infra | Ejecutar `TASK-067` con aprobacion explicita para `git push origin main` | `tasks/TASK-066-HANDOFF.md` |

## Resueltos recientes

| Bloqueo | Resolucion | Evidencia |
| --- | --- | --- |
| Baseline local/Git sin consolidar | Commit `e22521f Add PuntoVenta MVP local baseline`; arbol limpio al revisar estado | `git status --short --branch` |
| PO Test MVP SQL local pendiente | PO aprobo `TASK-047` en este hilo | `tasks/TASK-047-HANDOFF.md` |
| Tooling minimo pendiente | `TASK-048` preparo ESLint/Prettier sin reformat masivo; `npm run check` pasa | `tasks/TASK-048-HANDOFF.md` |
| Paquete de decision de primer deploy pendiente | `TASK-050` dejo opciones A/B/C documentadas sin crear recursos | `tasks/TASK-050-HANDOFF.md`, `docs/FIRST_DEPLOY_DECISION_PACKAGE.md` |
| Decision de primer deploy pendiente | Proyecto/PO eligio A+B: Web estatica + API, sin Azure SQL | `docs/FIRST_DEPLOY_DECISION_PACKAGE.md` |
| Adaptacion API a Azure Functions pendiente | `TASK-051` entrego estructura compatible y checks locales pasando | `tasks/TASK-051-HANDOFF.md` |
| Recursos pilot Web/API pendientes | `TASK-052` creo recursos Azure pilot Web/API sin Azure SQL | `tasks/TASK-052-HANDOFF.md` |
| Configuracion deploy Web/API pendiente | `TASK-053` creo workflows/config y settings sin secrets en repo | `tasks/TASK-053-HANDOFF.md` |
| Configuracion Web pilot API base pendiente | `TASK-055` configuro resolucion de API base publicada sin secrets | `tasks/TASK-055-HANDOFF.md` |
| Diagnostico de deploy Web pilot pendiente | `TASK-056` documento bloqueo de GitHub/SWA/HTTP y siguiente ruta por Actions | `tasks/TASK-056-HANDOFF.md` |
| Cambios deploy pilot sin publicar | `TASK-057` creo commit `00c726c` y publico `main` en GitHub | `tasks/TASK-057-HANDOFF.md` |
| Intento Actions pilot pendiente | `TASK-058` confirmo workflows en remoto y bloqueo por `gh` invalido/herramientas disponibles | `tasks/TASK-058-HANDOFF.md` |
| Web/API publicos no verificables | `TASK-059` valido Web y API health con `HTTP 200`; API reporta SQL no configurado | `tasks/TASK-059-HANDOFF.md` |
| GitHub Actions no ejecutable desde esta sesion | `TASK-059` ejecuto workflows con `gh` autenticado; fallaron por secrets faltantes | `tasks/TASK-059-HANDOFF.md` |
| Secrets GitHub Actions pilot faltantes | `TASK-060` configuro secrets sin exponer valores; Web workflow quedo exitoso | `tasks/TASK-060-HANDOFF.md` |
| Web pipeline pilot no reproducible | `TASK-060` dejo `PuntoVenta Web Pilot` exitoso | `tasks/TASK-060-HANDOFF.md` |
| API pipeline pilot no reproducible | `TASK-061` dejo `PuntoVenta API Pilot` exitoso con SCM temporal y FTP deshabilitado | `tasks/TASK-061-HANDOFF.md` |
| QA publicado bloqueado | `TASK-061` dejo Web/API workflows exitosos y endpoints publicos `HTTP 200`; se libera `TASK-062` | `tasks/TASK-061-HANDOFF.md` |
| QA publicado pendiente | `TASK-062` aprobo Web/API pilot sin P0/P1; quedan observaciones P2 | `tasks/TASK-062-HANDOFF.md` |
| SCM basic publishing temporal en pilot | `TASK-063` migro API deploy a OIDC/RBAC, elimino publish profile del environment y dejo `scm allow:false`, `ftp allow:false` | `tasks/TASK-063-HANDOFF.md` |
| CORS amplio en API pilot | `TASK-064` confirmo CORS efectiva restringida al origen Web pilot; origen externo no recibe header permitido y preflight externo retorna `400` | `tasks/TASK-064-HANDOFF.md` |
| QA SQL local aun no aprobada | `TASK-045` aprobo el smoke SQL local corregido sin P0/P1 abiertos | `tasks/TASK-045-HANDOFF.md` |
| Smoke SQL local excedia timeout de 120s y no dejaba evidencia final | `TASK-044` agrego smoke con puerto configurable, logs por fase y timeout SQL configurable; recomendado usar timeout externo minimo de 240s | `tasks/TASK-044-HANDOFF.md` |
