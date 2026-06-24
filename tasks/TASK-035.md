# TASK-035 - Conectar API a SQL local para catalogo

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Prioridad: P1 pre-lanzamiento

## Contexto

`TASK-033` valido migraciones en SQL Server Express local y `TASK-034` creo seeds locales ficticios. El siguiente paso seguro es conectar una parte acotada de la API a SQL local: lectura de catalogo, manteniendo fallback fake y sin tocar ventas/caja/cuentas todavia.

## Objetivo

Implementar conexion API local a SQL Server Express para endpoints de catalogo de solo lectura, usando configuracion local segura y sin secretos versionados.

## Alcance

- Agregar configuracion local por variables de entorno para usar SQL Server Express.
- Implementar cliente/conector SQL local sin guardar connection strings reales.
- Implementar repositorio SQL de categorias/articulos de solo lectura.
- Mantener fallback fake cuando SQL no este configurado o no disponible.
- Hacer que `GET /api/categories` y `GET /api/items` puedan leer desde SQL local con los seeds de `TASK-034`.
- Actualizar `GET /api/health` para indicar modo de almacenamiento o disponibilidad SQL sin exponer secretos.
- Agregar tests para modo fake y modo SQL si el entorno local lo permite; si no, documentar limitacion.

## Fuera de alcance

- No conectar checkout/ventas a SQL.
- No conectar caja diaria a SQL.
- No conectar cuentas abiertas a SQL.
- No crear UI Web nueva.
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
- `tasks/TASK-033-HANDOFF.md`
- `tasks/TASK-034-HANDOFF.md`
- `database/seeds/local/README.md`
- `api/README.md`

## Dependencia

- Liberada por `TASK-033` y `TASK-034`.

## Criterios de aceptacion

- [x] API puede leer categorias desde SQL local cuando esta configurado.
- [x] API puede leer articulos desde SQL local cuando esta configurado.
- [x] API mantiene fallback fake sin SQL configurado.
- [x] `GET /api/health` indica modo sin exponer secretos.
- [x] No se guardan connection strings ni secretos reales.
- [x] No se conecta Azure SQL.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Ejecutar tests locales de `api/`.
- Si SQL local esta disponible, probar lectura contra base local con seeds.
- Buscar secretos en archivos cambiados.
- Confirmar que no se conecto Azure SQL ni se crearon recursos Azure.

## Handoff esperado

Crear o actualizar `tasks/TASK-035-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
