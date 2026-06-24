# Estado operativo

Fuente corta y viva para que Proyecto, QA, Pulso y Ejecucion Tecnica sepan que esta activo ahora.

Regla: mantener maximo 3 items en `Ahora`. La historia larga queda en `docs/MVP_RELEASE_STATUS.md`, `docs/BACKLOG.md` y handoffs.

## Ahora

- `TASK-046`: Pulso post QA SQL local para recomendar el siguiente frente.
- Integracion SQL local MVP aprobada por QA en `TASK-045`.

## Siguiente

- Procesar handoff de `TASK-046` y decidir si sigue baseline local/Git limpio, PO Test, tooling o cloud/deploy.
- Antes de instalar tooling dentro del repo: validar baseline local y Git limpio segun `docs/PROYECTO_TOOLING_ADOPTION.md`.

## Bloqueado

- No hay bloqueo critico local activo. Ver `docs/CURRENT_BLOCKERS.md`.

## Hecho reciente

- `TASK-038`: API ventas/checkout con SQL local opcional.
- `TASK-039`: reportes MVP API con SQL local opcional.
- `TASK-040`: Web local ajustada para estados SQL del API.
- `TASK-041`: smoke tecnico local app/API/SQL documentado.
- `TASK-042`: paquete tecnico para QA SQL local.
- `TASK-044`: timeout de smoke SQL local diagnosticado y smoke corregido.
- `TASK-045`: QA SQL local aprobada sin P0/P1 abiertos.

## Decision necesaria

- Ninguna decision de producto inmediata.
- Cloud/deploy queda pendiente hasta procesar Pulso y una tarea explicita.
- Tooling nuevo dentro del repo queda pendiente hasta baseline local y Git limpio.
