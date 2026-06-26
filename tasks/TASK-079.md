# TASK-079 - Preparar plan de carga inicial de datos reales

## Estado

Done

## Nombre del Equipo

Ejecucion Tecnica

## Modo

SQL DEV/Data

## Nombre de la tarea

TASK-079 - Preparar plan de carga inicial de datos reales

## Handoff esperado

Al finalizar, debe crear o actualizar `tasks/TASK-079-HANDOFF.md` usando el formato de handoff indicado.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/ESTADO_OPERATIVO.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/DATA_MODEL.md`
- `docs/CLOUD_PERSISTENCE_DECISION_PLAN.md`
- `docs/AZURE_SQL_MIGRATION_REVIEW_PACKAGE.md`
- `tasks/TASK-075-HANDOFF.md`
- `tasks/TASK-076-HANDOFF.md`
- `tasks/TASK-078-HANDOFF.md`

## Objetivo

Preparar un plan seguro para carga inicial de datos reales en el pilot con Azure SQL, sin ejecutar carga todavia.

## Alcance

- Definir que datos reales hacen falta para un piloto operativo controlado:
  - empresa/tenant;
  - usuarios/roles;
  - terminal;
  - catalogo/categorias/articulos;
  - materias primas/recetas si aplica;
  - caja inicial;
  - clientes/proveedores solo si son estrictamente necesarios.
- Separar datos obligatorios de datos opcionales.
- Definir formato de entrega de datos por el usuario o responsable.
- Definir reglas de limpieza/validacion antes de cargar:
  - no secretos;
  - no passwords/PIN planos;
  - datos minimos;
  - tenant correcto;
  - no duplicados funcionales.
- Definir estrategia para datos demo existentes:
  - mantenerlos;
  - aislarlos;
  - limpiar base pilot;
  - crear nueva empresa real separada.
- Definir rollback/mitigacion antes de cargar datos reales.
- Proponer tareas siguientes para carga real, QA y PO.

## Fuera de alcance

- No cargar datos reales.
- No modificar Azure SQL.
- No ejecutar migraciones.
- No borrar datos demo.
- No modificar API/Web.
- No tocar secrets, firewall ni App Settings.
- No pedir ni registrar passwords, tokens, connection strings, PINs planos ni datos sensibles innecesarios.

## Criterios de aceptacion

- [x] Plan de datos reales documentado.
- [x] Lista de datos requeridos y opcionales definida.
- [x] Formato de entrada de datos definido.
- [x] Estrategia para datos demo existente definida.
- [x] Riesgos de privacidad/tenant/integridad documentados.
- [x] Rollback/mitigacion definido.
- [x] Tareas siguientes propuestas.
- [x] Handoff indica `Uso Azure SQL: No` si no se conecta ni modifica la base.

## Verificacion esperada

- Handoff con plan claro.
- Lista de fuentes/formatos esperados.
- Checklist de validacion previa a carga.
- Recomendacion de siguiente tarea.
