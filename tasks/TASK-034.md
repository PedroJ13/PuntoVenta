# TASK-034 - Crear seeds locales ficticios para SQL Server Express

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: SQL DEV/Data
Prioridad: P1 pre-lanzamiento

## Contexto

`TASK-033` valido que las migraciones MVP se ejecutan correctamente en SQL Server Express local. Antes de conectar la API a repositorios SQL reales, conviene tener seeds locales ficticios y repetibles para empresa demo, terminal, usuarios, catalogo, recetas y datos minimos de operacion.

## Objetivo

Crear seeds locales ficticios para desarrollo con SQL Server Express, sin datos reales, sin secretos y sin Azure.

## Alcance

- Crear carpeta o archivo de seeds locales bajo `database/seeds/local/`.
- Incluir empresa demo, terminal, usuarios/roles minimos, categorias, articulos, recetas o insumos necesarios segun el modelo actual.
- Incluir datos suficientes para que una API SQL futura pueda listar catalogo, operar caja y probar cuentas/ventas.
- Mantener separacion por `company_id`.
- Documentar como ejecutar los seeds localmente.
- Indicar si los seeds son idempotentes o su precondicion exacta.
- No guardar passwords reales; usar datos ficticios o placeholders seguros.

## Fuera de alcance

- No conectar API a SQL Server local.
- No crear repositorios SQL en API.
- No modificar UI Web.
- No ejecutar seeds contra datos reales.
- No crear recursos Azure.
- No conectar Azure SQL.
- No guardar connection strings, passwords ni secretos.
- No borrar datos reales.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/TASK_BOARD.md`
- `docs/SQL_SERVER_EXPRESS_LOCAL.md`
- `docs/DATA_MODEL.md`
- `tasks/TASK-027-HANDOFF.md`
- `tasks/TASK-033-HANDOFF.md`
- `database/migrations/20260620_001_initial_mvp_schema.sql`
- `database/migrations/20260622_002_daily_cash_flow.sql`

## Dependencia

- Liberada por `TASK-033`.

## Criterios de aceptacion

- [x] Existen seeds locales ficticios en `database/seeds/local/` o ruta documentada.
- [x] Los seeds incluyen empresa demo y datos operativos minimos.
- [x] Los seeds respetan `company_id` y no mezclan tenants.
- [x] Queda documentado como ejecutarlos localmente.
- [x] No se guardan secretos ni datos reales.
- [x] No se conecta Azure SQL.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Revision estatica de los scripts de seed.
- Si se ejecutan localmente, usar solo base local de desarrollo/validacion y documentar nombre de base.
- Busqueda de secretos en archivos cambiados.
- Confirmar que no se conecto Azure SQL ni se crearon recursos Azure.

## Handoff esperado

Crear o actualizar `tasks/TASK-034-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
