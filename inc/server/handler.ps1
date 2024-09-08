param (
    [Parameter(Mandatory = $true)]
    [string]$ScriptRoot,

    [Parameter(Mandatory = $true)]
    [string]$ReportPath,

    [Parameter(Mandatory = $true)]
    [string]$DataPath,

    [Parameter(Mandatory = $true)]
    [string]$TmpData,

    [Parameter(Mandatory = $true)]
    [System.Net.HttpListener]$Listener,

    [Parameter(Mandatory = $true)]
    [Microsoft.Office.Interop.Excel.Application]$Excel
)

$Server = "$ScriptRoot\inc\server"

# Wait for a request
$Context = $Listener.GetContext()
$Request = $Context.Request
$Response = $Context.Response

# Decode the URL path to handle spaces, special characters, and # character
$rawRelativePath = $Request.Url.AbsolutePath.TrimStart('/')
$RelativePath = [System.Uri]::UnescapeDataString($rawRelativePath)

#Write-Host "Requested URL: $($Request.Url.AbsolutePath)"
#Write-Host "Decoded Path: $RelativePath"

switch -Wildcard ($RelativePath) {
    "" {
        & "$Server\get-index.ps1" `
            -ScriptRoot $ScriptRoot `
            -DataPath $DataPath `
            -TmpData $TmpData `
            -Response $Response
    }
    "load-file" {
        & "$Server\load-file.ps1" `
            -Request $Request `
            -Response $Response
    }
    "save-data" {
        & "$Server\save-data.ps1" `
            -ScriptRoot $ScriptRoot `
            -Request $Request `
            -Response $Response `
            -ReportPath $ReportPath `
            -Excel $Excel
    }
    "stop" {
        $Listener.Stop()
        Write-Host "Listener stopped."
    }
    default {
        & "$Server\resolve-and-send-file.ps1" `
            -ScriptRoot $ScriptRoot `
            -RelativePath $RelativePath `
            -Response $Response
    }
}
