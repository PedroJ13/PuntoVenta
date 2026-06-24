# Current Blockers

Bloqueos activos del proyecto. Mantener corto: bloqueo, responsable, siguiente accion y evidencia.

## Activos

| Bloqueo | Responsable | Siguiente accion | Evidencia |
| --- | --- | --- | --- |
| Tooling nuevo dentro del repo pausado | Proyecto | Abrir baseline local/Git antes de cualquier ESLint/Prettier | `docs/PROYECTO_TOOLING_ADOPTION.md` |

## Resueltos recientes

| Bloqueo | Resolucion | Evidencia |
| --- | --- | --- |
| QA SQL local aun no aprobada | `TASK-045` aprobo el smoke SQL local corregido sin P0/P1 abiertos | `tasks/TASK-045-HANDOFF.md` |
| Smoke SQL local excedia timeout de 120s y no dejaba evidencia final | `TASK-044` agrego smoke con puerto configurable, logs por fase y timeout SQL configurable; recomendado usar timeout externo minimo de 240s | `tasks/TASK-044-HANDOFF.md` |
