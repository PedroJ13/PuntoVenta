# Guia para bloqueo de git push / deploy

Documento para chats de Proyecto, Infra y Ejecucion Tecnica cuando PuntoVenta queda bloqueado por `git push origin main`, GitHub remoto no permitido, `gh` no autenticado/autorizado o politica del entorno Codex.

Nota: asumir que `gh` puede estar instalado en la maquina. El problema a resolver normalmente no es instalar GitHub CLI, sino confirmar si esta autenticado y si el entorno permite usarlo contra este repo/remoto.

## Veredicto corto

Si Codex no puede empujar a GitHub por politica/red/remoto no confiable, no se debe forzar el bypass ni pegar tokens. El camino correcto es dejar el repo listo, documentar commit/evidencia y usar un canal autorizado:

1. Push manual del usuario desde su terminal confiable.
2. Pipeline/canal interno ya autorizado.
3. Patch o bundle local para que el usuario lo suba desde un entorno permitido.

## Como se resolvio en PuntoClub

En PuntoClub se separaron dos temas:

- `gh` podia servir para inspeccionar runs o disparar acciones manuales si estaba autenticado.
- `gh` local no era requisito para publicar por el flujo normal.
- El deploy normal ocurria con `git push origin main` y GitHub Actions.

Cuando `git push origin main` fallo desde Codex por restriccion de red/politica, el resultado correcto fue:

- commit preparado y revisado;
- archivos temporales excluidos;
- workflow esperado documentado;
- bloqueo declarado como pendiente de push desde entorno autorizado.

Despues, cuando el push si llego a `origin/main`, GitHub Actions publico y se valido por URL publica.

## Regla para PuntoVenta

No abrir tareas nuevas de deploy ni repetir cambios si el unico bloqueo es push. Primero cerrar el estado Git:

```powershell
cd "C:\Work\Productos Digitales\PuntoVenta"
git status --short --branch
git log -1 --oneline
git remote -v
```

Si hay cambios sin commit, el chat responsable debe terminar el alcance normal: revisar diff, correr checks aplicables, crear commit y handoff. Si ya existe commit listo, no reimplementar.

## Camino A - Push manual del usuario

Usar cuando Codex ya dejo el commit listo pero no puede empujar.

Comando para el usuario:

```powershell
cd "C:\Work\Productos Digitales\PuntoVenta"
git push origin main
```

Despues del push, validar por GitHub UI o por un entorno con `gh` instalado y autenticado:

```powershell
gh run list --limit 10
```

El handoff debe indicar:

- commit SHA;
- rama objetivo;
- si el push fue hecho o sigue pendiente;
- workflow esperado;
- checks locales ejecutados;
- riesgos pendientes.

## Camino B - Push desde Codex si esta permitido

Solo usar si el entorno ya permite el remoto y la accion no es rechazada por politica. Que `gh` este instalado no significa que `git push` este autorizado.

Antes:

```powershell
git status --short --branch
git remote -v
git log -1 --oneline
```

Despues:

```powershell
git status --short --branch
```

Si falla por red, autenticacion, remoto no confiable o riesgo de exportar repo, parar y pasar a Camino A o D. No intentar resolver con tokens pegados en chat.

## Uso correcto de gh

`gh` se puede usar para diagnostico cuando este disponible y autenticado:

```powershell
gh auth status
gh run list --limit 10
gh run view <run-id>
```

Pero no debe tratarse como requisito para publicar si el repo ya publica por push a `main` y GitHub Actions. Si `gh auth status` falla, no reinstalar por defecto; registrar el bloqueo y usar GitHub UI, push manual o canal autorizado.

## Camino C - Pipeline o canal autorizado

Usar si la organizacion tiene un mecanismo permitido para tomar commits y publicar:

- GitHub Actions ya autorizado;
- Azure DevOps;
- pipeline corporativo;
- terminal del usuario con credenciales locales;
- proceso de release definido por Proyecto/Infra.

El chat debe documentar cual canal se uso y que evidencia confirma la publicacion.

## Camino D - Patch o bundle local

Usar si no se permite push desde Codex y el usuario necesita transportar los cambios.

Patch:

```powershell
cd "C:\Work\Productos Digitales\PuntoVenta"
New-Item -ItemType Directory -Force -Path ".handoff" | Out-Null
git format-patch origin/main..HEAD --stdout > ".handoff\puntoventa-release.patch"
```

Bundle:

```powershell
cd "C:\Work\Productos Digitales\PuntoVenta"
New-Item -ItemType Directory -Force -Path ".handoff" | Out-Null
git bundle create ".handoff\puntoventa-release.bundle" origin/main..HEAD
```

El handoff debe explicar desde que base se genero y que commit contiene.

## Que no hacer

- No reinstalar Git o GitHub CLI si ya existen y el problema es autenticacion, politica o red.
- No pegar tokens, PATs, secrets ni connection strings en chat o archivos.
- No cambiar el remoto para esquivar controles.
- No hacer deploy manual por otro canal sin decision de Proyecto/Infra.
- No mezclar fix funcional con desbloqueo de Git/publish.

## Prompt para el chat bloqueado

```text
Lee docs/GIT_PUSH_DEPLOY_BLOCKER_GUIDE.md.

Estamos bloqueados por push/deploy. No reimplementes la tarea.

1. Revisa estado Git, ultimo commit y remoto.
2. Confirma si el alcance ya esta commiteado.
3. Si Codex no puede empujar por politica/red/remoto, deja el handoff con commit SHA y comando exacto para push manual:
   git push origin main
4. Si hace falta transportar cambios, prepara patch o bundle en .handoff/.
5. No pegues tokens ni cambies remoto para bypass.
6. Indica que workflow o validacion debe correr despues del push.
```

## Criterio de Done

Este bloqueo queda listo para Proyecto cuando existe una de estas salidas:

- push completado y workflow/verificacion documentados;
- commit listo y push manual pendiente con comando exacto;
- patch/bundle generado y documentado;
- canal autorizado identificado con responsable y siguiente accion.
