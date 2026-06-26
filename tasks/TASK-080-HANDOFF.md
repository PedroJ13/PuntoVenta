# TASK-080 - Handoff

Equipo:

Ejecucion Tecnica

Modo de ejecucion:

SQL DEV/Data

Tarea completada:

TASK-080 - Preparar plantilla de carga inicial real y checklist de validacion.

Archivos cambiados:

- `docs/templates/puntoventa_carga_inicial_real_template.xlsx`
- `docs/REAL_DATA_LOAD_VALIDATION_CHECKLIST.md`
- `tasks/TASK-080.md`
- `docs/TASK_BOARD.md`
- `docs/ESTADO_OPERATIVO.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/CURRENT_BLOCKERS.md`

Verificacion ejecutada:

- Generacion local de workbook XLSX con hojas: `README`, `validation_checklist`, `company`, `roles`, `users`, `terminals`, `categories`, `items`, `recipes`, `recipe_ingredients`, `customers_optional`, `suppliers_optional`, `opening_cash_plan`.
- Inspeccion local del workbook generado y render de previsualizaciones durante la preparacion.
- Revision documental contra `docs/INITIAL_REAL_DATA_LOAD_PLAN.md`.
- Verificacion de que la entrega no ejecuta scripts SQL, no carga datos reales, no modifica API/Web/Infra y no cambia secretos.
- `git diff --check` ejecutado sin errores; solo aviso de normalizacion LF/CRLF en archivos ya modificados.
- Inspeccion OpenXML del XLSX: existe, contiene 13 hojas internas y conserva ejemplos ficticios (`PV-REAL-001`, dominio `example.invalid`) y menciones de terminos sensibles solo como reglas de no incluirlos.

Resultado:

- Plantilla XLSX creada para que Proyecto/PO capture datos reales minimos del tenant pilot.
- La plantilla incluye campos requeridos, ejemplos ficticios, notas de validacion y checklist previo.
- Checklist Markdown complementario creado para validacion de fuente antes de cualquier script o carga.
- La carga real sigue bloqueada hasta que Proyecto/PO entregue/apruebe la fuente completada y se abra una tarea posterior explicita.

Uso Azure SQL:

No. No se conecto a Azure SQL, no se ejecuto SQL real, no se cambio `PV_SQLSERVER_COMPANY_TAX_ID`, no se tocaron App Settings, firewall ni secretos.

Riesgos o pendientes:

- Proyecto/PO debe completar o entregar la fuente real usando la plantilla y aprobarla.
- No se deben preparar scripts finales ni ejecutar carga hasta tener fuente aprobada, validacion previa y mitigacion/rollback acordado.
- Si se entregan datos reales, deben mantenerse fuera del repo salvo decision explicita y manejo seguro de privacidad.

Siguiente recomendado:

Proyecto debe revisar `tasks/TASK-080-HANDOFF.md`, validar la plantilla con PO y crear una tarea posterior para scripts revisables o para aprobacion formal de la fuente.

Movimiento de tablero:

- De: `Assigned`
- A: `Needs Review`
