# TASK-078 - PO Test publicado con persistencia Azure SQL

## Estado

Done

## Nombre del Equipo

PO Test

## Modo

PO Test

## Nombre de la tarea

TASK-078 - PO Test publicado con persistencia Azure SQL

## Handoff esperado

Al finalizar, debe crear o actualizar `tasks/TASK-078-HANDOFF.md` usando el formato de handoff indicado.

## Leer antes de trabajar

- `AGENTS.md`
- `docs/ESTADO_OPERATIVO.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/MVP_CRITERIA.md`
- `docs/CASH_DAILY_FLOW_MVP.md`
- `docs/TICKET_FORMAT_MVP.md`
- `tasks/TASK-071-HANDOFF.md`
- `tasks/TASK-075-HANDOFF.md`
- `tasks/TASK-076-HANDOFF.md`

## Objetivo

Validar como Product Owner si el pilot publicado con persistencia Azure SQL sirve para avanzar hacia piloto operativo controlado, manteniendo datos reales fuera hasta que exista decision explicita.

## Alcance

- Revisar el resultado QA de `TASK-076`.
- Validar como usuario/Product Owner el flujo publicado con persistencia:
  - pantalla de ventas;
  - caja diaria;
  - venta rapida;
  - ticket;
  - cuenta abierta;
  - cobro;
  - reportes basicos.
- Confirmar si las observaciones de QA bloquean o no el piloto controlado.
- Confirmar si se aprueba, aprueba con observaciones o rechaza la version publicada con Azure SQL.
- Indicar explicitamente si se pueden preparar tareas posteriores para datos reales, o si debe mantenerse solo con datos ficticios.
- Confirmar explicitamente `Uso Azure SQL: Si`.

## Fuera de alcance

- No modificar codigo.
- No modificar Azure, SQL, secrets, firewall ni GitHub Actions.
- No crear datos reales.
- No hacer QA tecnica completa.
- No ejecutar migraciones.
- No cambiar configuracion de API.
- No guardar secretos, tokens, passwords ni connection strings.

## Criterios de aceptacion

- [x] PO revisa el pilot publicado con persistencia Azure SQL.
- [x] PO emite decision clara: aprobada, aprobada con observaciones o rechazada.
- [x] PO indica si se permite preparar fase de datos reales o si sigue bloqueada.
- [x] Handoff separa bloqueos reales de mejoras futuras.
- [x] Handoff registra observaciones PO si existen.
- [x] Handoff indica `Uso Azure SQL: Si`.

## Verificacion esperada

- Decision PO final.
- Resumen corto del recorrido o evidencia revisada.
- Lista compacta de observaciones.
- Recomendacion de siguiente paso: datos reales, hardening/documentacion o correcciones previas.
