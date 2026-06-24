# TASK-002 - Definir modelo de datos MVP

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: SQL DEV / Data
Prioridad: MVP bloqueante

## Contexto

El inventario de PuntoVenta depende de separar materia prima, articulos vendidos, recetas, compras, ventas y movimientos. El modelo minimo debe quedar claro antes de construir backend o persistencia.

## Objetivo

Definir el modelo de datos inicial del MVP y proponer scripts/migraciones locales, sin usar Azure SQL todavia.

## Alcance

- Definir entidades MVP: Empresa, Usuario, Rol, Caja/terminal, Turno de caja, Categoria, Articulo, Materia prima/insumo, Receta, Ingrediente de receta, Cuenta abierta, Venta, Detalle de venta, Pago, Compra, Detalle de compra, Movimiento de inventario y Movimiento de caja.
- Modelar inventario en unidad base para materia prima, por ejemplo gramos, ml o unidades.
- Modelar articulos preparados que descuentan insumos segun receta al vender.
- Proponer constraints, indices iniciales y relaciones.
- Proponer archivos bajo `database/` si el proyecto aun no los tiene.

## Fuera de alcance

- No implementar API.
- No implementar UI.
- No aplicar migraciones en Azure SQL.
- No crear datos reales de clientes.
- No relajar integridad para resolver casos puntuales.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/TASK_BOARD.md`
- `docs/DEFINICION_PROYECTO.md`
- `docs/DECISION_LOG.md`
- `docs/PULSO_A_PROYECTO_PROTOTIPO_APROBADO.md`
- `C:\Work\azure-infra-templates\AZURE_SQL_DATABASE.md`
- `tasks/TASK-001-HANDOFF.md`

## Dependencia

- Liberada por `TASK-001`.

## Criterios de aceptacion

- [x] El modelo cubre las entidades MVP indicadas.
- [x] Las reglas de inventario por receta quedan reflejadas en tablas y relaciones.
- [x] El diseno separa productos comprados, preparados, materia prima e insumos operativos.
- [x] Hay propuesta local de schema/migracion revisable.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Revision de archivos SQL o documento tecnico creado.
- Validacion local de sintaxis si se agregan scripts.
- No debe existir conexion a Azure SQL para esta tarea.

## Handoff esperado

Crear o actualizar `tasks/TASK-002-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
