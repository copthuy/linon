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
. "$ScriptRoot\inc\excel.ps1"

Write-Host "==================================================================="
Write-Host "SAVING TO REPORT - LINON"
Write-Host "==================================================================="

$WorkBook = & "$ScriptRoot\inc\get-report.ps1" `
    -ReportPath $ReportPath `
    -FileRegex "report\s*-\s*linon.*\.xlsx" `
    -Excel $Excel

if ($null -ne $WorkBook) {

    # Loop through WorkSheets
    $UpdatedRange = ""
    foreach ($WorkSheet in $WorkBook.WorkSheets) {
        if ($WorkSheet.Name -imatch "^0{5,}|^delivered|list$") {
            continue
        }

        $PO =      "B5"
        $ETD =     Find-Header -WorkSheet $WorkSheet -HeaderStr "ETD"
        $ETA =     Find-Header -WorkSheet $WorkSheet -HeaderStr "ETA"
        $REMARK =  Find-Header -WorkSheet $WorkSheet -HeaderStr "REMARK"
        $BOOKING = Find-Header -WorkSheet $WorkSheet -HeaderStr "Booking"
        $INVOICE = Find-Header -WorkSheet $WorkSheet -HeaderStr "Invoice"
        $AMOUNT =  Find-Header -WorkSheet $WorkSheet -HeaderStr "Amount"

        if (-not $REMARK) {
            continue
        }
        
        Write-Host "WorkSheet:" $WorkSheet.Name -ForegroundColor Green
        foreach ($item in $PostData) {
            $Str = switch ($item.type) {
                {$_ -imatch "booking|doc"} { $item.po_numbers }
                "new" { $item.booking_number }
                default { $null }
            }

            if (-not $Str) {
                continue
            }

            #Write-Host "======================================================="
            #Write-Host $item.file_path

            $CellAnchor = Find-Target `
                -ArrStr $Str `
                -WorkSheet $WorkSheet `
                -Anchor $REMARK
            if (-not $CellAnchor) {
                continue
            }

            $RemarkValue = ""
            if ($item.closing_time) {
                $RemarkValue += "Closing Time: " + $item.closing_time + $vbCrLf
            }
            if ($item.si_cut_off) {
                $RemarkValue += "SI Cut Off: " + $item.si_cut_off
            }

            $DataList = @(
                [pscustomobject]@{
                    Field = $ETD
                    Value = $item.etd
                },
                [pscustomobject]@{
                    Field = $ETA
                    Value = $item.eta
                },
                [pscustomobject]@{
                    Field = $REMARK
                    Value = $RemarkValue
                },
                [pscustomobject]@{
                    Field = $BOOKING
                    Value = $item.booking_number
                },
                [pscustomobject]@{
                    Field = $INVOICE
                    Value = $item.invoice_number
                },
                [pscustomobject]@{
                    Field = $AMOUNT
                    Value = $item.total
                }
            )

            # Check new row
            $PoCell = Get-Cell `
                -CellRefCol $PO `
                -CellRefRow $CellAnchor.Address()
            $PoCell = $WorkSheet.Range( $PoCell )
            if (-not $PoCell.Value()) {
                $DataList += [pscustomobject]@{
                    Field = $PO
                    Value = $item.po_numbers
                }
            }

            # Update Cells
            foreach ($data in $DataList) {
                Update-Cell `
                    -WorkSheet $WorkSheet `
                    -CellRefCol $data.Field `
                    -CellRefRow $CellAnchor.Address() `
                    -Str $data.Value
            }

            # Color updated row
            Color-Row `
                -WorkSheet $WorkSheet `
                -CellAnchor $CellAnchor 

            Write-Host "-" $CellAnchor.Address() -ForegroundColor Yellow
        }
    }

    # Close the WorkBook
    $WorkBook.Save()
    $WorkBook.Close()

    Write-Output "linon"
}
Write-Host
Write-Host
Write-Host
