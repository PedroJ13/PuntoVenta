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
- Toda tarea creada por Proyecto debe incluir `Nombre del Equipo`, `Modo`, `Nombre de la tarea`, handoff esperado, documentos a leer, objetivo, fuera de alcance y verificacion esperada.
- Al usuario se le entrega solo el prompt corto de asignacion: `Nombre del Equipo`, `Modo`, `Nombre de la tarea` y handoff esperado. El detalle completo vive en `tasks/TASK-###.md`.
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
| `TASK-070` - Validar publicacion remota de cierre pilot | Ejecucion Tecnica / Infra | P2 recomendable | Round 54 | `TASK-069` | `tasks/TASK-070-HANDOFF.md` |

## QA

| Tarea | Equipo | Prioridad | Round | Depende de | Nota |
| --- | --- | --- | --- | --- | --- |

## Blocked

| Tarea | Equipo | Prioridad | Round | Depende de | Motivo |
| --- | --- | --- | --- | --- | --- |

## Done

| Tarea | Equipo | Prioridad | Round | Depende de | Handoff |
| --- | --- | --- | --- | --- | --- |
| `TASK-001` - Cerrar alcance MVP y decisiones pendientes | Proyecto | MVP bloqueante | Round 1 | - | `tasks/TASK-001-HANDOFF.md` |
| `TASK-002` - Definir modelo de datos MVP | Ejecucion Tecnica / SQL DEV-Data | MVP bloqueante | Round 1 | - | `tasks/TASK-002-HANDOFF.md` |
| `TASK-003` - Convertir prototipo POS en app base | Ejecucion Tecnica / Web Dev | MVP bloqueante | Round 1 | - | `tasks/TASK-003-HANDOFF.md` |
| `TASK-004` - Definir contrato API MVP | Ejecucion Tecnica / Backend-API | MVP bloqueante | Round 2 | `TASK-001`, `TASK-002` | `tasks/TASK-004-HANDOFF.md` |
| `TASK-005` - Crear checklist QA inicial del flujo de caja | QA | MVP bloqueante | Round 1 | - | `tasks/TASK-005-HANDOFF.md` |
| `TASK-006` - Definir plan inicial de infraestructura Azure | Ejecucion Tecnica / Infra | P1 pre-lanzamiento | Round 1 | - | `tasks/TASK-006-HANDOFF.md` |
| `TASK-007` - Scaffold API local con tests | Ejecucion Tecnica / Backend-API | MVP bloqueante | Round 3 | `TASK-004` | `tasks/TASK-007-HANDOFF.md` |
| `TASK-008` - Ejecutar QA manual del flujo de caja | QA | MVP bloqueante | Round 3 | `TASK-003`, `TASK-005` | `tasks/TASK-008-HANDOFF.md` |
| `TASK-009` - Definir autenticacion y permisos MVP | Ejecucion Tecnica / Backend-API | P1 pre-lanzamiento | Round 3 | `TASK-004` | `tasks/TASK-009-HANDOFF.md` |
| `TASK-010` - Definir formato de ticket de caja MVP | Ejecucion Tecnica / Diseno-UX | P1 pre-lanzamiento | Round 3 | `TASK-003`, `TASK-004` | `tasks/TASK-010-HANDOFF.md` |
| `TASK-011` - Implementar auth fake y endpoint me | Ejecucion Tecnica / Backend-API | MVP bloqueante | Round 4 | `TASK-007`, `TASK-009` | `tasks/TASK-011-HANDOFF.md` |
| `TASK-012` - Actualizar dialog de ticket MVP | Ejecucion Tecnica / Web Dev | MVP bloqueante | Round 4 | `TASK-003`, `TASK-010` | `tasks/TASK-012-HANDOFF.md` |
| `TASK-013` - Ajuste responsive mobile de app base | Ejecucion Tecnica / Web Dev | P1 pre-lanzamiento | Round 4 | `TASK-008` | `tasks/TASK-013-HANDOFF.md` |
| `TASK-014` - PO Test de caja con datos falsos | PO Test | MVP bloqueante | Round 4 | `TASK-008` | `tasks/TASK-014-HANDOFF.md` |
| `TASK-015` - Endpoints locales de cuentas abiertas | Ejecucion Tecnica / Backend-API | MVP bloqueante | Round 5 | `TASK-011` | `tasks/TASK-015-HANDOFF.md` |
| `TASK-016` - Checkout local fake con pagos e inventario simulado | Ejecucion Tecnica / Backend-API | MVP bloqueante | Round 5 | `TASK-011` | `tasks/TASK-016-HANDOFF.md` |
| `TASK-017` - Endpoint local fake de ticket de venta | Ejecucion Tecnica / Backend-API | MVP bloqueante | Round 5 | `TASK-010`, `TASK-011` | `tasks/TASK-017-HANDOFF.md` |
| `TASK-018` - Conectar app base a API local fake | Ejecucion Tecnica / Web Dev | MVP bloqueante | Round 6 | `TASK-015`, `TASK-016`, `TASK-017` | `tasks/TASK-018-HANDOFF.md` |
| `TASK-019` - QA integracion app y API local | QA | MVP bloqueante | Round 6 | `TASK-018` | `tasks/TASK-019-HANDOFF.md` |
| `TASK-020` - Corregir montos CRC enteros en API fake | Ejecucion Tecnica / Backend-API | P1 pre-lanzamiento | Round 7 | `TASK-019` | `tasks/TASK-020-HANDOFF.md` |
| `TASK-021` - QA revalidar montos CRC en app y API local | QA | P1 pre-lanzamiento | Round 8 | `TASK-020` | `tasks/TASK-021-HANDOFF.md` |
| `TASK-022` - Definir reportes MVP API local | Ejecucion Tecnica / Backend-API | P1 pre-lanzamiento | Round 8 | `TASK-016`, `TASK-020` | `tasks/TASK-022-HANDOFF.md` |
| `TASK-023` - QA validar reportes MVP API local | QA | P1 pre-lanzamiento | Round 9 | `TASK-022` | `tasks/TASK-023-HANDOFF.md` |
| `TASK-024` - Crear vista Web de reportes MVP local | Ejecucion Tecnica / Web Dev | P1 pre-lanzamiento | Round 10 | `TASK-022`, `TASK-023` | `tasks/TASK-024-HANDOFF.md` |
| `TASK-025` - QA validar vista Web de reportes MVP local | QA | P1 pre-lanzamiento | Round 11 | `TASK-024` | `tasks/TASK-025-HANDOFF.md` |
| `TASK-026` - Definir flujo operativo de caja diaria | Ejecucion Tecnica / Diseno-UX | MVP bloqueante | Round 12 | - | `tasks/TASK-026-HANDOFF.md` |
| `TASK-027` - Preparar base tecnica para SQL Server Express local | Ejecucion Tecnica / SQL DEV-Data | P1 pre-lanzamiento | Round 12 | - | `tasks/TASK-027-HANDOFF.md` |
| `TASK-028` - Implementar API fake de caja diaria | Ejecucion Tecnica / Backend-API | MVP bloqueante | Round 13 | `TASK-026` | `tasks/TASK-028-HANDOFF.md` |
| `TASK-029` - Preparar modelo SQL de caja diaria | Ejecucion Tecnica / SQL DEV-Data | P1 pre-lanzamiento | Round 13 | `TASK-026`, `TASK-027` | `tasks/TASK-029-HANDOFF.md` |
| `TASK-030` - Crear UI local de caja diaria | Ejecucion Tecnica / Web Dev | MVP bloqueante | Round 14 | `TASK-028` | `tasks/TASK-030-HANDOFF.md` |
| `TASK-031` - QA validar gestion operativa de caja diaria | QA | MVP bloqueante | Round 15 | `TASK-030` | `tasks/TASK-031-HANDOFF.md` |
| `TASK-032` - PO Test de gestion operativa de caja diaria | PO Test | MVP bloqueante | Round 16 | `TASK-031` | `tasks/TASK-032-HANDOFF.md` |
| `TASK-033` - Validar migraciones en SQL Server Express local | Ejecucion Tecnica / SQL DEV-Data | P1 pre-lanzamiento | Round 17 | `TASK-027`, `TASK-029` | `tasks/TASK-033-HANDOFF.md` |
| `TASK-034` - Crear seeds locales ficticios para SQL Server Express | Ejecucion Tecnica / SQL DEV-Data | P1 pre-lanzamiento | Round 18 | `TASK-033` | `tasks/TASK-034-HANDOFF.md` |
| `TASK-035` - Conectar API a SQL local para catalogo | Ejecucion Tecnica / Backend-API | P1 pre-lanzamiento | Round 19 | `TASK-033`, `TASK-034` | `tasks/TASK-035-HANDOFF.md` |
| `TASK-036` - Conectar API a SQL local para cuentas abiertas | Ejecucion Tecnica / Backend-API | P1 pre-lanzamiento | Round 20 | `TASK-035` | `tasks/TASK-036-HANDOFF.md` |
| `TASK-037` - Conectar API a SQL local para caja diaria | Ejecucion Tecnica / Backend-API | P1 pre-lanzamiento | Round 21 | `TASK-036` | `tasks/TASK-037-HANDOFF.md` |
| `TASK-038` - Conectar API a SQL local para ventas y checkout | Ejecucion Tecnica / Backend-API | P1 pre-lanzamiento | Round 22 | `TASK-037` | `tasks/TASK-038-HANDOFF.md` |
| `TASK-039` - Conectar reportes MVP API a SQL local | Ejecucion Tecnica / Backend-API | P1 pre-lanzamiento | Round 23 | `TASK-038` | `tasks/TASK-039-HANDOFF.md` |
| `TASK-040` - Ajustar Web local para estados SQL del API | Ejecucion Tecnica / Web Dev | P1 pre-lanzamiento | Round 24 | `TASK-039` | `tasks/TASK-040-HANDOFF.md` |
| `TASK-041` - Preparar smoke tecnico local app API SQL | Ejecucion Tecnica / Backend-API | P1 pre-lanzamiento | Round 25 | `TASK-040` | `tasks/TASK-041-HANDOFF.md` |
| `TASK-042` - Preparar paquete tecnico para QA SQL local | Ejecucion Tecnica / Backend-API | P1 pre-lanzamiento | Round 26 | `TASK-041` | `tasks/TASK-042-HANDOFF.md` |
| `TASK-044` - Diagnosticar timeout de smoke SQL local QA | Ejecucion Tecnica / Backend-API | P1 pre-lanzamiento | Round 28 | `TASK-043` bloqueada | `tasks/TASK-044-HANDOFF.md` |
| `TASK-043` - QA validar integracion SQL local MVP | QA | P1 pre-lanzamiento | Round 27 | `TASK-042` | `tasks/TASK-043-HANDOFF.md` |
| `TASK-045` - QA reintentar integracion SQL local MVP | QA | P1 pre-lanzamiento | Round 29 | `TASK-044` | `tasks/TASK-045-HANDOFF.md` |
| `TASK-046` - Pulso post QA SQL local | Pulso | P1 pre-lanzamiento | Round 30 | `TASK-045` | `tasks/TASK-046-HANDOFF.md` |
| `TASK-047` - PO Test MVP SQL local | PO Test | P1 pre-lanzamiento | Round 31 | `TASK-046` | `tasks/TASK-047-HANDOFF.md` |
| `TASK-048` - Preparar tooling minimo local sin reformat masivo | Ejecucion Tecnica / Infra | P1 pre-lanzamiento | Round 32 | `TASK-047` | `tasks/TASK-048-HANDOFF.md` |
| `TASK-049` - Preflight cloud deploy sin crear recursos | Ejecucion Tecnica / Infra | P1 pre-lanzamiento | Round 33 | `TASK-048` | `tasks/TASK-049-HANDOFF.md` |
| `TASK-050` - Definir paquete de decision para primer deploy | Ejecucion Tecnica / Infra | P1 pre-lanzamiento | Round 34 | `TASK-049` | `tasks/TASK-050-HANDOFF.md` |
| `TASK-051` - Adaptar API local a Azure Functions sin Azure SQL | Ejecucion Tecnica / Backend-API | P1 pre-lanzamiento | Round 35 | Decision A+B | `tasks/TASK-051-HANDOFF.md` |
| `TASK-052` - Provisionar recursos pilot Web API sin Azure SQL | Ejecucion Tecnica / Infra | P1 pre-lanzamiento | Round 36 | `TASK-051` | `tasks/TASK-052-HANDOFF.md` |
| `TASK-053` - Configurar deploy Web API sin secrets en repo | Ejecucion Tecnica / Infra | P1 pre-lanzamiento | Round 37 | `TASK-052` | `tasks/TASK-053-HANDOFF.md` |
| `TASK-055` - Configurar Web pilot con API base URL publicada | Ejecucion Tecnica / Web Dev | P1 pre-lanzamiento | Round 39 | `TASK-053` | `tasks/TASK-055-HANDOFF.md` |
| `TASK-056` - Desbloquear deploy Web pilot y validar endpoints publicos | Ejecucion Tecnica / Infra | P1 pre-lanzamiento | Round 40 | `TASK-055` | `tasks/TASK-056-HANDOFF.md` |
| `TASK-057` - Consolidar cambios locales para deploy pilot | Ejecucion Tecnica / Infra | P1 pre-lanzamiento | Round 41 | `TASK-056` | `tasks/TASK-057-HANDOFF.md` |
| `TASK-058` - Ejecutar deploy pilot por GitHub Actions | Ejecucion Tecnica / Infra | P1 pre-lanzamiento | Round 42 | `TASK-057` | `tasks/TASK-058-HANDOFF.md` |
| `TASK-059` - Ejecutar workflows pilot desde GitHub UI y validar URLs externas | Ejecucion Tecnica / Infra | P1 pre-lanzamiento | Round 43 | `TASK-058` | `tasks/TASK-059-HANDOFF.md` |
| `TASK-060` - Configurar secrets GitHub pilot y re-ejecutar workflows | Ejecucion Tecnica / Infra | P1 pre-lanzamiento | Round 44 | `TASK-059` | `tasks/TASK-060-HANDOFF.md` |
| `TASK-061` - Habilitar SCM pilot temporal y reintentar deploy API | Ejecucion Tecnica / Infra | P1 pre-lanzamiento | Round 45 | `TASK-060` | `tasks/TASK-061-HANDOFF.md` |
| `TASK-062` - QA publicado Web API pilot sin Azure SQL | QA | P1 pre-lanzamiento | Round 46 | `TASK-061` | `tasks/TASK-062-HANDOFF.md` |
| `TASK-063` - Migrar API deploy pilot a OIDC RBAC y apagar SCM | Ejecucion Tecnica / Infra | P1 pre-lanzamiento | Round 47 | `TASK-062` | `tasks/TASK-063-HANDOFF.md` |
| `TASK-064` - Restringir CORS API pilot a Web publicada | Ejecucion Tecnica / Infra | P2 recomendable | Round 48 | `TASK-063` | `tasks/TASK-064-HANDOFF.md` |
| `TASK-065` - Documentar baseline pilot reproducible Web API | Ejecucion Tecnica / Infra | P2 recomendable | Round 49 | `TASK-064` | `tasks/TASK-065-HANDOFF.md` |
| `TASK-066` - Consolidar commit de cierre pilot Infra | Ejecucion Tecnica / Infra | P2 recomendable | Round 50 | `TASK-065` | `tasks/TASK-066-HANDOFF.md` |
| `TASK-067` - Publicar commits locales de cierre pilot | Ejecucion Tecnica / Infra | P2 recomendable | Round 51 | `TASK-066` | `tasks/TASK-067-HANDOFF.md` |
| `TASK-068` - Publicar cierre pilot desde canal permitido | Ejecucion Tecnica / Infra | P2 recomendable | Round 52 | `TASK-067` | `tasks/TASK-068-HANDOFF.md` |
| `TASK-069` - Preparar paquete local de publicacion por patch o bundle | Ejecucion Tecnica / Infra | P2 recomendable | Round 53 | `TASK-068` | `tasks/TASK-069-HANDOFF.md` |

## Formato sugerido de fila

```md
| `TASK-###` - Titulo corto | Equipo/chat | MVP bloqueante/P1/P2/post-MVP | Round 1 | - | Nota breve o link a handoff |
```

