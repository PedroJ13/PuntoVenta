# TASK-038 - Conectar API a SQL local para ventas y checkout

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Prioridad: P1 pre-lanzamiento

## Contexto

`TASK-035` conecto catalogo a SQL local, `TASK-036` conecto cuentas abiertas a SQL local y `TASK-037` conecto caja diaria a SQL local. Falta conectar ventas/checkout al mismo camino SQL local para que el flujo operativo pueda guardar ventas reales en SQL Server Express local antes de abordar reportes SQL o Azure.

## Objetivo

Implementar persistencia SQL local para checkout/ventas, pagos y cierre de cuentas abiertas, manteniendo compatibilidad de API y fallback fake.

## Alcance

- Implementar repositorio SQL local para crear ventas de caja rapida.
- Implementar repositorio SQL local para cobrar y cerrar cuentas abiertas.
- Persistir lineas de venta y pagos usando montos CRC enteros.
- Asociar la venta/cobro a la caja diaria SQL abierta cuando SQL este configurado.
- Bloquear checkout SQL si no hay caja diaria SQL abierta, con error claro y compatible con el contrato existente.
- Mantener compatibilidad con endpoint local fake de ticket si depende de la venta generada.
- Mantener fallback fake cuando SQL no este configurado o si SQL falla.
- Resolver empresa/tenant server-side desde auth fake/configuracion local.
- Agregar tests para modo fake/fallback y modo SQL si el entorno local lo permite.

## Fuera de alcance

- No conectar reportes a SQL.
- No crear UI Web nueva.
- No crear recursos Azure.
- No conectar Azure SQL.
- No ejecutar migraciones destructivas.
- No cambiar reglas de negocio de inventario mas alla de lo ya soportado por el modelo/contrato existente.
- No guardar passwords, connection strings ni secretos.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/TASK_BOARD.md`
- `docs/API_CONTRACTS.md`
- `docs/SQL_SERVER_EXPRESS_LOCAL.md`
- `tasks/TASK-016-HANDOFF.md`
- `tasks/TASK-017-HANDOFF.md`
- `tasks/TASK-033-HANDOFF.md`
- `tasks/TASK-034-HANDOFF.md`
- `tasks/TASK-035-HANDOFF.md`
- `tasks/TASK-036-HANDOFF.md`
- `tasks/TASK-037-HANDOFF.md`
- `api/README.md`

## Dependencia

- Liberada por `TASK-037`.

## Criterios de aceptacion

- [x] API puede registrar venta de caja rapida en SQL local cuando esta configurado.
- [x] API puede cobrar/cerrar cuenta abierta en SQL local cuando esta configurado.
- [x] API persiste lineas, pagos y totales en CRC enteros.
- [x] API asocia ventas/cobros a una caja diaria SQL abierta.
- [x] API bloquea checkout SQL sin caja diaria abierta con error claro.
- [x] API mantiene fallback fake sin SQL configurado o si SQL falla.
- [x] No se guardan connection strings ni secretos reales.
- [x] No se conecta Azure SQL.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Ejecutar tests locales de `api/`.
- Si SQL local esta disponible, probar venta caja rapida y cobro de cuenta abierta contra base local con migraciones/seeds.
- Buscar secretos en archivos cambiados.
- Confirmar que no se conecto Azure SQL ni se crearon recursos Azure.

## Handoff esperado

Crear o actualizar `tasks/TASK-038-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
