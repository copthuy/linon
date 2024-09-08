param (
    [Parameter(Mandatory = $true)]
    [string]$ScriptRoot,

    [Parameter(Mandatory = $true)]
    [string]$DataPath,

    [Parameter(Mandatory = $true)]
    [string]$TmpData,

    [Parameter(Mandatory = $true)]
    [Microsoft.Office.Interop.Excel.Application]$Excel
)

# 3rd-party
$xpdf = "$ScriptRoot\3rd-party\xpdf"
$tesseract = "$ScriptRoot\3rd-party\tesseract"

$Content = Get-ChildItem -Path $DataPath -Recurse -File |
    Where-Object {
        $_.Name -match "^(booking|doc|new\s+version).*" -and
        @('.pdf', '.xls', '.xlsx').Contains($_.Extension.ToLower())
    } |
    Group-Object {
        $_.BaseName  # Group by the file name without the extension
    } |
    ForEach-Object {
        # Check if there's an xls or xlsx file in the group
        $xlsOrXlsx = $_.Group | Where-Object { @('.xls', '.xlsx').Contains($_.Extension.ToLower()) }

        if ($xlsOrXlsx) {
            # Include the xls or xlsx file(s) and ignore the pdf
            $xlsOrXlsx.FullName
        } else {
            # If no xls or xlsx file, include the pdf
            $_.Group | Where-Object { $_.Extension.ToLower() -eq '.pdf' } | ForEach-Object { $_.FullName }
        }
    } |
    Select-Object -Unique |
    ForEach-Object {
        $FileContent = ''
        if ($_ -imatch 'booking') {
            $FileContent = & "$ScriptRoot\inc\booking.ps1" `
                -ScriptRoot $ScriptRoot `
                -FilePath $_ `
                -xpdf $xpdf `
                -tesseract $tesseract
        } elseif ($_ -imatch 'doc') {
            $FileContent = & "$ScriptRoot\inc\doc.ps1" `
                -ScriptRoot $ScriptRoot `
                -FilePath $_ `
                -Excel $Excel `
                -xpdf $xpdf `
                -tesseract $tesseract
        } elseif ($_ -imatch 'new\s+version') {
            $FileContent = & "$ScriptRoot\inc\new.ps1" `
                -ScriptRoot $ScriptRoot `
                -FilePath $_ `
                -Excel $Excel
        }
        [pscustomobject]@{
            file_path = $_
            file_content = [string]$FileContent
        }
    } |
    ConvertTo-Json

Set-Content -Path $TmpData -Value $Content
