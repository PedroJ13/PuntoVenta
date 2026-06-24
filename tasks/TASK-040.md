# TASK-040 - Ajustar Web local para estados SQL del API

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Prioridad: P1 pre-lanzamiento

## Contexto

Cuando catalogo, cuentas, caja diaria, ventas y reportes ya tengan camino SQL local opcional, la app Web debe seguir operando correctamente contra el mismo contrato API y mostrar estados claros ante errores esperados del flujo SQL, como caja no abierta.

## Objetivo

Revisar y ajustar la app Web local para que los flujos existentes funcionen contra el API con SQL local opcional sin cambiar el alcance visual aprobado.

## Alcance

- Validar caja rapida, cuentas abiertas, caja diaria y reportes contra el API existente.
- Ajustar manejo de errores esperados del API, especialmente caja diaria no abierta.
- Mantener textos y estados claros para usuario operativo.
- Mantener responsive existente.
- No duplicar logica de negocio del backend en frontend.

## Fuera de alcance

- No crear modulos visuales nuevos.
- No cambiar el contrato API.
- No crear recursos Azure.
- No conectar Azure SQL.
- No guardar passwords, connection strings ni secretos.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/TASK_BOARD.md`
- `docs/API_CONTRACTS.md`
- `tasks/TASK-018-HANDOFF.md`
- `tasks/TASK-024-HANDOFF.md`
- `tasks/TASK-030-HANDOFF.md`
- `tasks/TASK-038-HANDOFF.md`
- `tasks/TASK-039-HANDOFF.md`

## Dependencia

- Ejecutar despues de completar `TASK-039`.

## Criterios de aceptacion

- [x] Caja rapida mantiene flujo correcto contra API con SQL local opcional.
- [x] Cuentas abiertas mantienen flujo correcto contra API con SQL local opcional.
- [x] Caja diaria mantiene flujo correcto contra API con SQL local opcional.
- [x] Reportes mantienen visualizacion correcta contra API con SQL local opcional.
- [x] Errores esperados del API se muestran de forma clara.
- [x] No se conecta Azure SQL.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Probar app local con API local.
- Si SQL local esta disponible, probar con modo SQL configurado.
- Revisar responsive basico.
- Buscar secretos en archivos cambiados.

## Handoff esperado

Crear o actualizar `tasks/TASK-040-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
