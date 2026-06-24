import { spawn } from "node:child_process";

const POWERSHELL_SQL_RUNNER = String.raw`
$ErrorActionPreference = 'Stop'
$inputJson = [Console]::In.ReadToEnd()
$payload = $inputJson | ConvertFrom-Json

$hostName = $env:PV_SQLSERVER_HOST
if ([string]::IsNullOrWhiteSpace($hostName)) { $hostName = 'localhost\SQLEXPRESS' }

$database = $env:PV_SQLSERVER_DATABASE
if ([string]::IsNullOrWhiteSpace($database)) { throw 'PV_SQLSERVER_DATABASE is required.' }

$authMode = $env:PV_SQLSERVER_AUTH_MODE
if ([string]::IsNullOrWhiteSpace($authMode)) { $authMode = 'windows' }

$encrypt = $env:PV_SQLSERVER_ENCRYPT
if ([string]::IsNullOrWhiteSpace($encrypt)) { $encrypt = 'false' }

$trustCert = $env:PV_SQLSERVER_TRUST_CERT
if ([string]::IsNullOrWhiteSpace($trustCert)) { $trustCert = 'true' }

$builder = [System.Data.SqlClient.SqlConnectionStringBuilder]::new()
$builder['Data Source'] = $hostName
$builder['Initial Catalog'] = $database
$builder['Encrypt'] = [System.Convert]::ToBoolean($encrypt)
$builder['TrustServerCertificate'] = [System.Convert]::ToBoolean($trustCert)

if ($authMode -eq 'sql') {
  if ([string]::IsNullOrWhiteSpace($env:PV_SQLSERVER_USER) -or [string]::IsNullOrWhiteSpace($env:PV_SQLSERVER_PASSWORD)) {
    throw 'SQL auth requires local user and password environment variables.'
  }
  $builder['Integrated Security'] = $false
  $builder['User ID'] = $env:PV_SQLSERVER_USER
  $builder['Password'] = $env:PV_SQLSERVER_PASSWORD
} else {
  $builder['Integrated Security'] = $true
}

$connection = [System.Data.SqlClient.SqlConnection]::new($builder.ConnectionString)
$connection.Open()
try {
  $command = $connection.CreateCommand()
  $command.CommandTimeout = 15
  $command.CommandText = [string]$payload.query

  foreach ($parameter in $payload.params) {
    $sqlParameter = $command.Parameters.Add("@$($parameter.name)", [System.Data.SqlDbType]::NVarChar)
    if ($null -eq $parameter.value) {
      $sqlParameter.Value = [DBNull]::Value
    } elseif ($parameter.value -is [int] -or $parameter.value -is [long]) {
      $sqlParameter.SqlDbType = [System.Data.SqlDbType]::Int
      $sqlParameter.Value = [int]$parameter.value
    } else {
      $sqlParameter.Size = -1
      $sqlParameter.Value = [string]$parameter.value
    }
  }

  $rows = New-Object System.Collections.Generic.List[object]
  $reader = $command.ExecuteReader()
  do {
    if ($reader.FieldCount -gt 0) {
      while ($reader.Read()) {
        $row = [ordered]@{}
        for ($i = 0; $i -lt $reader.FieldCount; $i++) {
          $name = $reader.GetName($i)
          if ($reader.IsDBNull($i)) {
            $row[$name] = $null
          } else {
            $value = $reader.GetValue($i)
            if ($value -is [decimal]) {
              $row[$name] = [double]$value
            } elseif ($value -is [bool]) {
              $row[$name] = [bool]$value
            } else {
              $row[$name] = $value
            }
          }
        }
        $rows.Add([pscustomobject]$row)
      }
    }
  } while ($reader.NextResult())
  $reader.Close()
  $rows | ConvertTo-Json -Depth 8
} finally {
  $connection.Close()
}
`;

export function createSqlServerPowerShellClient({ env = process.env } = {}) {
  return {
    async query(query, params = []) {
      const output = await runPowerShellSql({ query, params, env });
      if (!output.trim()) return [];

      const parsed = JSON.parse(output);
      return Array.isArray(parsed) ? parsed : [parsed];
    }
  };
}

function runPowerShellSql({ query, params, env }) {
  return new Promise((resolve, reject) => {
    const timeoutMs = normalizeTimeout(env.PV_SQLSERVER_QUERY_TIMEOUT_MS);
    const child = spawn(
      "powershell.exe",
      ["-NoProfile", "-NonInteractive", "-Command", POWERSHELL_SQL_RUNNER],
      {
        env,
        stdio: ["pipe", "pipe", "pipe"],
        windowsHide: true
      }
    );

    let stdout = "";
    let stderr = "";
    let settled = false;
    const timeout = setTimeout(() => {
      settled = true;
      child.kill();
      reject(new Error(`SQL local query timed out after ${timeoutMs}ms.`));
    }, timeoutMs);

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });

    child.on("error", reject);
    child.on("close", (code) => {
      clearTimeout(timeout);
      if (settled) return;
      settled = true;
      if (code === 0) {
        resolve(stdout);
        return;
      }

      reject(new Error(`SQL local query failed with exit code ${code}: ${sanitizeError(stderr)}`));
    });

    child.stdin.end(JSON.stringify({ query, params }));
  });
}

function normalizeTimeout(value) {
  const parsed = Number.parseInt(value || "30000", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 30000;
}

function sanitizeError(message) {
  return message.replace(/Password=[^;\\r\\n]+/gi, "Password=<redacted>").trim();
}
