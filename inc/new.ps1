param (
    [Parameter(Mandatory = $true)]
    [string]$ScriptRoot,

    [Parameter(Mandatory = $true)]
    [string]$FilePath,

    [Parameter(Mandatory = $true)]
    [Microsoft.Office.Interop.Excel.Application]$Excel
)

if (Test-Path -Path $FilePath) {
    $Workbook = $Excel.Workbooks.Open($FilePath)
    $DataSheet = $Workbook.Sheets.Item(1);

    $data = @()

    # Get the used range of the sheet (i.e., the area with data)
    $range = $DataSheet.UsedRange
    $rows = $range.Rows.Count
    $columns = $range.Columns.Count

    # Loop through each row and create a hashtable for each row
    for ($row = 2; $row -le $rows; $row++) {
        $rowData = @{}
        $rowHasData = $false
        for ($col = 1; $col -le $columns; $col++) {
            $header = $range.Cells.Item(1, $col).Text.Trim()
            $value = $range.Cells.Item($row, $col).Value()
            if ($null -ne $value) {
                $value = $value.ToString().Trim()
            } else {
                $value = ""
            }
            if ($value -ne '') {
                $rowHasData = $true
            }
            $rowData[$header] = $value
        }
        if ($rowHasData) {
            $data += $rowData
        }
    }
    $Workbook.Close()

    Write-Output $data | ConvertTo-Json
}
