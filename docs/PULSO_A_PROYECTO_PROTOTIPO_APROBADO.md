# Pulso a Proyecto - Prototipo aprobado y arranque de tareas

Fecha: 2026-06-20

## Contexto

El prototipo local fue aprobado como vision inicial del producto.

Prototipo:

- `prototype/index.html`

Documento funcional base:

- `docs/DEFINICION_PROYECTO.md`

Estado actual:

- El proyecto ya no esta solo en exploracion.
- Hay vision funcional aceptada para avanzar a tareas.
- El siguiente paso debe ser ordenar el MVP en tareas pequenas para `Ejecucion Tecnica`, `QA` y futuras validaciones PO.

## Decision confirmada por PO/usuario

### Prototipo aprobado

La pantalla de ventas y las vistas de materia prima, articulos y recetas son una base aceptada para continuar.

Implicacion:

- Proyecto puede crear tareas a partir del prototipo.
- Ejecucion Tecnica puede convertir el prototipo en app base cuando Proyecto lo libere.
- QA puede preparar checklist inicial sobre el flujo de caja.

### Infra disponible

Se cuenta con Azure para:

- Azure Static Web Apps / Web.
- Azure Functions como API si se decide ese modelo.
- Azure SQL Database de bajo costo para datos.

Guia de referencia indicada:

- `C:\Work\azure-infra-templates\WEB_AZURE_STATIC_APPS_FUNCTIONS.md`
- `C:\Work\azure-infra-templates\AZURE_SQL_DATABASE.md`

Recomendacion:

- Usar Azure Static Web Apps para frontend.
- Usar Azure Functions para API HTTP.
- Usar Azure SQL Database serverless o configuracion de bajo costo para piloto/MVP.
- No conectar Azure SQL para tareas visuales o frontend.
- Mantener secretos fuera del repo.

## Lectura recomendada para Proyecto

Antes de crear tareas:

- `AGENTS.md`
- `docs/README.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/TASK_BOARD.md`
- `docs/DEFINICION_PROYECTO.md`
- `docs/DECISION_LOG.md`
- `docs/BACKLOG.md`
- `C:\Work\azure-infra-templates\WEB_AZURE_STATIC_APPS_FUNCTIONS.md`
- `C:\Work\azure-infra-templates\AZURE_SQL_DATABASE.md`

## Riesgos que Proyecto debe controlar

### Riesgo 1: construir backend antes de cerrar modelo minimo

El producto depende mucho del modelo de inventario:

- materia prima;
- articulo comprado;
- articulo preparado;
- receta;
- consumo por venta;
- ajuste/merma.

Si esto se improvisa tarde, la caja puede vender bien pero el inventario quedara fragil.

### Riesgo 2: hacer una app demasiado grande desde el inicio

El MVP debe girar alrededor de:

- venta rapida;
- cuentas abiertas;
- ticket de caja;
- caja/turno;
- catalogo;
- compras;
- inventario por receta;
- reportes basicos.

No conviene abrir aun:

- facturacion electronica;
- multi-sucursal;
- modo offline;
- impresora termica real;
- contabilidad;
- programa de lealtad.

### Riesgo 3: despertar Azure SQL demasiado pronto

Segun la guia de infra, Azure SQL debe usarse solo cuando haya:

- migraciones aprobadas;
- smoke final;
- bug que solo se reproduce en Azure;
- validacion real necesaria.

Para prototipo, UX, copy o frontend visual, usar datos falsos, mocks o local.

## Tareas sugeridas para Proyecto

### TASK-001 - Cerrar alcance MVP y decisiones pendientes

Equipo sugerido: Proyecto

Prioridad: MVP bloqueante

Objetivo:

Convertir el prototipo aprobado y la definicion funcional en alcance MVP cerrado.

Debe decidir:

- Si cuentas abiertas reservan inventario o descuentan solo al cobrar.
- Si consumidor final sera cliente por defecto.
- Si impuestos se calculan desde MVP o quedan configurables.
- Si depositos/envases entran en MVP o fase 2.
- Si codigo de barras entra desde MVP.
- Si recetas descuentan insumos al vender o mediante produccion previa por lote.
- Si MVP tendra una caja/terminal o varias.
- Reportes indispensables del primer piloto.

Salida esperada:

- Actualizar `docs/MVP_RELEASE_STATUS.md`.
- Actualizar `docs/DECISION_LOG.md`.
- Actualizar `docs/BACKLOG.md`.
- Crear tareas tecnicas pequenas.

