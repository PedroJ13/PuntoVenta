# TASK-010 - Definir formato de ticket de caja MVP

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Diseno/UX
Prioridad: P1 pre-lanzamiento

## Contexto

El MVP genera ticket interno, pero todavia falta definir el contenido y formato minimo imprimible antes de implementar ticket persistido o impresion real.

## Objetivo

Definir el formato MVP del ticket de caja interno para pantalla/reimpresion e impresion futura.

## Alcance

- Definir campos obligatorios del ticket MVP.
- Definir orden visual y jerarquia de informacion.
- Definir estados/casos: venta pagada, reimpresion y anulacion futura.
- Definir copy minimo para totales, impuestos, pagos y numero interno.
- Documentar restricciones para impresora termica futura sin implementarla.

## Fuera de alcance

- No implementar impresion real.
- No conectar impresora termica.
- No implementar facturacion electronica.
- No modificar backend.
- No crear disenos complejos fuera del MVP.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/TASK_BOARD.md`
- `docs/DEFINICION_PROYECTO.md`
- `docs/API_CONTRACTS.md`
- `app/index.html`
- `tasks/TASK-003-HANDOFF.md`
- `tasks/TASK-004-HANDOFF.md`

## Dependencia

- Liberada por `TASK-003` y `TASK-004`.

## Criterios de aceptacion

- [x] El formato de ticket MVP queda documentado.
- [x] Campos obligatorios y opcionales quedan separados.
- [x] Queda claro que no es factura electronica.
- [x] Hay recomendaciones para reimpresion/anulacion futura.
- [x] El handoff indica si se requieren tareas Web Dev o Backend/API posteriores.

## Verificacion esperada

- Revision documental del formato propuesto.
- Confirmar que no se implemento impresion real.

## Handoff esperado

Crear o actualizar `tasks/TASK-010-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
