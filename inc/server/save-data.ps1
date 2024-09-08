param (
    [Parameter(Mandatory = $true)]
    [string]$ScriptRoot,

    [Parameter(Mandatory = $true)]
    [System.Net.HttpListenerRequest]$Request,

    [Parameter(Mandatory = $true)]
    [System.Net.HttpListenerResponse]$Response,

    [Parameter(Mandatory = $true)]
    [string]$ReportPath,

    [Parameter(Mandatory = $true)]
    [Microsoft.Office.Interop.Excel.Application]$Excel
)

$Server = "$ScriptRoot\inc\server"

if ($Request.HttpMethod -eq "POST") {
    $PostData = & "$Server\get-post-field.ps1" `
        -Request $Request `
        -FieldName 'data' | ConvertFrom-Json

    Clear-Host
    $Status = @()

    Get-ChildItem -Path "$ScriptRoot\inc\reports\*.ps1" |
    ForEach-Object {
        $Status += & $_.FullName `
            -ScriptRoot $ScriptRoot `
            -ReportPath $ReportPath `
            -PostData $PostData `
            -Excel $Excel
    }

    $jsonResponse = @{
        status = $Status
    } | ConvertTo-Json

    $Buffer = [System.Text.Encoding]::UTF8.GetBytes($jsonResponse)

    & "$Server\send-response.ps1" `
        -Response $Response `
        -ContentType "application/json" `
        -Buffer $Buffer

    Write-Host "- Updated! -"
}
