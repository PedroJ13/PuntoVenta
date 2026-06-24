# SQL Server Express local - base tecnica

## Estado

Convenciones locales documentadas en `TASK-027`.

Este documento prepara el uso futuro de SQL Server Express local para desarrollo. No instala SQL Server, no se conecta a la maquina del usuario, no crea base real, no crea migraciones ejecutables nuevas y no guarda secretos.

## Objetivo

Dejar una base tecnica comun para que una tarea posterior pueda conectar el API local o ejecutar migraciones contra SQL Server Express local de forma controlada.

## Convencion local sugerida

| Elemento | Convencion |
| --- | --- |
| Motor | SQL Server Express o SQL Server Developer local. |
| Instancia sugerida | `localhost\\SQLEXPRESS` cuando aplique. |
| Base sugerida | `PuntoVentaLocal`. |
| Esquema inicial | `dbo`. |
| Collation | Mantener default local salvo decision explicita. |
| Moneda | CRC enteros para montos operativos. |
| Fechas | UTC para datos persistidos; hora local solo para visualizacion. |

Estas convenciones son sugeridas. La instalacion real, validacion de instancia y creacion de base quedan para una tarea futura explicita.

## Variables de entorno

No guardar connection strings reales en el repositorio.

Variables recomendadas para desarrollo local:

| Variable | Uso | Secreto |
| --- | --- | --- |
| `PV_SQLSERVER_HOST` | Host o instancia local. | No, si no contiene credenciales. |
| `PV_SQLSERVER_DATABASE` | Nombre de base local. | No. |
| `PV_SQLSERVER_AUTH_MODE` | `windows` o `sql`. | No. |
| `PV_SQLSERVER_USER` | Usuario SQL si se usa auth SQL. | Si puede ser sensible. |
| `PV_SQLSERVER_PASSWORD` | Password local si se usa auth SQL. | Si. |
| `PV_SQLSERVER_ENCRYPT` | `true` o `false` segun driver/ambiente. | No. |
| `PV_SQLSERVER_TRUST_CERT` | `true` para dev local si se requiere. | No. |
| `PV_SQLSERVER_CONNECTION_STRING` | Alternativa completa solo en ambiente local/secret manager. | Si. |

Reglas:

- Preferir variables separadas para evitar escribir una cadena completa en docs o archivos.
- Si se usa `PV_SQLSERVER_CONNECTION_STRING`, debe vivir fuera de git.
- `api/local.settings.json`, `.env`, archivos locales de secretos y perfiles personales deben estar ignorados por git.
- Los handoffs nunca deben incluir valores reales.

## Estrategia de migraciones futuras

Carpeta existente:

- `database/migrations/`

Convencion propuesta:

```text
database/migrations/YYYYMMDD_NNN_descripcion_corta.sql
```

Criterios:

- Usar T-SQL compatible con SQL Server y Azure SQL.
- Una migracion por cambio funcional pequeño.
- Incluir transaccion cuando el cambio lo permita.
- Evitar scripts destructivos sin tarea explicita, respaldo y decision documentada.
- Evitar `DROP` o perdida de datos en migraciones normales.
- Mantener nombres claros para constraints, indices y claves.
- Validar multiempresa/tenant en cada tabla operativa nueva.
- Documentar si una migracion fue solo revisada o realmente ejecutada.

La migracion inicial existente sigue siendo el punto de partida revisable:

- `database/migrations/20260620_001_initial_mvp_schema.sql`
- `database/migrations/20260622_002_daily_cash_flow.sql`

## Estrategia de seeds locales futuras

Carpeta sugerida para una tarea posterior:

```text
database/seeds/local/
```

Criterios:

- Seeds solo para desarrollo local y demo.
- Datos ficticios, nunca datos reales de clientes.
- IDs o claves naturales estables para pruebas repetibles.
- Crear al menos una empresa demo, terminal, usuario/cajero, categorias, articulos y recetas minimas.
- Cada fila operativa debe asociarse a la empresa demo correspondiente.
- Los seeds deben poder repetirse de forma controlada o documentar claramente su precondicion.
- Passwords o PINs reales no deben aparecer; si se necesita auth, usar hashes fake/documentados por tarea especifica.

## Compatibilidad con Azure SQL

Aunque el primer uso sea local, los scripts deben poder avanzar hacia Azure SQL.

Reglas:

- No usar features exclusivas de instancia local si Azure SQL no las soporta.
- Evitar dependencias de rutas de disco, `USE master`, jobs locales o configuracion de servidor.
- Usar tipos comunes: `int`, `bigint`, `decimal`, `nvarchar`, `datetime2`, `bit`.
- Usar `datetime2` para fechas persistidas.
- Mantener constraints de integridad en SQL, no solo en API.
- Mantener indices por `company_id`, estado y fechas operativas.
- No usar credenciales admin como usuario runtime.
- Separar permisos de migracion y permisos de runtime.

## Multiempresa y tenant

Reglas obligatorias:

- Toda tabla operativa nueva debe tener `company_id` salvo tablas realmente globales y justificadas.
- Las busquedas operativas deben filtrar por empresa.
- Unicidades funcionales deben ser por empresa cuando corresponda.
- El API futuro debe resolver empresa server-side, no confiar en `company_id` enviado por cliente.
- Seeds locales deben incluir empresa demo explicita y no mezclar datos entre empresas.
- Reportes, ventas, inventario, caja, compras y cuentas abiertas nunca deben cruzar tenants.

## Seguridad local

- No guardar passwords, tokens, connection strings ni secretos en archivos versionados.
- No copiar errores con cadena de conexion completa a handoffs.
- No loguear connection strings completas.
- No usar usuarios admin para runtime del API.
- No compartir una base local con datos reales de clientes.
- Si se crea un usuario SQL local futuro, documentar solo el nombre logico, no la clave.

## Cambios futuros identificados

Cuando Proyecto libere una tarea de migraciones o conexion local, revisar:

- `docs/DATA_MODEL.md`: confirmar si el flujo de caja diaria requiere nuevos campos o tablas.
- `database/migrations/20260620_001_initial_mvp_schema.sql`: validar contra SQL Server local real.
- `api/`: definir repositorio SQL real separado de los repositorios fake.
- `docs/API_CONTRACTS.md`: ajustar contratos de caja si el flujo diario agrega campos.
- `.gitignore`: confirmar exclusiones de `.env`, `api/local.settings.json` y carpetas de secretos locales.

## Checklist para una tarea futura de conexion local

- Confirmar que SQL Server Express local existe y esta accesible.
- Confirmar nombre de instancia/base local con el usuario.
- Crear base local solo con autorizacion explicita.
- Ejecutar migraciones en ambiente local, no Azure.
- Cargar seeds locales ficticios si la tarea lo pide.
- Ejecutar tests del API contra repositorio SQL real o doble controlado.
- Confirmar que no se guardaron secretos.
- Registrar en handoff: `Uso Azure SQL: No`.
