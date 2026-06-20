# Task Board

## Proposito

Tablero operativo versionado para coordinar tareas por etapa y por equipo/chat.

Proyecto mantiene la creacion de tareas, prioridad y asignacion. Los chats responsables pueden mover la tarea asignada cuando la toman, la liberan, la bloquean o entregan handoff.

## Equipos

| Equipo/chat | Archivo de arranque | Uso |
| --- | --- | --- |
| Proyecto | `chat-start/PROYECTO.md` | Crea tareas, prioriza, asigna, procesa handoffs y mantiene este tablero. |
| Ejecucion Tecnica | `chat-start/EJECUCION_TECNICA.md` | Ejecuta tareas tecnicas con un unico modo: Web Dev, Backend/API, SQL DEV/Data, Infra, Diseno/UX o Copy. |
| QA | `chat-start/QA.md` | Validacion, regresion, severidad, cierre de calidad. |
| Pulso | `chat-start/PULSO_PROYECTO.md` | Salud del proyecto, riesgos, prioridades, lectura ejecutiva. |
| PO Test | `tasks/PO_TEST_*.md` | Prueba como usuario/Product Owner; reporta hallazgos. |

## Reglas de uso

- Cada tarea debe existir como `tasks/TASK-###.md` o `tasks/TASK-###-assignment.md`.
- Una tarea debe aparecer una sola vez en el tablero.
- Proyecto crea y prioriza tareas.
- Proyecto libera tareas por ronda moviendolas a `Ready` o `Assigned`.
- El chat responsable puede mover solo su tarea asignada, respetando el alcance.
- Un chat solo puede tomar tareas en `Ready` o `Assigned` si estan asignadas a su equipo y no tienen dependencias pendientes.
- Las tareas con dependencias pendientes deben quedarse en `Blocked` hasta que Proyecto las libere.
- Si una tarea se bloquea, moverla a `Blocked` y escribir el motivo corto.
- Al terminar, crear o actualizar `tasks/TASK-###-HANDOFF.md` y mover a `Needs Review` o `QA`, segun corresponda.
- Proyecto decide cuando una tarea pasa a `Done`.
- No usar el tablero para guardar secretos, tokens, connection strings ni passwords.

## Etapas

- `Inbox`: idea o tarea pendiente de triage.
- `Ready`: tarea clara y lista para asignar o ejecutar.
- `Assigned`: tarea asignada a un equipo/chat, aun no tomada.
- `In Progress`: el equipo/chat ya la tomo.
- `Needs Review`: hay handoff y Proyecto debe procesarlo.
- `QA`: requiere validacion de QA o PO Test.
- `Blocked`: no puede avanzar sin decision, acceso, secreto, ambiente o tarea previa.
- `Done`: cerrada por Proyecto.

## Rondas y dependencias

- `Round` indica la ronda de trabajo sugerida.
- `Depende de` indica tareas o condiciones que deben terminar antes.
- Una automatizacion de chat debe ignorar tareas con `Depende de` pendiente.
- Proyecto es quien mueve tareas de rondas futuras desde `Blocked` hacia `Ready` o `Assigned`.
- El numero de ronda no autoriza por si solo tomar una tarea; manda el estado del tablero.

## Inbox

| Tarea | Equipo | Prioridad | Round | Depende de | Nota |
| --- | --- | --- | --- | --- | --- |

## Ready

| Tarea | Equipo | Prioridad | Round | Depende de | Nota |
| --- | --- | --- | --- | --- | --- |

## Assigned

| Tarea | Equipo | Prioridad | Round | Depende de | Nota |
| --- | --- | --- | --- | --- | --- |

## In Progress

| Tarea | Equipo | Prioridad | Round | Depende de | Nota |
| --- | --- | --- | --- | --- | --- |

## Needs Review

| Tarea | Equipo | Prioridad | Round | Depende de | Handoff |
| --- | --- | --- | --- | --- | --- |

## QA

| Tarea | Equipo | Prioridad | Round | Depende de | Nota |
| --- | --- | --- | --- | --- | --- |

## Blocked

| Tarea | Equipo | Prioridad | Round | Depende de | Motivo |
| --- | --- | --- | --- | --- | --- |

## Done

| Tarea | Equipo | Prioridad | Round | Depende de | Handoff |
| --- | --- | --- | --- | --- | --- |

## Formato sugerido de fila

```md
| `TASK-###` - Titulo corto | Equipo/chat | MVP bloqueante/P1/P2/post-MVP | Round 1 | - | Nota breve o link a handoff |
```

