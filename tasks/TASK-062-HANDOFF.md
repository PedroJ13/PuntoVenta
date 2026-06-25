# TASK-062 - Handoff

Nombre del equipo/chat:
QA

Modo:
QA

Nombre de la tarea:
TASK-062 - QA publicado Web API pilot sin Azure SQL

Archivo de tarea:
`tasks/TASK-062.md`

## Nombre de tarea culminada

TASK-062 - QA publicado Web API pilot sin Azure SQL

## Status

aprobada

## Handoff

`tasks/TASK-062-HANDOFF.md`

## Resumen

QA valido la superficie publicada pilot Web/API sin Azure SQL. La Web publicada responde, renderiza la app POS y carga assets principales. La API publicada responde health en modo fake con `sqlConfigured:false`. El smoke funcional publico completo paso por catalogo, caja diaria abierta, venta rapida, ticket, cuenta abierta, cobro, ticket y reportes.

Resultado QA: aprobado con observaciones.

Uso Azure SQL: No.

## Ambiente

- Fecha: 2026-06-25
- Workspace: `C:\Work\Productos Digitales\PuntoVenta`
- Equipo/chat: QA
- Modo: QA
- Web publicada: `https://gray-beach-00a0f870f.7.azurestaticapps.net/`
- API publicada: `https://func-puntoventa-pilot-eastus2.azurewebsites.net/api`
- API health: `https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health`
- Azure SQL creado o usado: No
- Secretos modificados o leidos: No
- Azure/GitHub Actions modificados: No

## Verificacion ejecutada

### Web publicada

Consulta HTTP:

```text
GET/HEAD https://gray-beach-00a0f870f.7.azurestaticapps.net/
status=200
content-type=text/html
title=PuntoVenta - App POS
html length=15526
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

Validacion en navegador:

```text
url=https://gray-beach-00a0f870f.7.azurestaticapps.net/
title=PuntoVenta - App POS
secciones visibles: Ventas, Caja diaria, Materia prima, Articulos, Recetas, Reportes
pantalla visible: PANTALLA DE VENTAS / Caja rapida / Nueva cuenta / Cobrar e imprimir ticket
consola capturada: sin errores ni warnings
```

### API health publicada

```text
GET https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health
status=200
storage=fake
storageDetails.catalog=fake
storageDetails.openAccounts=fake
storageDetails.cashShifts=fake
storageDetails.sales=fake
storageDetails.reports=fake
storageDetails.sqlConfigured=false
storageDetails.sqlAvailable=false
```

### Smoke funcional publico

Smoke ejecutado contra la API pilot publicada:

```text
catalog ok: categories=3, items=3, saleItem="Croissant mantequilla", salePrice=1600, taxRate=0.13, expectedTotal=1808
cash-shift ok: cashShiftId=5, status=open, expectedCashAmount=25000
quick-sale-ticket ok: saleId=1001, ticketNumber=PV-0001001, totalAmount=1808
open-account-sale-ticket ok: accountId=502, saleId=1002, ticketNumber=PV-0001002, totalAmount=1808
reports ok: salesCount=2, totalAmount=3616, salesByItem=1, topItems=1, lowStock=1, cashExpected=28616
health-final ok: storage=fake, sqlConfigured=false, sqlAvailable=false
```

Validacion de error esperado:

```text
POST /api/sales/checkout con pago de 1600 para articulo con impuesto 13%
status=400
code=VALIDATION_ERROR
message=Payments must match sale total.
details: Expected 1808, received 1600.
```

## Resultado por criterio

| Criterio | Resultado | Evidencia |
| --- | --- | --- |
| Web publicada responde y carga | Cumple | `HTTP 200`, HTML y assets principales `200`, app renderizada en navegador. |
| API health publicada responde | Cumple | `HTTP 200`, `storage=fake`, `sqlConfigured:false`. |
| Smoke funcional publicado ejecutado | Cumple | Venta rapida, cuenta abierta, tickets y reportes pasaron contra API publica. |
| Hallazgos clasificados por severidad | Cumple | Ver hallazgos. |
| Azure SQL confirmado fuera de uso | Cumple | Health reporta `sqlConfigured:false` y `sqlAvailable:false`; no se creo ni uso Azure SQL en esta QA. |
| Veredicto claro | Cumple | Aprobado con observaciones. |
| Handoff indica `Uso Azure SQL: No` | Cumple | Indicado en resumen y ambiente. |

## Hallazgos

### P0/P1

- Ninguno.

### P2/P3

- P2: `basicPublishingCredentialsPolicies/scm allow:true` sigue habilitado temporalmente en Function App pilot segun `TASK-061`. No bloquea el smoke funcional QA, pero debe cerrarse con la tarea Infra de OIDC/RBAC y volver `scm allow:false`.
- P2: CORS amplio de compatibilidad MVP permanece como riesgo tecnico ya documentado en `docs/PILOT_DEPLOY_CONFIG.md` y `tasks/TASK-061-HANDOFF.md`. No bloqueo QA publicada porque Web/API pilot funcionan.

## Archivos principales cambiados

- `docs/TASK_BOARD.md`
- `tasks/TASK-062.md`
- `tasks/TASK-062-HANDOFF.md`

## Pendientes o riesgos

- La API publicada usa storage fake; esto es esperado para el primer deploy sin Azure SQL, pero no reemplaza una futura QA con persistencia real.
- SCM basic publishing sigue habilitado temporalmente en pilot hasta migracion Infra a OIDC/RBAC.
- Esta QA no crea ni valida Azure SQL.

## Siguiente accion recomendada

Proyecto puede procesar este handoff. Si acepta QA publicada sin P0/P1, crear tarea Infra para migrar API deploy a GitHub OIDC/RBAC y luego volver `basicPublishingCredentialsPolicies/scm allow:false`.

## Movimiento de tablero

- De: In Progress
- A: Needs Review
