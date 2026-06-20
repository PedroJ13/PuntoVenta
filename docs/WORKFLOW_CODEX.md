# Workflow Codex

## Regla central

Proyecto coordina. Cada chat especializado trabaja tareas pequenas con un unico owner principal.

## Flujo

1. Crear tarea en `tasks/TASK-###.md` o `tasks/TASK-###-assignment.md`.
2. Registrar o mover la tarea en `docs/TASK_BOARD.md`.
3. Asignar equipo responsable.
4. El equipo lee `AGENTS.md`, su `chat-start/*.md`, la tarea y docs necesarios.
5. El equipo mueve la tarea a `In Progress` cuando la toma.
6. El equipo ejecuta o propone dentro del alcance.
7. El equipo crea `tasks/TASK-###-HANDOFF.md`.
8. El equipo mueve la tarea a `Needs Review`, `QA` o `Blocked`, segun resultado.
9. Proyecto procesa el handoff y actualiza release status, backlog, decision log y tablero.

## Chats reales del proyecto

- Proyecto
- Pulso
- QA
- Ejecucion Tecnica
- PO Test

Usar solo los chats que apliquen al proyecto.

## Chat-starts

- `chat-start/PROYECTO.md`
- `chat-start/PULSO_PROYECTO.md`
- `chat-start/EJECUCION_TECNICA.md`
- `chat-start/QA.md`
- `chat-start/PO_TEST.md`

## Tablero operativo

- Archivo: `docs/TASK_BOARD.md`.
- Proyecto crea tareas, asigna equipo, define prioridad y decide cierre en `Done`.
- Cada chat puede tomar/liberar solo la tarea asignada a su equipo.
- Cada chat solo toma tareas en `Ready` o `Assigned`, sin dependencias pendientes.
- Proyecto controla las rondas moviendo tareas futuras desde `Blocked` hacia `Ready` o `Assigned`.
- Si hay bloqueo, mover a `Blocked` y escribir motivo concreto.
- Si hay handoff, enlazar `tasks/TASK-###-HANDOFF.md` en el tablero.

## Git

- Rama principal: `main`.
- Ramas de trabajo: `codex/<tema-corto>` cuando aplique.
- Commits pequenos y descriptivos.
- Revisar `git status` y `git diff --stat` antes de cerrar.

