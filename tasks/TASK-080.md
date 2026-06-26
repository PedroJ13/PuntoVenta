# TASK-080 - Preparar plantilla de carga inicial real y checklist de validacion

## Estado

Done

## Nombre del Equipo

Ejecucion Tecnica

## Modo

SQL DEV/Data

## Nombre de la tarea

TASK-080 - Preparar plantilla de carga inicial real y checklist de validacion

## Handoff esperado

Al finalizar, debe crear o actualizar `tasks/TASK-080-HANDOFF.md` usando el formato de handoff indicado.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/README.md`
- `docs/ESTADO_OPERATIVO.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/TASK_BOARD.md`
- `docs/DATA_MODEL.md`
- `docs/INITIAL_REAL_DATA_LOAD_PLAN.md`
- `tasks/TASK-079-HANDOFF.md`

## Objetivo

Preparar una plantilla de captura de datos reales y un checklist de validacion previa para la carga inicial del tenant real del pilot.

## Alcance

- Crear una plantilla en formato usable por Proyecto/PO para entregar datos reales.
- La plantilla debe cubrir, como minimo:
  - `company`;
  - `roles`;
  - `users`;
  - `terminals`;
  - `categories`;
  - `items`;
  - `recipes`;
  - `recipe_ingredients`;
  - `customers_optional`;
  - `suppliers_optional`;
  - `opening_cash_plan`.
- Incluir columnas esperadas, campos requeridos, ejemplos ficticios y notas de validacion.
- Preparar un checklist de validacion previa de archivo/fuente, alineado con `docs/INITIAL_REAL_DATA_LOAD_PLAN.md`.
- Documentar reglas de privacidad y seguridad:
  - no passwords;
  - no PINs planos;
  - no tokens;
  - no connection strings;
  - no datos personales innecesarios.
- Documentar validaciones minimas:
  - tenant real distinto de `PV-DEMO-LOCAL`;
  - unicidad de claves naturales;
  - referencias entre hojas;
  - montos CRC enteros;
  - unidades e inventario consistentes;
  - recetas con ingredientes existentes.
- Proponer como Proyecto/PO debe revisar y aprobar la fuente antes de preparar scripts o carga.

## Fuera de alcance

- No cargar datos reales.
- No ejecutar scripts SQL.
- No conectarse a Azure SQL.
- No modificar datos demo.
- No modificar API, Web, Azure, secrets, firewall ni App Settings.
- No pedir ni registrar passwords, tokens, connection strings, PINs planos, datos de tarjetas o datos bancarios.
- No crear scripts de carga finales; eso queda para una tarea posterior.

## Criterios de aceptacion

- [x] Existe una plantilla de datos reales en formato revisable.
- [x] La plantilla cubre todas las hojas/tablas esperadas o documenta por que alguna no aplica.
- [x] La plantilla incluye ejemplos ficticios y no contiene datos reales sensibles.
- [x] Existe checklist de validacion previa antes de cualquier carga.
- [x] La documentacion explica que la carga real sigue bloqueada hasta aprobacion de Proyecto/PO.
- [x] Handoff indica `Uso Azure SQL: No` si no se conecta ni modifica la base.

## Verificacion esperada

- Revisar que la plantilla abre correctamente en herramienta local disponible.
- Revisar que no contiene secretos ni datos sensibles reales.
- Revisar que encabezados y reglas coinciden con `docs/INITIAL_REAL_DATA_LOAD_PLAN.md`.
- Ejecutar verificacion documental local; no usar Azure SQL.
