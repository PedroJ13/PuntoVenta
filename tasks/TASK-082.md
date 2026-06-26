# TASK-082 - Corregir health cold start para reflejar estado SQL real

## Estado

Done

## Nombre del Equipo

Ejecucion Tecnica

## Modo

Backend/API

## Nombre de la tarea

TASK-082 - Corregir health cold start para reflejar estado SQL real

## Handoff esperado

Al finalizar, debe crear o actualizar `tasks/TASK-082-HANDOFF.md` usando el formato de handoff indicado.

## Contexto

`TASK-076` detecto que `GET /api/health` en inicio frio podia reportar `sqlConfigured=true` y `sqlAvailable=false` hasta que algun modulo usara SQL. Eso podia confundir monitoreo/readiness del pilot con Azure SQL activo.

## Objetivo

Hacer que `GET /api/health` refresque la disponibilidad SQL real cuando SQL esta configurado, sin exponer secretos.

## Alcance

- Ajustar Backend/API local.
- Mantener respuesta de health sin host, base, usuario, password ni connection string.
- Agregar o ajustar pruebas locales.
- Documentar el comportamiento en API README si aplica.

## Fuera de alcance

- No hacer deploy.
- No cambiar App Settings.
- No tocar Azure SQL real.
- No ejecutar migraciones ni seeds.
- No cargar datos reales.

## Criterios de aceptacion

- [x] Health ejecuta probe SQL cuando existe `storageHealthCheck`.
- [x] En SQL configurado, health puede reflejar `sqlAvailable=true` sin depender de calentar otros modulos.
- [x] La respuesta no expone secretos.
- [x] Tests locales pasan.
- [x] Handoff creado.

## Verificacion esperada

- `npm test -- --test-name-pattern=health`
- `npm run lint`
