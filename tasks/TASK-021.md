# TASK-021 - QA revalidar montos CRC en app y API local

## Estado

Hecha

## Equipo responsable

Equipo/chat: QA
Prioridad: P1 pre-lanzamiento

## Contexto

`TASK-020` corrigio la observacion de `TASK-019`: los montos CRC de checkout y ticket ya deben salir como enteros en API fake. QA debe revalidar el hallazgo para confirmar cierre.

## Objetivo

Revalidar que la integracion app/API local muestra y devuelve montos CRC enteros en cuentas, checkout y ticket.

## Alcance

- Levantar API local y app local.
- Ejecutar flujo con articulo que genere impuesto decimal antes del redondeo.
- Confirmar que API devuelve impuesto y total enteros.
- Confirmar que el ticket de la app muestra montos enteros.
- Reportar si el hallazgo P2 queda cerrado.

## Fuera de alcance

- No corregir codigo.
- No validar Azure SQL.
- No validar deploy.
- No validar persistencia real.
- No abrir nuevas funcionalidades.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/TASK_BOARD.md`
- `tasks/TASK-019-HANDOFF.md`
- `tasks/TASK-020-HANDOFF.md`
- `docs/QA_CHECKLIST_FLUJO_CAJA.md`

## Dependencia

- Liberada por `TASK-020`.

## Criterios de aceptacion

- [x] QA confirma si el hallazgo de montos decimales queda cerrado.
- [x] La evidencia incluye respuesta API o ticket con montos enteros.
- [x] El handoff indica `Uso Azure SQL: No`.
- [x] Si falla, se reporta severidad y caso reproducible.

## Verificacion esperada

- Ejecutar flujo local app/API.
- Ejecutar o citar tests locales relevantes si aplica.
- Confirmar que no se usaron recursos Azure.

## Handoff esperado

Crear o actualizar `tasks/TASK-021-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
