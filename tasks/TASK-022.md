# TASK-022 - Definir reportes MVP API local

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Prioridad: P1 pre-lanzamiento

## Contexto

El backlog mantiene pendiente definir reportes MVP: ventas, caja, inventario bajo minimo y productos mas vendidos. Ya existe API fake local para checkout, cuentas, ticket y catalogo.

## Objetivo

Implementar endpoints locales fake de reportes MVP con tests, usando datos en memoria.

## Alcance

- Implementar resumen de ventas por rango.
- Implementar ventas por producto o productos mas vendidos.
- Implementar reporte de cierre/caja fake minimo.
- Implementar productos bajo minimo desde datos fake.
- Agregar tests unitarios.
- Mantener filtros por `companyId` desde auth fake.

## Fuera de alcance

- No conectar Azure SQL.
- No crear reportes avanzados.
- No implementar UI de reportes.
- No crear recursos Azure.
- No persistir datos reales.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/TASK_BOARD.md`
- `docs/API_CONTRACTS.md`
- `docs/DATA_MODEL.md`
- `api/README.md`
- `tasks/TASK-016-HANDOFF.md`
- `tasks/TASK-020-HANDOFF.md`

## Dependencia

- Liberada por `TASK-016` y `TASK-020`.

## Criterios de aceptacion

- [x] Existen endpoints locales fake de reportes MVP.
- [x] Hay tests para reportes principales.
- [x] Los reportes filtran por `companyId`.
- [x] No hay dependencia de Azure SQL ni secretos reales.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Ejecutar tests locales de `api/`.
- Buscar patrones de secretos en archivos cambiados.
- Confirmar que no se crearon recursos Azure.

## Handoff esperado

Crear o actualizar `tasks/TASK-022-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
