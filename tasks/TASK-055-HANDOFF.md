# TASK-055 - Handoff

Nombre del equipo/chat:
Ejecucion Tecnica

Modo:
Web Dev

Nombre de la tarea:
TASK-055 - Configurar Web pilot con API base URL publicada

Archivo de tarea:
`tasks/TASK-055.md`

## Nombre de tarea culminada

TASK-055 - Configurar Web pilot con API base URL publicada

## Status

entregada a revision

## Handoff

`tasks/TASK-055-HANDOFF.md`

## Resumen

Se configuro la Web para resolver `apiBaseUrl` en runtime sin secrets: primero respeta `localStorage.pvApiBaseUrl`, luego `window.PUNTO_VENTA_CONFIG.apiBaseUrl`, luego usa la API pilot publicada cuando el host es `gray-beach-00a0f870f.7.azurestaticapps.net`, y finalmente cae a la API local `http://127.0.0.1:7071`.

Uso Azure SQL: No.

## Ambiente

- Fecha: 2026-06-24
- Workspace: `C:\Work\Productos Digitales\PuntoVenta`
- Equipo/chat: Ejecucion Tecnica
- Modo: Web Dev
- Web pilot host: `gray-beach-00a0f870f.7.azurestaticapps.net`
- API pilot base URL: `https://func-puntoventa-pilot-eastus2.azurewebsites.net`
- Deploy ejecutado: No
- Azure SQL creado o usado: No
- Secretos guardados en repo: No

## Cambios realizados

- `app/src/apiClient.js`
  - Agrega `localApiBaseUrl`.
  - Agrega `pilotApiBaseUrl`.
  - Agrega `resolveApiBaseUrl()`.
  - Mantiene override por `localStorage.pvApiBaseUrl`.
  - Mantiene fallback local para desarrollo.
- `app/README.md`
  - Documenta el host pilot y la API base publicada.
  - Documenta el orden de resolucion.
  - Documenta como validar la API base URL activa desde navegador.

## Orden de resolucion

1. `localStorage.pvApiBaseUrl`.
2. `window.PUNTO_VENTA_CONFIG.apiBaseUrl`.
3. API pilot publicada si el host es `gray-beach-00a0f870f.7.azurestaticapps.net`.
4. API local `http://127.0.0.1:7071`.

## Verificacion ejecutada

```text
node --check src\apiClient.js
```

Resultado:

```text
pasa
```

```text
node --check src\main.js
node --check src\state.js
node --check src\ui.js
node --check src\data.js
node --check src\apiClient.js
```

Resultado:

```text
pasa
```

Prueba directa de resolucion:

```text
node --input-type=module -e "<prueba de override, host pilot, fallback local y config runtime>"
```

Resultado:

```text
apiBaseUrl resolution ok
```

Busqueda de secretos:

```text
Select-String -Path src\apiClient.js,README.md -Pattern 'password|secret|token|connection string|InstrumentationKey|AccountKey|publish profile|apiKey' -CaseSensitive:$false
```

Resultado:

```text
Solo texto documental sobre secrets/connection strings. No hay valores reales.
```

## Resultado por criterio

| Criterio | Resultado | Evidencia |
| --- | --- | --- |
| Web tiene configuracion clara para API base URL publicada | Cumple | `resolveApiBaseUrl()` usa el host SWA pilot para seleccionar la API pilot. |
| Desarrollo local sigue funcionando | Cumple | Fallback local queda en `http://127.0.0.1:7071`; override local se mantiene. |
| No se guardan secrets en repo | Cumple | Solo URLs publicas y nombres documentales. |
| No se crea ni usa Azure SQL | Cumple | No hubo deploy ni conexion DB cloud. |
| Queda documentado como validar la configuracion | Cumple | `app/README.md` incluye orden y snippet de validacion. |
| El handoff indica `Uso Azure SQL: No` | Cumple | Indicado en resumen y ambiente. |

## Hallazgos

### P0/P1

- Ninguno.

### P2/P3

- P2: La API pilot sigue pendiente de validacion HTTP publica desde una red que pueda conectar por 443 al host Azure, segun `TASK-054`.
- P3: `window.PUNTO_VENTA_CONFIG.apiBaseUrl` queda disponible para futura configuracion runtime sin modificar codigo.

## Pendientes o riesgos

- `TASK-056` debe completar o desbloquear el deploy Web pilot y validar Web/API publicos.
- Azure SQL permanece fuera del alcance.

## Movimiento de tablero

- De: Assigned
- A: Needs Review
