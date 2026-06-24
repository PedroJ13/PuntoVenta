# TASK-030 - Crear UI local de caja diaria

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Prioridad: MVP bloqueante

## Contexto

`TASK-028` implemento API local fake de caja diaria con endpoints de estado/resumen, apertura, movimientos manuales y cierre. Falta exponer este flujo en la app Web local para que el cajero pueda abrir caja, operar durante el turno y cerrar con arqueo.

## Objetivo

Crear la UI local de gestion operativa de caja diaria consumiendo la API fake local.

## Alcance

- Mostrar estado actual de caja diaria: sin abrir, abierta o cerrada.
- Crear flujo visual para abrir caja con monto inicial y nota opcional.
- Mostrar resumen parcial de caja abierta.
- Crear flujo para registrar movimientos manuales: ingreso, egreso y ajuste.
- Crear flujo para cerrar caja con efectivo contado, diferencia y nota cuando aplique.
- Mostrar errores y confirmaciones principales segun `docs/CASH_DAILY_FLOW_MVP.md`.
- Integrar mensajes de bloqueo cuando checkout no puede cobrar sin caja abierta.
- Mantener fallback claro si la API local no responde.

## Fuera de alcance

- No modificar reglas backend salvo ajustes menores indispensables y documentados.
- No conectar SQL Server local.
- No ejecutar migraciones.
- No crear recursos Azure.
- No conectar Azure SQL.
- No crear QA formal.
- No implementar permisos reales fuera del fake local existente.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/TASK_BOARD.md`
- `docs/CASH_DAILY_FLOW_MVP.md`
- `docs/API_CONTRACTS.md`
- `tasks/TASK-026-HANDOFF.md`
- `tasks/TASK-028-HANDOFF.md`
- `app/README.md`
- `api/README.md`

## Dependencia

- Liberada por `TASK-028`.

## Criterios de aceptacion

- [x] La app muestra estado actual de caja diaria.
- [x] Se puede abrir caja desde la UI local.
- [x] Se puede registrar movimiento manual desde la UI local.
- [x] Se puede cerrar caja desde la UI local con arqueo/diferencia.
- [x] La UI muestra resumen por metodo de pago o resumen operativo disponible.
- [x] Checkout muestra bloqueo claro si no hay caja abierta.
- [x] Hay fallback claro si API local no responde.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Levantar API local y app local.
- Verificar flujo visual basico de apertura, movimiento y cierre.
- Ejecutar checks JS disponibles.
- Buscar secretos o connection strings reales en archivos cambiados.
- Confirmar que no se conecto SQL Server local.
- Confirmar que no se crearon recursos Azure.

## Handoff esperado

Crear o actualizar `tasks/TASK-030-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
