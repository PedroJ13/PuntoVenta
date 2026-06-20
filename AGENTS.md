# PuntoVenta Agents

## Proyecto

PuntoVenta: Sistema web de punto de venta para cafeteria/despacho, con caja rapida, cuentas abiertas, inventario, materia prima, articulos y recetas

Tipo de MVP: MVP operativo para caja de cafeteria/despacho

## Regla de contexto

- Leer solo lo necesario para la tarea.
- Empezar por `AGENTS.md`, `docs/README.md`, `docs/MVP_RELEASE_STATUS.md` y `docs/TASK_BOARD.md`.
- Leer documentos tecnicos especificos solo si la tarea los necesita.
- Mantener tareas pequenas y verificables.
- No mezclar frontend, backend, infra, datos y QA en un mismo cambio salvo decision explicita.

## Roles

- Proyecto: prioridades, decisiones, backlog, release status, task board y tareas.
- Pulso: salud del proyecto, riesgos, prioridades y lectura ejecutiva. Este hilo opera como Pulso mientras el usuario no indique otro rol.
- Web Dev: UI, formularios, estados, responsive e integracion API.
- Backend/API: endpoints, validaciones, contratos, seguridad server-side e integraciones.
- SQL DEV / Data: modelo de datos, migraciones, integridad, indices y seeds.
- Infra: cloud, deploy, secretos, ambientes, observabilidad y costos.
- Diseno / UX: claridad de flujos, copy, errores, confirmaciones y coherencia.
- QA: checklist, pruebas, regresion, severidad y cierre de release.
- PO Test: validacion como Product Owner o usuario real; no recibe tareas de implementacion.

## Flujo de tareas

1. Proyecto crea una tarea `tasks/TASK-###.md` o `tasks/TASK-###-assignment.md`.
2. Proyecto registra o mueve la tarea en `docs/TASK_BOARD.md`.
3. El chat responsable lee su `chat-start/*.md`, la tarea y solo los docs necesarios.
4. El chat responsable puede mover su tarea asignada en `docs/TASK_BOARD.md` cuando la toma, libera, bloquea o entrega handoff.
5. El chat responsable ejecuta el alcance.
6. El chat responsable crea `tasks/TASK-###-HANDOFF.md`.
7. Proyecto procesa el handoff y actualiza docs si corresponde.

## Tablero operativo

- El tablero versionado vive en `docs/TASK_BOARD.md`.
- Proyecto es owner del tablero.
- Los equipos/chats pueden mover solo tareas asignadas a su equipo.
- Las etapas son `Inbox`, `Ready`, `Assigned`, `In Progress`, `Needs Review`, `QA`, `Blocked` y `Done`.
- Proyecto libera tareas por ronda moviendolas a `Ready` o `Assigned`.
- Los chats solo toman tareas de su equipo que esten en `Ready` o `Assigned` y no tengan dependencias pendientes en `Depende de`.
- Las tareas de rondas futuras o con dependencias pendientes deben quedarse en `Blocked`.

## Seguridad

- No guardar tokens, passwords, connection strings ni secretos en archivos.
- No exponer datos de un cliente/tenant/empresa a otro.
- No relajar restricciones de integridad para desbloquear un caso puntual.
- No borrar datos sin tarea explicita, respaldo y decision documentada.

