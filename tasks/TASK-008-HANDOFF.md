# TASK-008 - Handoff

Nombre del equipo/chat: QA
Modo: QA
Nombre de la tarea: Ejecutar QA manual del flujo de caja
Archivo de tarea: `tasks/TASK-008.md`

## Resultado

Status: aprobada

Se ejecuto QA del flujo de caja contra la app base local servida por HTTP en `http://127.0.0.1:5173/`.

Resultado general: aprobado con observaciones. No hay P0/P1 abiertos sobre el alcance actual de app base con datos falsos.

## Ambiente

- Fecha: 2026-06-21
- App: `app/index.html`
- URL local: `http://127.0.0.1:5173/`
- Servidor: `python -m http.server 5173 --bind 127.0.0.1 --directory app`
- Navegador/evidencia visual: Microsoft Edge headless para capturas desktop/mobile.
- API/backend: no aplica.
- Azure SQL / DB cloud: No.

## Archivos cambiados

- `docs/TASK_BOARD.md`
- `tasks/TASK-008.md`
- `tasks/TASK-008-HANDOFF.md`

## Verificacion ejecutada

- Lectura de `tasks/TASK-008.md`.
- Lectura de `docs/QA_CHECKLIST_FLUJO_CAJA.md`.
- Lectura de `docs/QA_TEST_PLAN.md`.
- Lectura de `tasks/TASK-003-HANDOFF.md`.
- Lectura de `tasks/TASK-005-HANDOFF.md`.
- HTTP 200 para `/`, `/styles.css` y `/src/main.js`.
- Captura desktop: `tmp/task-008-app-desktop.png`.
- Captura mobile: `tmp/task-008-app-mobile.png`.
- Ejecucion funcional local sobre modulos `app/src/state.js`, `app/src/data.js` y `app/src/ui.js`.
- Revision de handlers en `app/src/main.js`.

Limitacion de herramienta:

- El navegador integrado no pudo arrancar por restriccion del sandbox de Windows.
- Playwright empaquetado no pudo usarse porque falta `playwright-core`.
- Se uso Edge headless para evidencia visual y scripts locales para validar comportamiento funcional.

## Resultado por caso

| ID | Resultado | Evidencia / nota |
| --- | --- | --- |
| QA-CJ-001 | Pasa | HTTP 200 y captura desktop muestran Caja rapida, categorias, productos, cuentas, totales y acciones principales. |
| QA-CJ-002 | Pasa | Crear cuenta genera `Cuenta 4` y queda activa. |
| QA-CJ-003 | Pasa | Renombrar cuenta acepta nombre valido y conserva lineas. |
| QA-CJ-004 | Pasa | Nombre vacio no reemplaza el nombre existente. |
| QA-CJ-005 | Pasa | Agregar Espresso crea linea con cantidad 1. |
| QA-CJ-006 | Pasa | Agregar mismo articulo acumula cantidad en una sola linea. |
| QA-CJ-007 | Pasa | Busqueda por `latte` encuentra `Latte vainilla`. |
| QA-CJ-008 | Pasa | Busqueda por `CAF-004` encuentra `Latte vainilla`. |
| QA-CJ-009 | Pasa | Limpiar busqueda restaura todos los productos. |
| QA-CJ-010 | Pasa | Aumentar cantidad cambia de 2 a 3. |
| QA-CJ-011 | Pasa | Disminuir cantidad cambia de 3 a 2. |
| QA-CJ-012 | Pasa | Disminuir hasta cero elimina la linea. |
| QA-CJ-013 | Pasa | Cambiar entre cuentas conserva lineas de la cuenta original. |
| QA-CJ-014 | Pasa | Agregar articulo en otra cuenta no altera la cuenta anterior. |
| QA-CJ-015 | Pasa | Totales esperados: subtotal 1850, impuesto 241, total 2091. |
| QA-CJ-016 | Pasa | Metodo activo cambia a `SINPE`. |
| QA-CJ-017 | Pasa | `showReceipt` abre ticket con lineas, metodo de pago y total correcto. |
| QA-CJ-018 | Pasa | Cuenta vacia no abre ticket. |
| QA-CJ-019 | Pasa | Cierre de dialog deja modal cerrado. |
| QA-CJ-020 | Pasa | Handler de `#print-receipt` invoca `window.print()`. |
| QA-CJ-021 | No aplica / gap esperado | Boton `PR` existe como accion visual, pero no hay handler de reimpresion ni tickets persistidos. Severidad futura si se requiere: P2. |
| QA-CJ-022 | No aplica / gap esperado | No hay accion de anulacion/cancelacion implementada en app base. Severidad futura si se requiere: P1. |
| QA-CJ-023 | Pasa | Navegacion entre vistas no destruye estado de cuentas; el estado vive en memoria del modulo. |
| QA-CJ-024 | Pasa con observacion | Desktop correcto. Mobile apila layout; hay navegacion horizontal en sidebar, pero no se observo solape bloqueante en captura inicial. |
| QA-CJ-025 | Pasa | Captura visual muestra moneda CRC y textos criticos sin caracteres corruptos. |

## Hallazgos

### P0/P1

- Ninguno para el alcance actual de app base con datos falsos.

### P2/P3

- P2 futuro: reimpresion de ultimo ticket no esta implementada; hoy queda como gap esperado porque no hay tickets persistidos.
- P2 observacion: en mobile aparece desplazamiento horizontal en la barra superior/sidebar. No bloquea el flujo observado, pero conviene revisarlo antes de PO Test si el PO probara en telefono.
- P3: boton `CG` de abrir gaveta existe como placeholder visual sin handler; fuera del checklist critico actual.

## Riesgos o pendientes

- No hay backend, persistencia, usuarios, permisos, anulacion real ni descuento de inventario.
- La aprobacion no cubre Azure, SQL, deploy ni datos reales.
- La evidencia interactiva se obtuvo por scripts funcionales y capturas headless, no por browser interactivo completo, por limitacion de herramienta.

## Recomendacion QA

La app base queda lista para PO Test del flujo visual/operativo de caja rapida con datos falsos, con estas advertencias:

- Avisar al PO que reimpresion, anulacion, permisos, persistencia e inventario real son gaps esperados.
- Si PO Test sera en telefono, conviene una tarea corta de ajuste responsive antes o durante la revision.
- No bloquear por P0/P1 en `TASK-008`.

## Movimiento de tablero

- De: In Progress
- A: Needs Review

