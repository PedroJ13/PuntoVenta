# TASK-006 - Handoff

Equipo: Ejecucion Tecnica
Modo de ejecucion: Infra
Tarea completada: Definir plan inicial de infraestructura Azure.

Archivos cambiados:

- `docs/AZURE_INFRA_PLAN.md`
- `docs/ARCHITECTURE.md`
- `docs/README.md`
- `docs/TASK_BOARD.md`
- `tasks/TASK-006.md`
- `tasks/TASK-006-HANDOFF.md`

Verificacion ejecutada:

- Revision documental de `TASK-006`, `docs/ARCHITECTURE.md`, `docs/MVP_RELEASE_STATUS.md`, `docs/TASK_BOARD.md`, `docs/DEFINICION_PROYECTO.md` y `docs/PULSO_A_PROYECTO_PROTOTIPO_APROBADO.md`.
- Revision de guias `C:\Work\azure-infra-templates\WEB_AZURE_STATIC_APPS_FUNCTIONS.md` y `C:\Work\azure-infra-templates\AZURE_SQL_DATABASE.md`.
- Busqueda local para confirmar que no se agregaron secretos ni connection strings reales.
- No se ejecutaron comandos `az`, `swa`, `func`, deploy, migraciones ni creacion de recursos.

Resultado:

- Plan Azure inicial documentado en `docs/AZURE_INFRA_PLAN.md`.
- Frontend recomendado: Azure Static Web Apps con `app/` como app location.
- API recomendada: Azure Functions HTTP separada, carpeta futura `api/`.
- Deploy recomendado: GitHub Actions separados para frontend y API.
- Secretos definidos fuera del repo: GitHub Secrets, Azure Function App Settings, `api/local.settings.json` ignorado y `local-secrets/` ignorado.
- Azure SQL recomendado como serverless/bajo costo para piloto, apagado por defecto y solo usado bajo tareas aprobadas.
- `docs/ARCHITECTURE.md` actualizado para enlazar el plan y reflejar decisiones iniciales.

Uso DB cloud: No
Uso Azure SQL: No
Motivo: tarea de diseno Infra; no habia autorizacion para crear recursos, conectar DB ni aplicar migraciones.
Alcance: documentacion de plan, nombres, estrategia de deploy, secretos y guardrails.
Recursos Azure creados: No
Deploy ejecutado: No
Secretos creados o expuestos: No

Riesgos o pendientes:

- Falta confirmar region Azure final y tenant/suscripcion antes de provisionar.
- Falta tarea explicita de provisionamiento si Proyecto decide crear recursos.
- Falta tarea explicita para workflow API cuando exista `api/`.
- Falta tarea explicita de migracion Azure SQL antes de ejecutar el schema.

Siguiente recomendado:

- Proyecto procesa este handoff.
- Cuando corresponda, crear tarea separada para provisionar Azure o para workflows de deploy.

Movimiento de tablero:

- De: Ready
- A: Needs Review
