# TASK-075 - Conectar API pilot a Azure SQL con smoke controlado

## Estado

Blocked

## Nombre del Equipo

Ejecucion Tecnica

## Modo

Backend/API

## Nombre de la tarea

TASK-075 - Conectar API pilot a Azure SQL con smoke controlado

## Handoff esperado

Al finalizar, debe crear o actualizar `tasks/TASK-075-HANDOFF.md` usando el formato de handoff indicado.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/API_CONTRACTS.md`
- `docs/DATA_MODEL.md`
- `docs/SMOKE_LOCAL_APP_API_SQL.md`
- `docs/PILOT_BASELINE_RUNBOOK.md`
- `tasks/TASK-073-HANDOFF.md`
- `tasks/TASK-074-HANDOFF.md`

## Objetivo

Conectar la API pilot publicada a Azure SQL usando la configuracion segura provista por Infra, ejecutar migraciones/seeds autorizados si aplica y validar un smoke minimo de persistencia real.

## Alcance

- Ajustar configuracion runtime para usar repositorios SQL cuando Azure SQL este configurado.
- Mantener contratos API existentes.
- Ejecutar migraciones/seeds autorizados segun paquete SQL.
- Validar health con `sqlConfigured:true` y `sqlAvailable:true` si aplica.
- Ejecutar smoke corto: catalogo, caja diaria, venta, ticket, reportes.
- Documentar rollback a storage fake si existe o estrategia de mitigacion.

## Fuera de alcance

- No redisenar modelo de datos.
- No crear Azure SQL.
- No cambiar UI salvo ajuste estrictamente necesario de estado/error.
- No hacer QA completa.
- No guardar secretos.
- No usar datos reales.

## Criterios de aceptacion

- [ ] API pilot usa Azure SQL o bloqueo exacto documentado.
- [ ] Migraciones/seeds autorizados ejecutados o bloqueo documentado.
- [ ] Smoke tecnico publicado pasa o fallas quedan clasificadas.
- [ ] No se rompen contratos API del MVP.
- [ ] Handoff indica `Uso Azure SQL: Si` si hubo conexion real.

## Verificacion esperada

- Health publicado.
- Smoke de endpoints criticos.
- Evidencia sin secretos.
- Lista de cambios y riesgos.

## Dependencia

Bloqueada hasta que `TASK-074` deje Azure SQL/config disponible.
