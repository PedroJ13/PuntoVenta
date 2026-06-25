# MVP Release Status

## Estado actual

Fase: prototipo aprobado / preparacion MVP.

Decision inicial: MVP operativo web para cafeteria/despacho, sin manejo de mesas y sin facturacion electronica por ahora.

## Tablero operativo corto

### Ahora

- Alcance funcional inicial documentado en `docs/DEFINICION_PROYECTO.md`.
- Prototipo local de pantalla de ventas y vistas de inventario/articulos/recetas creado en `prototype/index.html`.
- Prototipo aprobado como vision inicial del producto.
- Alcance MVP operativo cerrado por `TASK-001`.
- Modelo de datos MVP documentado por `TASK-002`.
- App base estatica creada desde el prototipo por `TASK-003`.
- Contrato API MVP documentado por `TASK-004`.
- Checklist QA inicial del flujo de caja creado por `TASK-005`.
- Plan inicial de infraestructura Azure documentado por `TASK-006`.
- Scaffold API local con tests creado por `TASK-007`.
- QA manual del flujo de caja aprobado con observaciones por `TASK-008`.
- Autenticacion y permisos MVP definidos por `TASK-009`.
- Formato de ticket de caja MVP definido por `TASK-010`.
- Auth fake local y endpoint `GET /api/me` implementados por `TASK-011`.
- Dialog de ticket MVP actualizado por `TASK-012`.
- Responsive mobile de app base ajustado por `TASK-013`.
- PO Test de caja rapida aprobado con datos falsos por `TASK-014`.
- Endpoints locales de cuentas abiertas implementados por `TASK-015`.
- Checkout local fake implementado por `TASK-016`.
- Endpoint local fake de ticket implementado por `TASK-017`.
- App base conectada a API local fake por `TASK-018`.
- QA de integracion app/API local aprobado con observacion por `TASK-019`.
- Montos CRC enteros corregidos en API fake por `TASK-020`.
- QA revalido montos CRC enteros por `TASK-021`.
- Reportes MVP API local implementados por `TASK-022`.
- QA valido reportes MVP API local por `TASK-023`.
- Vista Web de reportes MVP local creada por `TASK-024`.
- QA valido vista Web de reportes MVP local por `TASK-025`.
- Flujo operativo de caja diaria definido por `TASK-026`.
- Base tecnica para SQL Server Express local preparada por `TASK-027`.
- API fake de caja diaria implementada por `TASK-028`.
- Modelo SQL de caja diaria preparado por `TASK-029`.
- UI local de caja diaria creada por `TASK-030`.
- QA aprobo gestion operativa de caja diaria por `TASK-031`.
- PO aprobo gestion operativa de caja diaria por `TASK-032`.
- Migraciones MVP validadas en SQL Server Express local por `TASK-033`.
- Seeds locales ficticios para SQL Server Express creados por `TASK-034`.
- Catalogo API conectado opcionalmente a SQL local por `TASK-035`.
- Cuentas abiertas API conectadas opcionalmente a SQL local por `TASK-036`.
- Caja diaria API conectada opcionalmente a SQL local por `TASK-037`.
- Ventas y checkout API conectados opcionalmente a SQL local por `TASK-038`.
- Reportes MVP API conectados opcionalmente a SQL local por `TASK-039`.
- Web local ajustada para estados SQL del API por `TASK-040`.
- Smoke tecnico local app/API/SQL documentado por `TASK-041`.
- Paquete tecnico para QA SQL local preparado por `TASK-042`.
- Timeout de smoke SQL local QA diagnosticado y smoke corregido por `TASK-044`.
- QA aprobo integracion SQL local MVP por `TASK-045`.
- Pulso post QA SQL local completado por `TASK-046`.
- PO aprobo MVP SQL local por `TASK-047`.
- Tooling minimo local preparado sin reformat masivo por `TASK-048`.
- Preflight cloud/deploy sin recursos creado por `TASK-049`.
- Paquete de decision para primer deploy creado por `TASK-050`.
- API adaptada a Azure Functions sin Azure SQL por `TASK-051`.
- Recursos Azure pilot Web/API creados sin Azure SQL por `TASK-052`.
- Deploy Web/API configurado sin secrets en repo por `TASK-053`.
- Primer deploy pilot quedo parcial/bloqueado por `TASK-054`: API registrada, Web deploy bloqueado y checks HTTP publicos no verificables desde este entorno.
- Web pilot configurada con API base URL publicada por `TASK-055`.
- Bloqueo de deploy Web/HTTP publico diagnosticado por `TASK-056`; ruta recomendada: GitHub Actions.
- Cambios de deploy pilot commiteados y publicados en GitHub por `TASK-057`.
- Workflows pilot confirmados en remoto por `TASK-058`; ejecucion bloqueada desde esta sesion por `gh` invalido/herramientas disponibles.
- Workflows pilot ejecutados por `TASK-059`; ambos fallaron por secrets faltantes, pero Web/API publicos responden `HTTP 200` y Azure SQL no existe/no se usa.
- Secrets GitHub pilot configurados por `TASK-060`; Web workflow quedo exitoso y API workflow falla por Kudu `401` con `basicPublishingCredentialsPolicies/scm allow:false`.
- SCM basic publishing temporal habilitado por `TASK-061`; API workflow quedo exitoso, Web workflow sigue exitoso y Web/API publicos responden `HTTP 200`.
- QA publicado Web/API pilot aprobado con observaciones por `TASK-062`; sin P0/P1 y sin Azure SQL.
- API deploy migrado a OIDC/RBAC por `TASK-063`; SCM y FTP basic publishing apagados.
- CORS API pilot restringido al origen Web publicado por `TASK-064`.
- Baseline pilot reproducible Web/API documentado por `TASK-065`.
- Commits locales de cierre pilot consolidados por `TASK-066`; push bloqueado por politica del entorno.
- Intento de publicacion de commits de cierre pilot documentado por `TASK-067`; bloqueo externo persiste.
- `TASK-068` reintento publicar desde canal disponible y confirmo que la politica del entorno sigue bloqueando el push externo.
- Baseline local versionado en commit `e22521f Add PuntoVenta MVP local baseline`.
- Repo local Git inicializado.
- Flujo Codex de Proyecto / Pulso / QA / Ejecucion Tecnica incorporado al repo.
- Tareas iniciales `TASK-001` a `TASK-006` creadas y registradas en `docs/TASK_BOARD.md`.

