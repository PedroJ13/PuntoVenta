# TASK-024 - Crear vista Web de reportes MVP local

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Prioridad: P1 pre-lanzamiento

## Contexto

`TASK-022` implemento reportes MVP en API local fake y `TASK-023` los valido desde QA. Falta exponer esos reportes en la app base para que el PO pueda consultarlos visualmente.

## Objetivo

Crear una vista Web de reportes MVP que consuma la API local fake y muestre resumen de ventas, ventas/productos, caja y stock bajo minimo.

## Alcance

- Agregar vista o seccion de reportes en `app/`.
- Consumir endpoints locales de reportes si la API esta disponible.
- Mostrar resumen de ventas.
- Mostrar productos mas vendidos o ventas por producto.
- Mostrar caja/cierre fake minimo.
- Mostrar productos bajo minimo.
- Mantener fallback visual si API local no esta disponible.

## Fuera de alcance

- No implementar reportes avanzados.
- No conectar Azure SQL.
- No crear recursos Azure.
- No implementar persistencia real.
- No modificar reglas de reportes backend salvo ajustes menores necesarios.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/TASK_BOARD.md`
- `docs/API_CONTRACTS.md`
- `tasks/TASK-022-HANDOFF.md`
- `tasks/TASK-023-HANDOFF.md`
- `app/README.md`
- `api/README.md`

## Dependencia

- Liberada por `TASK-022` y `TASK-023`.

## Criterios de aceptacion

- [x] Existe vista Web de reportes MVP.
- [x] La vista consume API local fake cuando esta disponible.
- [x] Se muestran ventas, productos/top items, caja y stock bajo minimo.
- [x] Hay fallback o estado claro si API no responde.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Levantar API local y app local.
- Verificar visualmente reportes.
- Ejecutar checks JS disponibles.
- Confirmar que no se crearon recursos Azure.

## Handoff esperado

Crear o actualizar `tasks/TASK-024-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
