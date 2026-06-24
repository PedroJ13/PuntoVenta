# TASK-036 - Conectar API a SQL local para cuentas abiertas

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Prioridad: P1 pre-lanzamiento

## Contexto

`TASK-035` conecto lectura de catalogo a SQL Server Express local con fallback fake. El siguiente paso controlado es conectar cuentas abiertas a SQL local, manteniendo ventas, checkout y caja diaria fuera de alcance.

## Objetivo

Implementar repositorios SQL locales para cuentas abiertas y sus lineas, usando configuracion local segura y fallback fake.

## Alcance

- Implementar repositorio SQL para listar cuentas abiertas por empresa.
- Implementar detalle de cuenta abierta con lineas.
- Implementar crear cuenta abierta.
- Implementar renombrar/cancelar cuenta abierta.
- Implementar agregar, actualizar y eliminar lineas.
- Resolver empresa/tenant server-side desde auth fake/configuracion local.
- Mantener fallback fake cuando SQL no este configurado o no este disponible.
- Agregar tests para modo fake/fallback y modo SQL si el entorno local lo permite.

## Fuera de alcance

- No conectar checkout/ventas a SQL.
- No conectar caja diaria a SQL.
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
- `docs/SQL_SERVER_EXPRESS_LOCAL.md`
- `tasks/TASK-015-HANDOFF.md`
- `tasks/TASK-033-HANDOFF.md`
- `tasks/TASK-034-HANDOFF.md`
- `tasks/TASK-035-HANDOFF.md`
- `api/README.md`

## Dependencia

- Liberada por `TASK-035`.

## Criterios de aceptacion

- [x] API puede listar cuentas abiertas desde SQL local cuando esta configurado.
- [x] API puede crear/renombrar/cancelar cuentas abiertas en SQL local.
- [x] API puede administrar lineas de cuenta abierta en SQL local.
- [x] API mantiene fallback fake sin SQL configurado o si SQL falla.
- [x] No se guardan connection strings ni secretos reales.
- [x] No se conecta Azure SQL.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Ejecutar tests locales de `api/`.
- Si SQL local esta disponible, probar CRUD de cuentas abiertas contra base local con migraciones/seeds.
- Buscar secretos en archivos cambiados.
- Confirmar que no se conecto Azure SQL ni se crearon recursos Azure.

## Handoff esperado

Crear o actualizar `tasks/TASK-036-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
