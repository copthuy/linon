$ScriptRoot = (get-item $PSScriptRoot ).FullName
$WorkingPath = [Environment]::GetFolderPath("Desktop")
$DataPath = "$WorkingPath\data"
$TmpPath = "$WorkingPath\tmp"
$TmpData = "$TmpPath\data.html"
$ReportPath = "$WorkingPath\reports"
$BackupPath = "$WorkingPath\bak"

# Define the prefix for the server
$Prefix = "http://localhost:8080/"

# Create Excel instance
$Excel = New-Object -ComObject Excel.Application
while (!$Excel.Ready) {
    Start-Sleep -Seconds 1
}
$Excel.DisplayAlerts = $false

# Clear console & backup
Clear-Host
& "$ScriptRoot\inc\backup.ps1" `
    -ReportPath $ReportPath `
    -BackupPath $BackupPath `
    -TmpPath $TmpPath

& "$ScriptRoot\inc\data.ps1" `
    -ScriptRoot $ScriptRoot `
    -DataPath $DataPath `
    -TmpData $TmpData `
    -Excel $Excel

# Create a new HttpListener object
$Listener = New-Object System.Net.HttpListener
$Listener.Prefixes.Add($Prefix)
$Listener.Start()
Write-Host "Listening on $Prefix"

try {
    while ($Listener.IsListening) {
        & "$ScriptRoot\inc\server\handler.ps1" `
            -ScriptRoot $ScriptRoot `
            -DataPath $DataPath `
            -ReportPath $ReportPath `
            -TmpData $TmpData `
            -Listener $Listener `
            -Excel $Excel
    }
} catch {
    Write-Host "Error: $_"
    $Listener.Stop()
} finally {
    Write-Host "Listener stopped."
    $Listener.Stop()
}

$Excel.DisplayAlerts = $true
$Excel.Quit() | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($Excel) | Out-Null
[System.GC]::Collect() | Out-Null
[System.GC]::WaitForPendingFinalizers() | Out-Null

Remove-Item -Path $TmpPath -Recurse -Force
