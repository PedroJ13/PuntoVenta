# TASK-081 - PO revisar plantilla y definir fuente real inicial

## Estado

Assigned

## Nombre del Equipo

PO Test

## Modo

PO/Data Review

## Nombre de la tarea

TASK-081 - PO revisar plantilla y definir fuente real inicial

## Handoff esperado

Al finalizar, debe crear o actualizar `tasks/TASK-081-HANDOFF.md` usando el formato de handoff indicado.

## Leer antes de trabajar

- `AGENTS.md`
- `docs/ESTADO_OPERATIVO.md`
- `docs/CURRENT_BLOCKERS.md`
- `docs/INITIAL_REAL_DATA_LOAD_PLAN.md`
- `docs/REAL_DATA_LOAD_VALIDATION_CHECKLIST.md`
- `docs/templates/puntoventa_carga_inicial_real_template.xlsx`
- `tasks/TASK-080-HANDOFF.md`

## Objetivo

Revisar la plantilla de carga inicial real y decidir si sirve para preparar la fuente real del piloto o si requiere correcciones antes de seguir.

## Alcance

- Abrir/revisar la plantilla `docs/templates/puntoventa_carga_inicial_real_template.xlsx`.
- Revisar el checklist `docs/REAL_DATA_LOAD_VALIDATION_CHECKLIST.md`.
- Confirmar si las hojas/campos son suficientes para el piloto real.
- Confirmar si la fuente real inicial se va a preparar usando esa plantilla.
- Indicar si hay campos que sobran, faltan o deben cambiarse.
- Confirmar si habra datos opcionales:
  - clientes;
  - proveedores;
  - recetas;
  - inventario inicial;
  - plan de apertura de caja.
- Indicar si la fuente real ya existe o si queda pendiente de preparar.
- Si se menciona una fuente real, mantenerla fuera del repo salvo decision explicita de Proyecto.

## Fuera de alcance

- No cargar datos reales.
- No modificar Azure SQL.
- No ejecutar SQL.
- No preparar scripts de carga.
- No modificar API, Web, Azure, secrets, firewall ni App Settings.
- No guardar passwords, PINs planos, tokens, connection strings, datos de tarjetas ni datos bancarios.
- No meter datos personales innecesarios en el repo.

## Criterios de aceptacion

- [ ] PO aprueba la plantilla o lista correcciones concretas.
- [ ] PO confirma si la fuente real inicial se preparara con esta plantilla.
- [ ] PO confirma que la carga real sigue bloqueada hasta tarea posterior.
- [ ] PO confirma si clientes/proveedores/recetas/inventario inicial/caja inicial aplican o no al primer piloto real.
- [ ] Handoff indica si se puede abrir tarea tecnica posterior para scripts revisables o si primero hay que corregir la plantilla.

## Verificacion esperada

- Handoff de PO con decision: `Aprobada`, `Aprobada con observaciones` o `Requiere correcciones`.
- Lista corta de observaciones o cambios pedidos, si aplica.
- Confirmacion explicita de que no se cargaron datos reales ni se tocaron recursos cloud.
