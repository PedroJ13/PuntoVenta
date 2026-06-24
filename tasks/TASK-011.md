# TASK-011 - Implementar auth fake y endpoint me

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Prioridad: MVP bloqueante

## Contexto

`TASK-007` creo el scaffold local de API y `TASK-009` definio autenticacion y permisos MVP. Falta una capa fake/local para que la API pueda probar contexto de usuario, permisos y aislamiento por empresa sin proveedor real ni Azure.

## Objetivo

Implementar middleware de autenticacion fake para desarrollo local y endpoint `GET /api/me`, con tests unitarios.

## Alcance

- Crear middleware o helper que inyecte contexto fake de usuario autenticado.
- Implementar `GET /api/me` con usuario, roles, permisos y `companyId`.
- Agregar tests para respuesta exitosa.
- Agregar tests para `UNAUTHORIZED` y/o `FORBIDDEN` donde aplique.
- Documentar uso local en `api/README.md`.
- Mantener la estructura compatible con autenticacion real futura.

## Fuera de alcance

- No implementar login real.
- No crear usuarios reales.
- No configurar OAuth, Azure Entra, B2C ni proveedores externos.
- No conectar Azure SQL.
- No crear secretos ni `local.settings.json`.
- No implementar todos los guards de permisos del MVP.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/TASK_BOARD.md`
- `docs/AUTH_PERMISSIONS.md`
- `docs/API_CONTRACTS.md`
- `api/README.md`
- `tasks/TASK-007-HANDOFF.md`
- `tasks/TASK-009-HANDOFF.md`

## Dependencia

- Liberada por `TASK-007` y `TASK-009`.

## Criterios de aceptacion

- [x] Existe endpoint `GET /api/me`.
- [x] La API puede construir contexto fake con `companyId`, `userId`, roles y permisos.
- [x] Hay tests locales para el endpoint y casos de autorizacion basicos.
- [x] No hay dependencia de Azure SQL ni secretos reales.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Ejecutar tests locales de `api/`.
- Buscar patrones de secretos en archivos cambiados.
- Confirmar que no se crearon recursos Azure.

## Handoff esperado

Crear o actualizar `tasks/TASK-011-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
