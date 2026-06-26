# TASK-076 - Handoff

Nombre del equipo/chat:
QA

Modo:
QA

Nombre de la tarea:
TASK-076 - QA publicado Web API con persistencia Azure SQL

Archivo de tarea:
`tasks/TASK-076.md`

## Nombre de tarea culminada

TASK-076 - QA publicado Web API con persistencia Azure SQL

## Status

aprobada

## Handoff

`tasks/TASK-076-HANDOFF.md`

## Resumen

QA valido el pilot publicado Web/API con persistencia Azure SQL real. La Web publicada responde y carga assets principales. La API publicada ejecuto el smoke funcional contra Azure SQL: catalogo, caja diaria, venta rapida, ticket, cuenta abierta, cobro, reportes y relectura posterior de tickets.

Resultado QA: aprobado con observaciones. No hay P0/P1 abiertos para el alcance validado.

Uso DB cloud: Si. Motivo: `TASK-076` valida la persistencia Azure SQL habilitada por `TASK-075`.

Uso Azure SQL: Si. No se modifico Azure, no se modificaron secrets y no se crearon datos reales.

## Ambiente

- Fecha local: 2026-06-25
- Workspace: `C:\Work\Productos Digitales\PuntoVenta`
- Equipo/chat: QA
- Modo: QA
- Web publicada: `https://gray-beach-00a0f870f.7.azurestaticapps.net/`
- API publicada: `https://func-puntoventa-pilot-eastus2.azurewebsites.net/api`
- API health: `https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health`
- Storage esperado: Azure SQL via API publicada
- SQL Server: `sqlserver-puntoventa-pilot-brazilsouth` segun `TASK-075`
- SQL Database: `sqldb-puntoventa-pilot` segun `TASK-075`
- Secretos leidos o modificados: No
- Azure/GitHub Actions modificados: No
- Datos reales usados: No

## Verificacion ejecutada

### Web publicada

```text
GET/HEAD https://gray-beach-00a0f870f.7.azurestaticapps.net/
status=200
content-type=text/html
title=PuntoVenta - App POS
html length=15526
secciones HTML: Ventas=true, Caja diaria=true, Reportes=true
```

Assets publicados:

```text
https://gray-beach-00a0f870f.7.azurestaticapps.net/styles.css
status=200
content-type=text/css
length=16836

https://gray-beach-00a0f870f.7.azurestaticapps.net/src/main.js
status=200
content-type=text/javascript
length=3743

https://gray-beach-00a0f870f.7.azurestaticapps.net/src/apiClient.js
status=200
content-type=text/javascript
length=5079
hasPilotApi=true
```

CORS desde origen Web publicado:

```text
GET https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health
Origin: https://gray-beach-00a0f870f.7.azurestaticapps.net
status=200
Access-Control-Allow-Origin=https://gray-beach-00a0f870f.7.azurestaticapps.net
```

### API health y Azure SQL

Health inicial de la corrida:

```text
status=200
storage=fake
sqlConfigured=true
sqlAvailable=false
sqlLastError ausente
```

Despues de ejecutar los modulos SQL:

```text
status=200
storage=sql-local
catalog=sql-local
openAccounts=sql-local
cashShifts=sql-local
sales=sql-local
reports=sql-local
sqlConfigured=true
sqlAvailable=true
sqlLastError ausente
```

Health con CORS permitido al final:

```text
status=200
storage=sql-local
sqlConfigured=true
sqlAvailable=true
```

Nota: el valor `sql-local` es la etiqueta actual del API para el repositorio SQL configurado; en este ambiente publicado corresponde a Azure SQL segun `TASK-075` y `docs/PILOT_DEPLOY_CONFIG.md`.

### Smoke funcional publicado

Smoke ejecutado contra `https://func-puntoventa-pilot-eastus2.azurewebsites.net/api`:

