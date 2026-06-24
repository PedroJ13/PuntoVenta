# TASK-009 - Definir autenticacion y permisos MVP

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Prioridad: P1 pre-lanzamiento

## Contexto

El MVP ya tiene roles iniciales definidos a nivel producto, pero falta convertirlos en reglas minimas de autenticacion y permisos para API y futura UI.

## Objetivo

Definir el alcance minimo de autenticacion, sesion y permisos para Administrador, Cajero, Encargado y Auditor/PO.

## Alcance

- Definir matriz de permisos por rol MVP.
- Definir comportamiento de usuario autenticado para API.
- Definir reglas server-side para cambios sensibles: precio, descuento, anulacion, ajustes, caja y reportes.
- Documentar decisiones pendientes que requieran Proyecto/PO.
- Proponer tareas posteriores de implementacion si aplica.

## Fuera de alcance

- No implementar login.
- No crear usuarios reales.
- No configurar proveedores OAuth ni Azure.
- No guardar secretos.
- No modificar base de datos salvo documentacion.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/TASK_BOARD.md`
- `docs/DEFINICION_PROYECTO.md`
- `docs/API_CONTRACTS.md`
- `docs/DATA_MODEL.md`
- `docs/DECISION_LOG.md`

## Dependencia

- Liberada por `TASK-004`.

## Criterios de aceptacion

- [x] Existe matriz de permisos MVP por rol.
- [x] Quedan definidas acciones sensibles que requieren permiso.
- [x] Se documenta que `company_id` se resuelve server-side.
- [x] No se implementa autenticacion ni se crean secretos.
- [x] El handoff indica pendientes de decision si existen.

## Verificacion esperada

- Revision documental de la matriz y reglas.
- Confirmar que no se agregaron secretos ni credenciales.

## Handoff esperado

Crear o actualizar `tasks/TASK-009-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
