param (
    [Parameter(Mandatory = $true)]
    [string]$ScriptRoot,

    [Parameter(Mandatory = $true)]
    [string]$ReportPath,

    [Parameter(Mandatory = $true)]
    [PSCustomObject]$PostData,

    [Parameter(Mandatory = $true)]
    [Microsoft.Office.Interop.Excel.Application]$Excel
)

Write-Host "==================================================================="
Write-Host "SAVING TO DB"
Write-Host "==================================================================="

$WorkBook = & "$ScriptRoot\inc\get-report.ps1" `
    -ReportPath $ReportPath `
    -FileRegex "db\.xlsx" `
    -Excel $Excel

if ($null -ne $WorkBook) {
    $WorkSheet = $WorkBook.Sheets.Item(1)

    # Get the headers from the first row and create a hashtable for quick lookups
    $headerMap = @{}
    1..$WorkSheet.UsedRange.Columns.Count | ForEach-Object {
        $key = $WorkSheet.Cells.Item(1, $_).Text.ToLower() -replace ' ', '_'
        $headerMap[$key] = $_
    }

    foreach ($item in $PostData) {
        $LastRow = $WorkSheet.UsedRange.Rows.Count + 1
     
        Write-Host $item.file_path -ForegroundColor Red
        foreach ($key in $item.PSObject.Properties.Name) {
            if (-not $headerMap[$key]) {
                continue
            }
            $val = $item.$key
            $Cell = $WorkSheet.Cells.Item($LastRow, $headerMap[$key])
            $header = $key.ToUpper() -replace '_', ' '
            $header += ' (' + $Cell.Address() + '): '

            Write-Host $header -ForegroundColor Green -NoNewLine
            Write-Host $val -ForegroundColor Yellow

            # Append data below the last row in the correct column
            $Cell.Value = "$val"
        }
        Write-Host ""
    }
    $WorkSheet.UsedRange.Columns.AutoFit()
    
    # Close the WorkBook
    $WorkBook.Save()
    $WorkBook.Close()

    Write-Output "db"
}
Write-Host ""
Write-Host ""
Write-Host ""
