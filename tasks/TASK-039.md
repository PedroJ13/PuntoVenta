# TASK-039 - Conectar reportes MVP API a SQL local

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Prioridad: P1 pre-lanzamiento

## Contexto

Despues de conectar ventas/checkout a SQL local por `TASK-038`, los reportes MVP deben poder leer ventas, pagos y cortes desde SQL Server Express local sin perder el fallback fake.

## Objetivo

Conectar los endpoints de reportes MVP a SQL local cuando este configurado, manteniendo el contrato actual y fallback fake.

## Alcance

- Leer ventas, lineas, pagos y caja diaria SQL para reportes MVP existentes.
- Mantener montos CRC enteros.
- Mantener filtros y respuestas compatibles con `docs/API_CONTRACTS.md`.
- Mantener fallback fake cuando SQL no este configurado o si SQL falla.
- Actualizar `GET /api/health` si corresponde para indicar modo de reportes sin secretos.
- Agregar tests para modo fake/fallback y modo SQL si el entorno local lo permite.

## Fuera de alcance

- No crear reportes nuevos.
- No modificar UI Web salvo ajuste menor indispensable y documentado.
- No crear recursos Azure.
- No conectar Azure SQL.
- No guardar passwords, connection strings ni secretos.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/TASK_BOARD.md`
- `docs/API_CONTRACTS.md`
- `docs/SQL_SERVER_EXPRESS_LOCAL.md`
- `tasks/TASK-022-HANDOFF.md`
- `tasks/TASK-023-HANDOFF.md`
- `tasks/TASK-037-HANDOFF.md`
- `tasks/TASK-038-HANDOFF.md`
- `api/README.md`

## Dependencia

- Ejecutar despues de completar `TASK-038`.

## Criterios de aceptacion

- [x] Reportes MVP leen desde SQL local cuando esta configurado.
- [x] Respuestas mantienen el contrato existente.
- [x] Montos se devuelven como CRC enteros.
- [x] API mantiene fallback fake sin SQL configurado o si SQL falla.
- [x] No se guardan connection strings ni secretos reales.
- [x] No se conecta Azure SQL.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Ejecutar tests locales de `api/`.
- Si SQL local esta disponible, poblar ventas/caja y validar reportes contra base local.
- Buscar secretos en archivos cambiados.
- Confirmar que no se conecto Azure SQL ni se crearon recursos Azure.

## Handoff esperado

Crear o actualizar `tasks/TASK-039-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
