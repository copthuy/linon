param (
    [Parameter(Mandatory = $true)]
    [string]$ScriptRoot,
    
    [Parameter(Mandatory = $true)]
    [string]$RelativePath,
    
    [Parameter(Mandatory = $true)]
    [System.Net.HttpListenerResponse]$Response
)

$Server = "$ScriptRoot\inc\server"

# Resolve the file path
$FilePath = Join-Path $ScriptRoot $RelativePath
#Write-Host "Resolved File Path: $FilePath"
            
# Normalize the file path to handle any discrepancies
$NormalizedFilePath = [System.IO.Path]::GetFullPath($FilePath)
#Write-Host "Normalized File Path: $NormalizedFilePath"
            
# Determine the content type based on file extension
$Extension = [System.IO.Path]::GetExtension($NormalizedFilePath).ToLower()
$ContentType = switch ($Extension) {
    ".html" { "text/html" }
    ".css" { "text/css" }
    ".js" { "application/javascript" }
    ".jpg" { "image/jpeg" }
    ".jpeg" { "image/jpeg" }
    ".png" { "image/png" }
    ".gif" { "image/gif" }
    ".svg" { "image/svg+xml" }
    ".pdf" { "application/pdf" }
    ".xlsx" { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
    default { "application/octet-stream" }
}
            
# Serve the file if it exists
$StatusCode = 200
if (Test-Path -Path $NormalizedFilePath) {
    #Write-Host "File found: $NormalizedFilePath"
    $Buffer = [System.IO.File]::ReadAllBytes($NormalizedFilePath)
} else {
    #Write-Host "File not found: $NormalizedFilePath"
    $Buffer = [System.Text.Encoding]::UTF8.GetBytes("<html><body>404 Not Found</body></html>")
    $ContentType = "text/html"
    $StatusCode = 404
}

& "$Server\send-response.ps1" `
    -Response $Response `
    -ContentType $ContentType `
    -Buffer $Buffer `
    -StatusCode $StatusCode
