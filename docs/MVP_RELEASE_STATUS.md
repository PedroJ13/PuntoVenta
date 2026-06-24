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
- Repo local Git inicializado.
- Flujo Codex de Proyecto / Pulso / QA / Ejecucion Tecnica incorporado al repo.
- Tareas iniciales `TASK-001` a `TASK-006` creadas y registradas en `docs/TASK_BOARD.md`.

### Siguiente

- Ejecutar `TASK-046`: Pulso post QA SQL local.
- Despues de QA local aprobada, validar baseline local y Git limpio antes de instalar tooling dentro del repo.
- Crear tareas posteriores de provisionamiento Azure, migracion SQL o deploy solo cuando Proyecto las autorice.

### Bloqueado

- Tooling nuevo dentro del repo pausado hasta baseline local y Git limpio.

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

## Riesgos principales

- Empezar a implementar backend/DB antes de cerrar reglas de inventario, caja y cuentas abiertas.
- Confundir ticket de caja con facturacion electronica.
- Modelar materia prima como productos finales fijos en vez de consumo variable por receta.
- Crear tareas demasiado grandes.
- Instalar o conectar servicios sin decision de costo/seguridad.
- Guardar secretos en archivos.

## Siguiente paso recomendado

Completar `TASK-046` antes de abrir cloud/deploy o tooling. Mantener Azure SQL sin uso hasta una tarea explicita de migracion o smoke real.

