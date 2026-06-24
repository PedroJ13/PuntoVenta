# TASK-005 - Crear checklist QA inicial del flujo de caja

## Estado

Hecha

## Equipo responsable

Equipo/chat: QA
Prioridad: MVP bloqueante

## Contexto

El flujo de caja es el centro del MVP. QA necesita un checklist inicial para validar el prototipo y luego reutilizarlo contra la app base.

## Objetivo

Crear un checklist QA inicial para validar caja, cuentas abiertas, cobro y ticket, sin ejecutar cambios de implementacion.

## Alcance

- Cubrir creacion de cuenta abierta.
- Cubrir agregar articulos, cambiar cantidades y eliminar lineas.
- Cubrir cambio entre cuentas abiertas.
- Cubrir cobro y generacion de ticket.
- Cubrir reimpresion y anulacion como casos esperados cuando existan.
- Cubrir validaciones futuras de descuento de inventario segun tipo de articulo.
- Clasificar hallazgos por severidad esperada.

## Fuera de alcance

- No corregir UI.
- No implementar pruebas automatizadas salvo que Proyecto lo separe en otra tarea.
- No validar Azure ni base de datos.
- No cambiar alcance de producto.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/TASK_BOARD.md`
- `docs/DEFINICION_PROYECTO.md`
- `docs/PULSO_A_PROYECTO_PROTOTIPO_APROBADO.md`
- `prototype/index.html`

## Criterios de aceptacion

- [x] Existe checklist QA inicial para flujo de caja.
- [x] El checklist separa validacion actual del prototipo y validacion futura con backend.
- [x] Los casos criticos del flujo de caja quedan cubiertos.
- [x] El handoff indica riesgos o gaps de validacion.

## Verificacion esperada

- Revision documental del checklist.
- Si QA ejecuta validacion manual del prototipo, debe reportar resultado por caso.

## Handoff esperado

Crear o actualizar `tasks/TASK-005-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
