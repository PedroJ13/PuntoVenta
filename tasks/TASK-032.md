# TASK-032 - PO Test de gestion operativa de caja diaria

## Estado

Hecha

## Equipo responsable

Equipo/chat: PO Test
Prioridad: MVP bloqueante

## Contexto

`TASK-031` aprobo QA de gestion operativa de caja diaria sin P0/P1 abiertos. Falta una validacion de Product Owner/usuario real sobre el flujo completo de caja diaria.

## Objetivo

Validar como PO si el flujo de caja diaria es entendible y suficiente para una cafeteria/despacho en el MVP.

## Alcance

- Abrir caja.
- Revisar estado/resumen de caja abierta.
- Registrar al menos un movimiento manual.
- Intentar cobrar sin caja abierta o confirmar que el bloqueo sea claro.
- Cobrar una venta o cuenta durante caja abierta si el ambiente lo permite.
- Cerrar caja con arqueo.
- Revisar si textos, orden y flujo son entendibles.
- Reportar aprobacion o ajustes deseados.

## Fuera de alcance

- No corregir codigo.
- No hacer QA tecnico.
- No conectar SQL Server local.
- No ejecutar migraciones.
- No crear recursos Azure.
- No conectar Azure SQL.
- No validar persistencia real.

## Leer antes de trabajar

- `AGENTS.md`
- `docs/TASK_BOARD.md`
- `docs/CASH_DAILY_FLOW_MVP.md`
- `tasks/TASK-030-HANDOFF.md`
- `tasks/TASK-031-HANDOFF.md`

## Dependencia

- Liberada por `TASK-031`.

## Criterios de aceptacion

- [x] PO indica aprobado o no aprobado.
- [x] PO reporta dudas, textos confusos o ajustes deseados si existen.
- [x] PO confirma si el flujo sirve para MVP de cafeteria/despacho.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Prueba manual como usuario real.
- Evidencia textual corta.
- Confirmar que no se conecto SQL Server local.
- Confirmar que no se crearon recursos Azure.

## Handoff esperado

Crear o actualizar `tasks/TASK-032-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
