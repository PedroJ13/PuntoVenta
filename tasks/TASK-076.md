# TASK-076 - QA publicado Web API con persistencia Azure SQL

## Estado

Done

## Nombre del Equipo

QA

## Modo

QA

## Nombre de la tarea

TASK-076 - QA publicado Web API con persistencia Azure SQL

## Handoff esperado

Al finalizar, debe crear o actualizar `tasks/TASK-076-HANDOFF.md` usando el formato de handoff indicado.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/QA.md`
- `docs/QA_CHECKLIST_FLUJO_CAJA.md`
- `docs/MVP_CRITERIA.md`
- `docs/PILOT_BASELINE_RUNBOOK.md`
- `tasks/TASK-062-HANDOFF.md`
- `tasks/TASK-071-HANDOFF.md`
- `tasks/TASK-075-HANDOFF.md`

## Objetivo

Validar el pilot publicado Web/API usando persistencia Azure SQL real, separando hallazgos funcionales, datos, integracion, seguridad operativa y regresiones contra el baseline fake aprobado.

## Alcance

- Validar Web publicada carga y opera contra API publicada.
- Validar API health y evidencia de Azure SQL configurado/disponible.
- Ejecutar flujo funcional publicado:
  - caja diaria;
  - venta rapida;
  - ticket;
  - cuenta abierta;
  - cobro;
  - reportes.
- Validar persistencia basica entre llamadas o recargas cuando aplique.
- Clasificar hallazgos P0/P1/P2/P3.
- Confirmar si la version queda aprobada, aprobada con observaciones o rechazada.

## Fuera de alcance

- No modificar codigo.
- No modificar Azure ni secrets.
- No crear datos reales.
- No hacer pruebas de carga.
- No validar facturacion electronica.

## Criterios de aceptacion

- [x] Web/API publicados validados.
- [x] Azure SQL confirmado en uso o bloqueo exacto documentado.
- [x] Smoke funcional publicado ejecutado.
- [x] Persistencia basica validada.
- [x] Hallazgos clasificados por severidad.
- [x] Veredicto claro.

## Verificacion esperada

- URLs publicadas usadas.
- Resultado de health.
- Evidencia de smoke funcional.
- Veredicto QA.

## Dependencia

Liberada por Proyecto tras cierre de `TASK-075`. API pilot esta conectada a Azure SQL con smoke tecnico publicado aprobado.