```text
web-head ok: status=200, contentType=text/html
catalog ok: categories=4, items=7
item usado: id=2, sku=LATTE, name="Cafe latte", salePrice=1800, taxRate=0
cash-shift-before ok: cashShiftId=1, status=open, expectedCashAmount=31800
quick-sale-ticket ok: saleId=2, ticketNumber=PV-0000002, totalAmount=1800
open-account-sale-ticket ok: accountId=1, saleId=3, ticketNumber=PV-0000003, totalAmount=1800
reports ok: salesCount=3, totalAmount=5400, salesByItem=1, topItems=1, lowStock=0, cashExpected=35400
persistence-reread ok: PV-0000002 y PV-0000003 se releyeron correctamente; currentExpectedCashAmount=35400
health-final ok: SQL disponible y todos los modulos en sql-local
```

Persistencia basica validada:

```text
GET /api/sales/2/ticket -> ticketNumber=PV-0000002, totalAmount=1800
GET /api/sales/3/ticket -> ticketNumber=PV-0000003, totalAmount=1800
GET /api/cash-shifts/current?terminalId=1 -> expectedCashAmount=35400
GET /api/reports/sales-summary -> salesCount=3, totalAmount=5400
GET /api/reports/cash-shift/1 -> expectedCashAmount=35400
```

## Resultado por criterio

| Criterio | Resultado | Evidencia |
| --- | --- | --- |
| Web/API publicados validados | Cumple | Web `200`, assets principales `200`, API health `200`, CORS permitido correcto. |
| Azure SQL confirmado en uso | Cumple | Health final `sqlConfigured=true`, `sqlAvailable=true`, modulos SQL activos; smoke funcional usa datos SQL persistidos. |
| Smoke funcional publicado ejecutado | Cumple | Caja, venta rapida, ticket, cuenta abierta, cobro y reportes pasaron. |
| Persistencia basica validada | Cumple | Tickets y reportes se releyeron despues de las escrituras; caja esperada subio de `31800` a `35400`. |
| Hallazgos clasificados por severidad | Cumple | Ver hallazgos. |
| Veredicto claro | Cumple | Aprobado con observaciones. |

## Hallazgos

### P0/P1

- Ninguno.

### P2/P3

- P2: `GET /api/health` en el inicio frio de la corrida reporto `storage=fake` y `sqlAvailable=false` aunque `sqlConfigured=true`; despues de usar los modulos SQL, health final reporto SQL disponible en todos los modulos. Impacto: puede confundir monitoreo/readiness si se interpreta el primer health como prueba inmediata de disponibilidad SQL. Workaround: validar health final tras tocar modulos o ajustar health futuro para probar SQL explicitamente.
- P3: `docs/PILOT_BASELINE_RUNBOOK.md` todavia describe el baseline anterior sin Azure SQL. El estado operativo y `docs/PILOT_DEPLOY_CONFIG.md` estan actualizados para la fase con Azure SQL, pero el runbook puede inducir confusion si se usa como fuente unica.
- P3: No se pudo usar navegador integrado en esta corrida (`iab` no disponible); la Web se valido por HTTP/assets y CORS, mientras que el flujo funcional se valido por API publicada. No bloquea el resultado porque la Web ya habia sido aprobada visualmente en `TASK-062`/`TASK-071` y esta tarea se enfoca en persistencia.

## Archivos principales cambiados

- `docs/TASK_BOARD.md`
- `tasks/TASK-076.md`
- `tasks/TASK-076-HANDOFF.md`

## Pendientes o riesgos

- Mantener datos reales fuera hasta veredicto PO posterior de persistencia Azure SQL.
- Considerar una tarea tecnica menor para que health publique una senal SQL inmediata y no dependa de calentamiento por modulos.
- Actualizar `docs/PILOT_BASELINE_RUNBOOK.md` o crear runbook de baseline con Azure SQL para evitar contradiccion documental.

## Siguiente accion recomendada

Proyecto puede procesar este handoff. Si acepta QA sin P0/P1, liberar PO Test de persistencia publicada antes de permitir datos reales.

## Movimiento de tablero

- De: In Progress
- A: Needs Review
