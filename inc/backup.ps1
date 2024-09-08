param (
    [Parameter(Mandatory = $true)]
    [string]$ReportPath,

    [Parameter(Mandatory = $true)]
    [string]$BackupPath,
    
    [Parameter(Mandatory = $true)]
    [string]$TmpPath
)

# Back up files
if (-not (Test-Path -Path "$BackupPath")) {
    New-Item -Path "$BackupPath" -ItemType 'directory' -Force | Out-Null
}
Copy-Item -Path "$ReportPath\*.xlsx" -Destination "$BackupPath" -Force | Out-Null

# Create the tmp folder if it does not exist
if (-not (Test-Path -Path "$TmpPath")) {
    New-Item -Path "$TmpPath" -ItemType Directory -Force | Out-Null
}
