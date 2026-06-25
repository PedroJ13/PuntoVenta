# TASK-050 - Definir paquete de decision para primer deploy

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Infra
Prioridad: P1 pre-lanzamiento

## Contexto

Despues del preflight cloud/deploy de `TASK-049`, Proyecto necesita un paquete de decision para decidir si autoriza el primer deploy y bajo que alcance, sin que el chat tecnico cree recursos por adelantado.

## Objetivo

Preparar un paquete de decision para el primer deploy del MVP, con opciones, alcance, riesgos, costos y pasos, sin ejecutar deploy ni crear recursos.

## Alcance

- Resumir opciones de deploy para Web y API.
- Indicar si se recomienda Static Web Apps, Azure Functions u otra ruta segun docs existentes.
- Separar claramente local SQL vs futuro Azure SQL.
- Listar recursos Azure que se crearian solo si Proyecto/PO lo aprueba.
- Listar secrets/configuracion requeridos sin valores reales.
- Proponer orden de tareas posterior si se aprueba deploy.

## Fuera de alcance

- No crear recursos Azure.
- No conectar Azure SQL.
- No hacer deploy.
- No ejecutar comandos destructivos o de provisionamiento.
- No guardar secrets, connection strings ni tokens.
- No cambiar codigo funcional.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/ESTADO_OPERATIVO.md`
- `docs/AZURE_INFRA_PLAN.md`
- `tasks/TASK-049-HANDOFF.md`

## Dependencia

- Ejecutar despues de `TASK-049`.

## Criterios de aceptacion

- [x] Paquete de decision queda documentado.
- [x] Incluye opciones, alcance, riesgos y costos/guardrails.
- [x] Lista recursos que requeririan aprobacion explicita antes de crearse.
- [x] No se crean recursos Azure.
- [x] No se conecta Azure SQL.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Revision documental.
- Busqueda de secretos en archivos cambiados.
- Confirmar que no se ejecutaron comandos de provisionamiento/deploy.

## Handoff esperado

Crear o actualizar `tasks/TASK-050-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
