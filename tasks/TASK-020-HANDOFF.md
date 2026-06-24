# TASK-020 - Handoff

Equipo: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Tarea completada: Corregir montos CRC enteros en API fake.

Archivos cambiados:

- `api/src/repositories/fakeOpenAccountRepository.js`
- `api/test/openAccounts.test.js`
- `api/test/sales.test.js`
- `api/README.md`
- `docs/TASK_BOARD.md`
- `tasks/TASK-020.md`
- `tasks/TASK-020-HANDOFF.md`

Verificacion ejecutada:

- `node --test` desde `api/`: 20 tests pasan.
- Tests actualizados para cubrir checkout, ticket y cuenta abierta con montos CRC enteros.
- Busqueda con `rg` de `SQL_CONNECTION_STRING`, `connection string`, `password`, `token`, `secret`, `AccountKey`, `Server=` en `api/`.
- No se conecto Azure SQL.
- No se crearon recursos Azure.

Resultado:

- Los calculos monetarios fake usan montos enteros CRC.
- La regla documentada es redondeo al colon mas cercano con `Math.round`.
- Caso observado por QA queda corregido: `1850 * 0.13 = 240.5` ahora devuelve impuesto `241` y total `2091`.
- Checkout, cuentas abiertas y ticket devuelven subtotal, descuento, impuesto, total, pagos y lineas sin decimales.

Uso DB cloud: No
Uso Azure SQL: No
Motivo: correccion local de calculo monetario en API fake.
Alcance: codigo local y tests unitarios.
Recursos Azure creados: No
Secretos creados o expuestos: No

Riesgos o pendientes:

- La regla es suficiente para API fake local; impuestos fiscales avanzados quedan fuera de alcance.
- Antes de persistencia real, Proyecto/Backend puede decidir si documenta esta regla como contrato definitivo de moneda.

Siguiente recomendado:

- Proyecto procesa este handoff.
- QA puede revalidar el hallazgo P2 de `TASK-019`.

Movimiento de tablero:

- De: Ready
- A: Needs Review
