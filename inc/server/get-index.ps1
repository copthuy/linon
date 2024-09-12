param (
    [Parameter(Mandatory = $true)]
    [string]$ScriptRoot,

    [Parameter(Mandatory = $true)]
    [string]$DataPath,

    [Parameter(Mandatory = $true)]
    [string]$TmpData,

    [Parameter(Mandatory = $true)]
    [System.Net.HttpListenerResponse]$Response
)

$Server = "$ScriptRoot\inc\server"
$fileList = Get-Content -Path $TmpData -Raw

# Get all jpg files in the static/images directory
$imageFiles = Get-ChildItem -Path (Join-Path $ScriptRoot 'static/images/*.jpg')

# Select a random jpg file
$RandomFile = Get-Random -InputObject $imageFiles

# Read the contents of index.html
$HtmlPath = Join-Path $ScriptRoot '/static/html/index.html'
$HtmlContent = Get-Content -Path $HtmlPath -Raw -Encoding UTF8

# Replace background and export content
$HtmlContent = $HtmlContent -replace '{{random_file}}', $RandomFile.Name
$HtmlContent = $HtmlContent -replace '{{file_list}}', $fileList
$Buffer = [System.Text.Encoding]::UTF8.GetBytes($HtmlContent)

& "$Server\send-response.ps1" `
    -Response $Response `
    -ContentType "text/html" `
    -Buffer $Buffer
