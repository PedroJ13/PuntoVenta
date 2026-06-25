# TASK-064 - Restringir CORS API pilot a Web publicada

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Infra
Prioridad: P2 recomendable

## Contexto

`TASK-063` migro el deploy API pilot a OIDC/RBAC, elimino el publish profile del environment y dejo `basicPublishingCredentialsPolicies/scm allow:false` y `ftp allow:false`. `TASK-062` aprobo QA publicado con observacion P2: CORS amplio de compatibilidad MVP permanece como riesgo tecnico.

## Objetivo

Restringir CORS del API pilot al origen Web publicado, manteniendo Web/API funcionales y sin Azure SQL.

## Alcance

- Identificar configuracion CORS efectiva de la Function App/API pilot.
- Restringir origen permitido a `https://gray-beach-00a0f870f.7.azurestaticapps.net`.
- Mantener fuera cualquier origen innecesario para pilot.
- Validar que Web publicada sigue consumiendo API publicada.
- Validar API health publica.
- Confirmar que no se crea ni usa Azure SQL.
- Documentar cualquier excepcion necesaria para desarrollo local si aplica.

## Fuera de alcance

- No crear Azure SQL.
- No migrar datos.
- No cambiar flujos funcionales del POS.
- No modificar OIDC/RBAC salvo que sea necesario por CORS.
- No exponer secretos.
- No hacer QA funcional completo.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `tasks/TASK-062-HANDOFF.md`
- `tasks/TASK-063-HANDOFF.md`
- `docs/PILOT_DEPLOY_CONFIG.md`
- `.github/workflows/puntoventa-api-pilot.yml`

## Dependencia

- Ejecutar despues de `TASK-063`.

## Criterios de aceptacion

- [x] CORS pilot queda restringido al origen Web publicado, o bloqueo exacto documentado.
- [x] Web publicada sigue cargando y consumiendo API.
- [x] API health publica responde `HTTP 200`.
- [x] No se crea ni usa Azure SQL.
- [x] No se exponen secretos.
- [x] Queda recomendacion clara sobre si requiere QA ligero posterior.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Evidencia de configuracion CORS final.
- Checks HTTP no destructivos contra Web/API.
- Validacion desde navegador o equivalente de consumo Web -> API.
- Consulta Azure para confirmar ausencia de SQL.
- `git status --short --branch`.

## Handoff esperado

Crear o actualizar `tasks/TASK-064-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
