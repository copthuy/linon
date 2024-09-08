param (
    [Parameter(Mandatory = $true)]
    [string]$ReportPath,

    [Parameter(Mandatory = $true)]
    [string]$FileRegex,

    [Parameter(Mandatory = $true)]
    [Microsoft.Office.Interop.Excel.Application]$Excel
)

$WorkBook = $null
$ReportFile = Get-ChildItem -Path $ReportPath -Recurse -File |
    Where-Object { $_.Name -imatch $FileRegex } |
    Select-Object -First 1

if ($null -ne $ReportFile) {
    $WorkBook = $Excel.Workbooks.Open($ReportFile.FullName)
}

$WorkBook
