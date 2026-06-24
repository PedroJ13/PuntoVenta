# TASK-015 - Endpoints locales de cuentas abiertas

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Prioridad: MVP bloqueante

## Contexto

La API local ya tiene scaffold, auth fake y contratos definidos. El siguiente paso es implementar un primer modulo operativo pequeno: cuentas abiertas con repositorio fake y tests locales.

## Objetivo

Implementar endpoints locales de cuentas abiertas usando datos fake en memoria, respetando `docs/API_CONTRACTS.md`.

## Alcance

- Implementar rutas locales para listar cuentas abiertas.
- Implementar crear cuenta abierta.
- Implementar detalle de cuenta con lineas.
- Implementar agregar, cambiar y eliminar lineas.
- Implementar renombrar o cancelar cuenta con motivo cuando aplique.
- Usar `auth.companyId` del contexto fake.
- Agregar tests unitarios para casos felices y errores principales.

## Fuera de alcance

- No conectar Azure SQL.
- No aplicar migraciones.
- No implementar ventas/checkout.
- No persistir datos reales.
- No crear recursos Azure.
- No implementar frontend.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/TASK_BOARD.md`
- `docs/API_CONTRACTS.md`
- `docs/DATA_MODEL.md`
- `docs/AUTH_PERMISSIONS.md`
- `api/README.md`
- `tasks/TASK-007-HANDOFF.md`
- `tasks/TASK-011-HANDOFF.md`

## Dependencia

- Liberada por `TASK-011`.

## Criterios de aceptacion

- [x] Existen endpoints locales de cuentas abiertas.
- [x] Los endpoints usan `companyId` server-side desde auth fake.
- [x] Hay tests para crear cuenta, listar, agregar linea, modificar linea y eliminar linea.
- [x] No hay dependencia de Azure SQL ni secretos reales.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Ejecutar tests locales de `api/`.
- Buscar patrones de secretos en archivos cambiados.
- Confirmar que no se crearon recursos Azure.

## Handoff esperado

Crear o actualizar `tasks/TASK-015-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
