# MVP Release Status

## Estado actual

Fase: definicion temprana / prototipo visual.

Decision inicial: MVP operativo web para cafeteria/despacho, sin manejo de mesas y sin facturacion electronica por ahora.

## Tablero operativo corto

### Ahora

- Alcance funcional inicial documentado en `docs/DEFINICION_PROYECTO.md`.
- Prototipo local de pantalla de ventas y vistas de inventario/articulos/recetas creado en `prototype/index.html`.
- Repo local Git inicializado.
- Flujo Codex de Proyecto / Pulso / QA / Ejecucion Tecnica incorporado al repo.

### Siguiente

- Proyecto debe crear `TASK-001` para cerrar alcance MVP y primeras tareas tecnicas.
- Definir arquitectura tecnica inicial antes de construir backend/base de datos.
- Validar el prototipo con PO y capturar ajustes prioritarios.

### Bloqueado

- Ningun bloqueo documentado todavia.

### Hecho

- Bootstrap documental inicial.
- Documento de definicion funcional inicial.
- Prototipo visual local.

## Riesgos principales

- Empezar a implementar backend/DB antes de cerrar reglas de inventario, caja y cuentas abiertas.
- Confundir ticket de caja con facturacion electronica.
- Modelar materia prima como productos finales fijos en vez de consumo variable por receta.
- Crear tareas demasiado grandes.
- Instalar o conectar servicios sin decision de costo/seguridad.
- Guardar secretos en archivos.

## Siguiente paso recomendado

Validar con el PO el prototipo de caja y crear `TASK-001` para arquitectura y modelo de datos MVP.

