# TASK-003 - Convertir prototipo POS en app base

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Prioridad: MVP bloqueante

## Contexto

El prototipo visual fue aprobado y debe transformarse en una app base mantenible para avanzar con pantallas y flujos sin esperar backend ni base de datos.

## Objetivo

Pasar `prototype/index.html` a una estructura de app base mantenible, con datos falsos y preparada para futuro deploy en Azure Static Web Apps.

## Alcance

- Mantener datos falsos o mocks locales.
- Separar la pantalla de ventas de las vistas de catalogo, inventario y recetas.
- Mantener cuentas abiertas y ticket de caja funcionales en frontend.
- Conservar la vision visual aprobada del prototipo.
- Preparar una estructura compatible con frontend estatico o SPA futura.

## Fuera de alcance

- No implementar API real.
- No conectar Azure SQL.
- No crear recursos Azure.
- No resolver autenticacion.
- No implementar facturacion electronica ni impresora termica real.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/TASK_BOARD.md`
- `docs/DEFINICION_PROYECTO.md`
- `docs/PULSO_A_PROYECTO_PROTOTIPO_APROBADO.md`
- `prototype/index.html`

## Criterios de aceptacion

- [x] La app base reproduce el flujo aprobado del prototipo.
- [x] La pantalla de ventas permite operar cuentas abiertas con datos falsos.
- [x] Catalogo, inventario y recetas quedan separados de forma mantenible.
- [x] No hay dependencia de API ni base de datos.
- [x] El handoff indica archivos cambiados y como abrir/verificar la app local.

## Verificacion esperada

- Abrir o ejecutar la app localmente segun la estructura creada.
- Verificar flujo basico: seleccionar articulo, manejar cuenta abierta y ver ticket.
- Confirmar `Uso Azure SQL: No`.

## Handoff esperado

Crear o actualizar `tasks/TASK-003-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
