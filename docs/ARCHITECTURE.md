# Architecture

## Arquitectura inicial

- Frontend: Azure Static Web Apps previsto; app base estatica en `app/`.
- Backend/API: Azure Functions HTTP previsto; carpeta futura `api/`.
- Base de datos: Azure SQL Database previsto para piloto/MVP con costo controlado.
- Cloud/hosting: Azure, segun `docs/AZURE_INFRA_PLAN.md`.
- Auth: permisos MVP definidos en `docs/AUTH_PERMISSIONS.md`; proveedor de autenticacion pendiente de decision.

## Principios

- Mantener MVP pequeno.
- Persistir datos si el proyecto sera piloto real o produccion.
- Validar reglas importantes server-side.
- No exponer secretos en frontend.
- Separar responsabilidades por equipo/chat.

## Ambientes

- Local: desarrollo.
- Pilot: ambiente inicial recomendado para validacion controlada.
- Staging: opcional, solo si QA publicado debe separarse de produccion.
- Production: posterior al piloto.

## Infraestructura Azure

Plan inicial:

- `docs/AZURE_INFRA_PLAN.md`

Reglas:

- No crear recursos Azure sin tarea explicita.
- No guardar secretos en el repositorio.
- No usar Azure SQL para tareas visuales, frontend, copy, responsive o QA repetitivo.
- Azure SQL se usa solo para migraciones aprobadas, smoke final, bugs reales de Azure o verificacion puntual de Infra/secretos.

## Pendientes de arquitectura

- Decision de proveedor real de autenticacion.
- Provisionamiento real de Azure.
- Workflows reales de deploy.
- Migracion Azure SQL aprobada.
- Observabilidad/logs implementados.