### TASK-002 - Modelo de datos MVP

Equipo sugerido: Ejecucion Tecnica

Modo de ejecucion: SQL DEV / Data

Prioridad: MVP bloqueante

Objetivo:

Definir el modelo de datos inicial antes de construir backend.

Entidades minimas:

- Empresa.
- Usuario.
- Rol.
- Caja/terminal.
- Turno de caja.
- Categoria.
- Articulo.
- Materia prima / insumo.
- Receta.
- Ingrediente de receta.
- Cuenta abierta.
- Venta.
- Detalle de venta.
- Pago.
- Compra.
- Detalle de compra.
- Movimiento de inventario.
- Movimiento de caja.

Regla clave:

- El inventario de materia prima se maneja en unidad base, por ejemplo gramos/ml/unidades.
- Los articulos preparados descuentan insumos segun receta al vender.

Uso Azure SQL:

- No usar Azure SQL todavia.
- Entregar modelo y scripts/migraciones propuestos localmente.

### TASK-003 - Convertir prototipo en app base

Equipo sugerido: Ejecucion Tecnica

Modo de ejecucion: Web Dev

Prioridad: MVP bloqueante

Objetivo:

Pasar el prototipo aprobado a una estructura de app mantenible.

Alcance sugerido:

- Mantener datos falsos.
- Separar pantalla de ventas, catalogo, inventario y recetas.
- Mantener cuentas abiertas y ticket de caja funcionales en frontend.
- Preparar estructura compatible con deploy futuro en Azure Static Web Apps.

Uso Azure SQL:

- No.

### TASK-004 - Contrato API MVP

Equipo sugerido: Ejecucion Tecnica

Modo de ejecucion: Backend/API

Prioridad: MVP bloqueante

Objetivo:

Definir contratos API antes de implementar persistencia.

Contratos sugeridos:

- Articulos.
- Categorias.
- Materia prima/insumos.
- Recetas.
- Cuentas abiertas.
- Ventas.
- Pagos.
- Compras.
- Movimientos de inventario.
- Caja/turnos.
- Reportes basicos.

Uso Azure SQL:

- No para esta tarea.

### TASK-005 - Checklist QA inicial del flujo de caja

Equipo sugerido: QA

Prioridad: MVP bloqueante

Objetivo:

Crear checklist de validacion para la caja antes de avanzar a backend.

Flujos minimos:

- Crear cuenta abierta.
- Agregar articulos.
- Cambiar cantidades.
- Cambiar entre cuentas.
- Cobrar.
- Generar ticket.
- Reimprimir/anular cuando exista.
- Confirmar que la venta descuenta inventario segun tipo de articulo cuando exista backend.

### TASK-006 - Plan inicial de infraestructura Azure

Equipo sugerido: Ejecucion Tecnica

Modo de ejecucion: Infra

Prioridad: P1 pre-lanzamiento

Objetivo:

Definir recursos Azure sin crearlos aun, salvo autorizacion expresa.

Referencia:

- `C:\Work\azure-infra-templates\WEB_AZURE_STATIC_APPS_FUNCTIONS.md`
- `C:\Work\azure-infra-templates\AZURE_SQL_DATABASE.md`

Salida esperada:

- Propuesta de nombres de recursos.
- Ambientes necesarios.
- Estrategia de secretos.
- Estrategia de deploy.
- Guardrails de costo para Azure SQL.

Uso Azure SQL:

- No. Solo diseno.

## Recomendacion de Pulso

Proyecto deberia mover el proyecto de `definicion temprana / prototipo visual` a `prototipo aprobado / preparacion MVP`.

Siguiente paso recomendado:

1. Crear `TASK-001` para cerrar decisiones de alcance.
2. Liberar `TASK-002` modelo de datos antes de backend.
3. Liberar `TASK-003` app base con datos falsos en paralelo si no bloquea el modelo.
4. Mantener Azure SQL apagado hasta que existan migraciones aprobadas.

## Mensaje corto para Proyecto

El prototipo fue aprobado. Hay permiso conceptual para avanzar a tareas. La prioridad es cerrar alcance MVP y modelo de datos antes de implementar backend. Infra prevista: Azure Static Web Apps, Azure Functions y Azure SQL bajo costo, siguiendo las guias en `C:\Work\azure-infra-templates`.
