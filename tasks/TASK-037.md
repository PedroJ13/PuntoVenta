# TASK-037 - Conectar API a SQL local para caja diaria

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Prioridad: P1 pre-lanzamiento

## Contexto

`TASK-035` conecto catalogo a SQL local y `TASK-036` conecto cuentas abiertas a SQL local con fallback fake. Falta conectar la gestion operativa de caja diaria a SQL Server Express local antes de abordar checkout/ventas SQL.

## Objetivo

Implementar repositorio SQL local para caja diaria: estado/resumen, apertura, movimientos manuales y cierre, manteniendo fallback fake.

## Alcance

- Implementar repositorio SQL para consultar caja diaria actual por empresa/terminal.
- Implementar apertura de caja diaria en SQL local.
- Implementar movimientos manuales en SQL local: ingreso, egreso y ajuste.
- Implementar cierre de caja con efectivo contado, diferencia y nota cuando aplique.
- Mantener bloqueo de cierre con cuentas abiertas pendientes usando datos SQL cuando aplique.
- Resolver empresa/tenant server-side desde auth fake/configuracion local.
- Mantener fallback fake cuando SQL no este configurado o si SQL falla.
- Actualizar `GET /api/health` para indicar modo de caja diaria sin exponer secretos.
- Agregar tests para modo fake/fallback y modo SQL si el entorno local lo permite.

## Fuera de alcance

- No conectar checkout/ventas a SQL.
- No conectar reportes a SQL.
- No modificar UI Web salvo ajuste menor indispensable y documentado.
- No ejecutar migraciones destructivas.
- No crear recursos Azure.
- No conectar Azure SQL.
- No guardar passwords, connection strings ni secretos.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/TASK_BOARD.md`
- `docs/API_CONTRACTS.md`
- `docs/CASH_DAILY_FLOW_MVP.md`
- `docs/SQL_SERVER_EXPRESS_LOCAL.md`
- `tasks/TASK-028-HANDOFF.md`
- `tasks/TASK-033-HANDOFF.md`
- `tasks/TASK-034-HANDOFF.md`
- `tasks/TASK-036-HANDOFF.md`
- `api/README.md`

## Dependencia

- Liberada por `TASK-036`.

## Criterios de aceptacion

- [x] API puede consultar caja diaria desde SQL local cuando esta configurado.
- [x] API puede abrir caja diaria en SQL local.
- [x] API puede registrar movimientos manuales en SQL local.
- [x] API puede cerrar caja diaria en SQL local con arqueo/diferencia.
- [x] API mantiene fallback fake sin SQL configurado o si SQL falla.
- [x] No se guardan connection strings ni secretos reales.
- [x] No se conecta Azure SQL.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Ejecutar tests locales de `api/`.
- Si SQL local esta disponible, probar apertura/movimientos/cierre contra base local con migraciones/seeds.
- Buscar secretos en archivos cambiados.
- Confirmar que no se conecto Azure SQL ni se crearon recursos Azure.

## Handoff esperado

Crear o actualizar `tasks/TASK-037-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
