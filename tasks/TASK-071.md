# TASK-071 - PO Test publicado de pantalla de ventas

## Estado

Done

## Nombre del Equipo

PO Test

## Modo

PO Test

## Nombre de la tarea

TASK-071 - PO Test publicado de pantalla de ventas

## Handoff esperado

Al finalizar, debe crear o actualizar `tasks/TASK-071-HANDOFF.md` usando el formato de handoff indicado.

## Leer antes de trabajar

- `AGENTS.md`
- `docs/ESTADO_OPERATIVO.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/MVP_CRITERIA.md`
- `docs/CASH_DAILY_FLOW_MVP.md`
- `docs/TICKET_FORMAT_MVP.md`
- `tasks/TASK-062-HANDOFF.md`
- `tasks/TASK-070-HANDOFF.md`

## Objetivo

Validar como Product Owner si la pantalla de ventas publicada sirve para una demo/piloto funcional de cafeteria/despacho, enfocandose en usabilidad del flujo de venta y no en implementacion tecnica.

## Alcance

- Abrir la Web pilot publicada indicada en el estado/handoffs recientes.
- Validar visualmente y como usuario real:
  - Entrada a pantalla de ventas.
  - Caja rapida.
  - Seleccion de articulos.
  - Cantidades si estan disponibles.
  - Cobro.
  - Ticket.
  - Nueva cuenta/cuenta abierta si aplica.
  - Reportes basicos solo como confirmacion secundaria.
- Registrar si el flujo es entendible para vender en cafeteria/despacho.
- Registrar fricciones de UX/copy/operacion con severidad PO:
  - Bloquea piloto.
  - No bloquea piloto, pero debe corregirse pronto.
  - Mejora futura.
- Confirmar si se aprueba, aprueba con observaciones o rechaza para piloto funcional.
- Confirmar explicitamente si se uso Azure SQL.

## Fuera de alcance

- No implementar cambios de codigo.
- No modificar API, Web, workflows, Azure ni GitHub.
- No crear ni usar Azure SQL.
- No hacer QA tecnica completa.
- No validar seguridad, backups, monitoreo ni persistencia real cloud.
- No guardar secretos, tokens, passwords ni connection strings.

## Criterios de aceptacion

- [x] PO valida la pantalla de ventas publicada.
- [x] PO emite decision clara: aprobada, aprobada con observaciones o rechazada.
- [x] Handoff indica si la pantalla sirve para demo/piloto funcional.
- [x] Handoff lista hallazgos operativos o visuales con severidad PO.
- [x] Handoff separa bloqueos reales de mejoras futuras.
- [x] Handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- URL publicada usada para la prueba.
- Descripcion corta del recorrido probado.
- Resultado por flujo: caja rapida, cobro, ticket y cuenta abierta si aplica.
- Decision PO final.
- Lista compacta de hallazgos y siguiente recomendacion.
