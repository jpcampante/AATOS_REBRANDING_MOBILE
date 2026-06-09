# Start Expo Go remotely through a Cloudflare tunnel.
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique |
  ForEach-Object { if ($_ -gt 0) { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue } }
Start-Sleep -Seconds 2

Write-Host "Starting Metro on port 8081..." -ForegroundColor Cyan
$metro = Start-Process -FilePath "npx" -ArgumentList "expo","start","--port","8081" -PassThru -NoNewWindow -WorkingDirectory $PSScriptRoot
Start-Sleep -Seconds 8

Write-Host "Creating Cloudflare tunnel..." -ForegroundColor Cyan
$tunnelLog = Join-Path $env:TEMP "expo-cloudflared.log"
$tunnelProc = Start-Process -FilePath "npx" -ArgumentList "--yes","cloudflared","tunnel","--url","http://127.0.0.1:8081" -RedirectStandardError $tunnelLog -PassThru -NoNewWindow

$tunnelUrl = $null
for ($i = 0; $i -lt 30; $i++) {
  Start-Sleep -Seconds 1
  if (Test-Path $tunnelLog) {
    $match = Select-String -Path $tunnelLog -Pattern "https://[a-z0-9-]+\.trycloudflare\.com" | Select-Object -First 1
    if ($match) {
      $tunnelUrl = $match.Matches[0].Value
      break
    }
  }
}

if (-not $tunnelUrl) {
  Write-Host "Unable to obtain the tunnel URL. See $tunnelLog" -ForegroundColor Red
  exit 1
}

$expUrl = $tunnelUrl -replace '^https://', 'exp://'
Write-Host ""
Write-Host "Remote tunnel active: $expUrl" -ForegroundColor Green
Write-Host "Metro PID: $($metro.Id) | Tunnel PID: $($tunnelProc.Id)" -ForegroundColor DarkGray

try {
  Wait-Process -Id $metro.Id
} finally {
  Stop-Process -Id $tunnelProc.Id -Force -ErrorAction SilentlyContinue
}
