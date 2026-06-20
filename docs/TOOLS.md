# Tools

## Verificacion inicial

Ejecutar sin instalar:

```powershell
git --version
node --version
npm --version
python --version
rg --version
```

Opcionales segun proyecto:

```powershell
az --version
func --version
swa --version
sqlcmd -?
gh --version
```

## Herramientas comunes

- `git`: control de versiones.
- `rg`: busqueda rapida.
- `node` / `npm`: frontend o backend JavaScript.
- `python`: scripts, documentos o automatizaciones.
- `az`: Azure CLI.
- `func`: Azure Functions Core Tools.
- `swa`: Azure Static Web Apps CLI.
- `sqlcmd`: SQL Server / Azure SQL.
- `gh`: GitHub CLI, opcional.

## Regla

- No instalar herramientas sin permiso explicito.
- No usar `gh` si el usuario prefiere evitar conflictos con cuentas laborales.
- No guardar credenciales en archivos.
- Preferir navegador/Git normal si `gh` no se usa.

