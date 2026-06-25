# Cloud Persistence Decision Plan

## Estado

Decision tecnica preparada por `TASK-072`.

Este documento no crea recursos, no ejecuta migraciones, no modifica Azure, no configura secrets y no conecta la API a Azure SQL.

## Decision recomendada

Avanzar hacia persistencia real cloud con Azure SQL pilot, pero en fase controlada y por tareas separadas.

La recomendacion es pasar de `storage=fake` publicado a Azure SQL solo despues de:

1. preparar y revisar migraciones compatibles con Azure SQL;
2. recibir autorizacion explicita de Proyecto/PO para crear Azure SQL pilot;
3. provisionar recursos y runtime access con permisos minimos;
4. conectar API pilot con smoke tecnico corto;
5. ejecutar QA publicado y PO Test sobre persistencia real.

Hasta que esas condiciones se cumplan, el baseline publicado sigue siendo Web/API pilot con storage fake y Azure SQL fuera.

## Alcance minimo de persistencia real

La primera fase de persistencia real debe cubrir solo datos necesarios para validar el piloto operativo:

- empresa demo y configuracion minima de tenant;
- usuarios/roles minimos para operacion fake/local actual cuando aplique;
- terminal y caja diaria;
- catalogo de categorias, articulos, materias primas y recetas necesarias para demo;
- cuentas abiertas;
- ventas, lineas, pagos y ticket interno;
- movimientos de inventario y caja;
- reportes MVP derivados de ventas/caja.

Quedan fuera de esta primera fase:

- facturacion electronica;
- datos reales de clientes;
- multiambiente `prod`;
- pruebas de carga;
- backups avanzados mas alla del baseline de Azure SQL;
- observabilidad avanzada;
- integraciones externas.

## Ruta tecnica recomendada

### 1. SQL DEV/Data: migraciones revisables

Preparar paquete Azure SQL revisable basado en:

- `database/migrations/20260620_001_initial_mvp_schema.sql`
- `database/migrations/20260622_002_daily_cash_flow.sql`

Requisitos:

- validar compatibilidad T-SQL con Azure SQL;
- mantener `company_id` en tablas operativas;
- mantener constraints, indices y unicidades por empresa;
- no incluir datos reales;
- definir seeds ficticios minimos solo si Proyecto los aprueba;
- documentar rollback o mitigacion sin `DROP` destructivo.

### 2. Infra: provisionamiento Azure SQL pilot

Solo con autorizacion explicita posterior.

Recursos sugeridos:

| Recurso | Nombre sugerido |
| --- | --- |
| SQL Server | `sqlserver-puntoventa-pilot-eastus2` |
| SQL Database | `sqldb-puntoventa-pilot` |
| Runtime SQL user | `puntoventa_app_user` |

Guardrails:

- usar SKU/serverless o bajo consumo si esta disponible y aprobado;
- evitar reglas firewall permanentes para IP local;
- no usar usuario admin como runtime;
- crear usuario runtime con permisos minimos;
- no guardar connection strings en repo;
- registrar costo esperado y configuracion aplicada en handoff.

### 3. Secrets/config runtime

Los valores viven fuera del repo.

Config esperada:

| Variable/App Setting | Uso | Sensible |
| --- | --- | --- |
| `PV_SQLSERVER_ENABLED=true` | Activa repositorios SQL en API pilot | No |
| `SQL_CONNECTION_STRING` | Conexion runtime con usuario de permisos minimos | Si |
| `APP_ENV=pilot` | Ambiente runtime | No |
| `ALLOWED_ORIGINS` | CORS Web pilot | No |

No imprimir valores de secrets en logs, handoffs ni chat.

### 4. Backend/API: conexion y smoke tecnico

Conectar API pilot a Azure SQL solo cuando Infra deje recurso/config listos.

Smoke tecnico minimo:

- `GET /api/health` debe reportar `sqlConfigured:true` y `sqlAvailable:true`;
- catalogo responde desde SQL;
- caja diaria abre/cierra con persistencia;
- venta/cobro genera ticket;
- cuenta abierta persiste y se cobra;
- reportes MVP reflejan ventas/caja;
- reinicio/recarga no pierde datos de smoke.

Rollback o mitigacion:

- documentar si se puede volver a `PV_SQLSERVER_ENABLED=false`;
- si hay datos SQL creados, no borrar sin tarea explicita;
- clasificar fallas antes de tocar datos.

### 5. QA y PO Test

QA debe validar el piloto publicado con persistencia real, separando:

- funcionalidad;
- persistencia;
- seguridad operativa;
- aislamiento por tenant;
- regresion contra baseline fake aprobado;
- severidad P0/P1/P2/P3.

PO Test debe confirmar si la version con persistencia real sirve para piloto operativo.

## Riesgos

| Riesgo | Mitigacion |
| --- | --- |
| Costo inesperado de Azure SQL | SKU bajo/serverless, auto-pause si aplica, apagar pruebas largas, documentar costo esperado. |
| Secrets expuestos | Solo App Settings/GitHub Secrets; no imprimir valores; secret scan documental antes de handoff. |
| Usuario runtime con permisos excesivos | Separar admin/migracion de runtime; runtime sin `ALTER`, `CREATE` ni `DROP`. |
| Migracion destructiva | Revisar scripts antes; evitar `DROP`; usar transacciones cuando aplique. |
| Datos reales en piloto | Usar solo seeds ficticios; prohibir datos reales hasta decision posterior. |
| Cruce de tenant | Mantener `company_id`, filtros server-side e indices por empresa. |
| Dificultad de rollback | Mantener feature flag/config para volver a fake si se decide; no borrar datos sin tarea. |
| QA insuficiente | Ejecutar smoke tecnico antes de QA y QA publicado despues de conectar SQL. |

## Orden seguro de tareas

1. `TASK-073`: SQL DEV/Data prepara migraciones Azure SQL revisables y seeds ficticios si se aprueban.
2. `TASK-074`: Infra provisiona Azure SQL pilot y runtime access solo con autorizacion explicita.
3. `TASK-075`: Backend/API conecta API pilot a Azure SQL y ejecuta smoke controlado.
4. `TASK-076`: QA valida Web/API publicado con persistencia Azure SQL.
5. PO Test posterior: aprobar o rechazar piloto con persistencia real.

## Decision final TASK-072

Avanzar con Azure SQL pilot como ruta recomendada para persistencia real cloud, manteniendo el alcance minimo y el orden seguro anterior.

No crear Azure SQL ni modificar cloud dentro de `TASK-072`.

La autorizacion explicita requerida para `TASK-074` debe confirmar:

- suscripcion/tenant;
- region;
- presupuesto/SKU;
- si se permiten seeds ficticios;
- responsable de revisar costos;
- ventana de ejecucion y rollback operativo.

## Uso Azure SQL

No. Este documento es de decision y plan.
