# TASK-042 - Preparar paquete tecnico para QA SQL local

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Prioridad: P1 pre-lanzamiento

## Contexto

Antes de enviar a QA la integracion SQL local completa, Ejecucion Tecnica debe dejar un paquete claro con endpoints, datos, pasos, limitaciones y evidencia para evitar que QA tenga que reconstruir el contexto desde multiples handoffs.

## Objetivo

Consolidar el paquete tecnico de entrega para QA de la integracion SQL local del MVP.

## Alcance

- Resumir componentes SQL locales ya conectados: catalogo, cuentas abiertas, caja diaria, ventas/checkout y reportes.
- Listar endpoints principales para QA.
- Listar pasos de setup local sin secretos.
- Listar datos ficticios o seeds esperados.
- Listar limitaciones conocidas y casos fuera de alcance.
- Confirmar que Azure SQL sigue sin uso.

## Fuera de alcance

- No ejecutar QA formal.
- No crear recursos Azure.
- No conectar Azure SQL.
- No cambiar UI/API salvo correcciones menores indispensables y documentadas.
- No guardar passwords, connection strings ni secretos.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/TASK_BOARD.md`
- `docs/API_CONTRACTS.md`
- `docs/SQL_SERVER_EXPRESS_LOCAL.md`
- `tasks/TASK-035-HANDOFF.md`
- `tasks/TASK-036-HANDOFF.md`
- `tasks/TASK-037-HANDOFF.md`
- `tasks/TASK-038-HANDOFF.md`
- `tasks/TASK-039-HANDOFF.md`
- `tasks/TASK-040-HANDOFF.md`
- `tasks/TASK-041-HANDOFF.md`

## Dependencia

- Ejecutar despues de completar `TASK-041`.

## Criterios de aceptacion

- [x] Paquete tecnico para QA queda documentado.
- [x] Incluye endpoints, setup local, datos y limitaciones.
- [x] Incluye evidencia del smoke tecnico local.
- [x] Confirma `Uso Azure SQL: No`.
- [x] No se guardan connection strings ni secretos reales.

## Verificacion esperada

- Revisar que el paquete permite a QA ejecutar pruebas sin inferir pasos ocultos.
- Buscar secretos en archivos cambiados.
- Confirmar que no se conecto Azure SQL ni se crearon recursos Azure.

## Handoff esperado

Crear o actualizar `tasks/TASK-042-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