### Siguiente

- Ejecucion Tecnica / Infra debe publicar los commits locales desde un destino/canal permitido por politica.
- Mantener cierre pilot como baseline operativo Web/API sin Azure SQL.

### Bloqueado

- Azure SQL pausado hasta tarea explicita futura.
- Push remoto de commits de cierre pilot bloqueado por politica del entorno.

### Hecho

- Bootstrap documental inicial.
- Documento de definicion funcional inicial.
- Prototipo visual local.
- `TASK-001`: cierre de alcance MVP y decisiones pendientes.
- `TASK-002`: modelo de datos MVP.
- `TASK-003`: app base con datos falsos.
- `TASK-004`: contrato API MVP.
- `TASK-005`: checklist QA inicial del flujo de caja.
- `TASK-006`: plan inicial de infraestructura Azure.
- `TASK-007`: scaffold API local con tests.
- `TASK-008`: QA manual de flujo de caja.
- `TASK-009`: autenticacion y permisos MVP.
- `TASK-010`: formato de ticket de caja MVP.
- `TASK-011`: auth fake local y endpoint `GET /api/me`.
- `TASK-012`: dialog de ticket MVP.
- `TASK-013`: ajuste responsive mobile.
- `TASK-014`: PO Test de caja con datos falsos.
- `TASK-015`: endpoints locales de cuentas abiertas.
- `TASK-016`: checkout local fake.
- `TASK-017`: endpoint local fake de ticket.
- `TASK-018`: integracion app/API local fake.
- `TASK-019`: QA integracion app/API local.
- `TASK-020`: montos CRC enteros en API fake.
- `TASK-021`: QA revalidacion de montos CRC.
- `TASK-022`: reportes MVP API local.
- `TASK-023`: QA reportes MVP API local.
- `TASK-024`: vista Web reportes MVP local.
- `TASK-025`: QA vista Web reportes MVP local.
- `TASK-026`: flujo operativo de caja diaria.
- `TASK-027`: base tecnica para SQL Server Express local.
- `TASK-028`: API fake de caja diaria.
- `TASK-029`: modelo SQL de caja diaria.
- `TASK-030`: UI local de caja diaria.
- `TASK-031`: QA gestion operativa de caja diaria.
- `TASK-032`: PO Test gestion operativa de caja diaria.
- `TASK-033`: validacion de migraciones en SQL Server Express local.
- `TASK-034`: seeds locales ficticios para SQL Server Express.
- `TASK-035`: API catalogo con SQL local opcional.
- `TASK-036`: API cuentas abiertas con SQL local opcional.
- `TASK-037`: API caja diaria con SQL local opcional.
- `TASK-038`: API ventas y checkout con SQL local opcional.
- `TASK-039`: reportes MVP API con SQL local opcional.
- `TASK-040`: Web local ajustada para estados SQL del API.
- `TASK-041`: smoke tecnico local app/API/SQL.
- `TASK-042`: paquete tecnico para QA SQL local.
- `TASK-044`: diagnostico de timeout de smoke SQL local QA.
- `TASK-045`: QA integracion SQL local MVP aprobada.
- `TASK-046`: Pulso post QA SQL local.
- `TASK-047`: PO Test MVP SQL local aprobado.
- `TASK-048`: tooling minimo local sin reformat masivo.
- `TASK-049`: preflight cloud/deploy sin crear recursos.
- `TASK-050`: paquete de decision para primer deploy.
- `TASK-051`: API local adaptada a Azure Functions sin Azure SQL.
- `TASK-052`: recursos pilot Web/API creados sin Azure SQL.
- `TASK-053`: deploy Web/API configurado sin secrets en repo.
- `TASK-055`: Web pilot configurada con API base URL publicada.
- `TASK-056`: diagnostico de bloqueo deploy Web/HTTP publico.
- `TASK-057`: cambios deploy pilot commiteados y publicados en GitHub.
- `TASK-058`: workflows pilot confirmados en remoto con bloqueo de ejecucion desde esta sesion.
- `TASK-059`: workflows pilot ejecutados con failure por secrets faltantes; Web/API publicos responden.
- `TASK-060`: secrets configurados; Web workflow exitoso; API workflow bloqueado por SCM basic publishing deshabilitado.
- `TASK-061`: SCM pilot temporal habilitado; API workflow exitoso; Web/API publicos `HTTP 200`.
- `TASK-062`: QA publicado Web/API pilot aprobado con observaciones.
- `TASK-063`: API deploy migrado a OIDC/RBAC; SCM y FTP basic publishing apagados.
- `TASK-064`: CORS API pilot restringido al origen Web publicado.
- `TASK-065`: baseline pilot reproducible Web/API documentado.
- `TASK-066`: commits locales de cierre pilot consolidados.
- `TASK-067`: intento de publicacion de commits de cierre pilot documentado; bloqueo externo persiste.
- `TASK-068`: intento de `git push origin main` desde canal disponible rechazado por politica del entorno.

## Riesgos principales

- Empezar a implementar backend/DB antes de cerrar reglas de inventario, caja y cuentas abiertas.
- Confundir ticket de caja con facturacion electronica.
- Modelar materia prima como productos finales fijos en vez de consumo variable por receta.
- Crear tareas demasiado grandes.
- Instalar o conectar servicios sin decision de costo/seguridad.
- Guardar secretos en archivos.

## Siguiente paso recomendado

Ejecucion Tecnica / Infra debe publicar los commits locales de cierre pilot desde un destino/canal permitido por politica. Mantener Azure SQL sin uso hasta una tarea explicita de migracion o smoke real.

