# TASK-047 - PO Test MVP SQL local

## Estado

Hecha

## Equipo responsable

Equipo/chat: PO Test
Prioridad: P1 pre-lanzamiento

## Contexto

QA aprobo la integracion SQL local MVP en `TASK-045`, Pulso completo la lectura post QA en `TASK-046` y el baseline local ya quedo versionado en el commit `e22521f Add PuntoVenta MVP local baseline`. Antes de abrir tooling o cloud/deploy, falta validacion de Product Owner sobre el MVP local con SQL.

## Objetivo

Validar como Product Owner el flujo MVP local con SQL: caja diaria, venta rapida, cuenta abierta, ticket y reportes.

## Alcance

- Probar visualmente la app local si el ambiente esta disponible.
- Validar que el flujo principal sea entendible para cafeteria/despacho.
- Validar caja diaria: apertura, estado y cierre esperado si aplica.
- Validar venta rapida: agregar producto, cobrar y ver ticket.
- Validar cuenta abierta: crear cuenta, agregar productos, cobrar y ver ticket.
- Validar reportes: resumen de caja/ventas coherente.
- Registrar observaciones de producto, claridad, bloqueos o aprobacion.

## Fuera de alcance

- No corregir codigo.
- No crear recursos Azure.
- No conectar Azure SQL.
- No hacer deploy.
- No instalar tooling.
- No guardar passwords, connection strings ni secretos.

## Leer antes de trabajar

- `AGENTS.md`
- `docs/ESTADO_OPERATIVO.md`
- `docs/CURRENT_BLOCKERS.md`
- `tasks/TASK-045-HANDOFF.md`
- `tasks/TASK-046-HANDOFF.md`
- `docs/QA_SQL_LOCAL_TECH_PACKAGE.md`
- `docs/SMOKE_LOCAL_APP_API_SQL.md`

## Dependencia

- Liberada por `TASK-046`.

## Criterios de aceptacion

- [x] PO indica aprobado, aprobado con observaciones o rechazado.
- [x] PO reporta hallazgos funcionales o visuales si existen.
- [x] PO confirma si el MVP local es entendible para el uso de cafeteria/despacho.
- [x] PO confirma que no se uso Azure SQL.
- [x] Se crea handoff con decision clara.

## Verificacion esperada

- Prueba manual del flujo MVP local con SQL si el ambiente lo permite.
- Si no se puede probar visualmente, documentar bloqueo y evidencia.

## Handoff esperado

Crear o actualizar `tasks/TASK-047-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
