# TASK-014 - PO Test de caja con datos falsos

## Estado

Hecha

## Equipo responsable

Equipo/chat: PO Test
Prioridad: MVP bloqueante

## Contexto

La app base fue validada por QA con datos falsos y no tiene P0/P1 abiertos para el alcance actual. Falta validacion tipo Product Owner sobre el flujo visual/operativo de caja antes de avanzar a implementaciones mas profundas.

## Objetivo

Validar como PO el flujo de caja con datos falsos y reportar si la experiencia cumple la vision inicial o requiere ajustes prioritarios.

## Alcance

- Probar venta rapida con articulos falsos.
- Probar cuentas abiertas y cambio entre cuentas.
- Probar cantidades, totales, metodo de pago y ticket.
- Revisar claridad visual del flujo para cafeteria/despacho.
- Reportar ajustes como aprobados, bloqueantes o recomendados.

## Fuera de alcance

- No implementar cambios.
- No validar backend real.
- No validar inventario real.
- No validar Azure, deploy ni base de datos.
- No evaluar facturacion electronica.

## Leer antes de trabajar

- `AGENTS.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/TASK_BOARD.md`
- `docs/DEFINICION_PROYECTO.md`
- `docs/QA_CHECKLIST_FLUJO_CAJA.md`
- `tasks/TASK-003-HANDOFF.md`
- `tasks/TASK-008-HANDOFF.md`
- `tasks/TASK-012-HANDOFF.md` si existe
- `tasks/TASK-013-HANDOFF.md` si existe

## Dependencia

- Depende de `TASK-008`.
- Recomendado despues de `TASK-012` y `TASK-013` si Proyecto quiere probar ticket final y mobile ajustado.

## Criterios de aceptacion

- [x] PO Test indica aprobado, aprobado con observaciones o rechazado.
- [x] Los hallazgos quedan priorizados.
- [x] Queda claro si se puede avanzar a backend/API o si hacen falta ajustes Web Dev.
- [x] El handoff indica siguientes tareas recomendadas.

## Verificacion esperada

- Reporte manual de PO Test con observaciones accionables.
- No ejecutar cambios de codigo.

## Handoff esperado

Crear o actualizar `tasks/TASK-014-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
