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
Write-Host "SAVING TO REPORT WEEKLY LINON"
Write-Host "==================================================================="

$WorkBook = & "$ScriptRoot\inc\get-report.ps1" `
    -ReportPath $ReportPath `
    -FileRegex "weekly.*?linon.*\.xlsx" `
    -Excel $Excel

if ($null -ne $WorkBook) {

    # Loop through WorkSheets
    $UpdatedRange = ""
    foreach ($WorkSheet in $WorkBook.WorkSheets) {
        if ($WorkSheet.Name -imatch "^0{5,}|^delivered|list$") {
            continue
        }
        Write-Host "WorkSheet:" $WorkSheet.Name -ForegroundColor Green

        $REMARK = Find-Header -WorkSheet $WorkSheet -HeaderStr "Comments/Vessel"
        if (-not $REMARK) {
            continue
        }

        #Write-Host $PO
        #Write-Host $REMARK

        foreach ($item in $PostData) {
            $CellAnchor = $null
            if ($item.po_numbers) {
                $CellAnchor = Find-Target `
                    -ArrStr $item.po_numbers `
                    -WorkSheet $WorkSheet `
                    -Anchor $REMARK `
                    -AppendRow $false
            }

            if (-not $CellAnchor -and $item.booking_number) {
                $CellAnchor = Find-Target `
                    -ArrStr $item.booking_number `
                    -WorkSheet $WorkSheet `
                    -Anchor $REMARK `
                    -AppendRow $false `
                    -LookAt 2
            }

            if (-not $CellAnchor) {
                continue
            }

            $RemarkValue = ""
            if ($item.vessel) {
                $RemarkValue += "VESSEL: " + $item.vessel + $vbCrLf
            }
            if ($item.etd) {
                $etd = Get-ShortDate -InputDate $item.etd
                $RemarkValue += "ETD: " + $etd
                if ($item.eta) {
                    $RemarkValue += " / "
                } else {
                    $RemarkValue += $vbCrLf
                }
            }
            if ($item.eta) {
                $eta = Get-ShortDate -InputDate $item.eta
                $RemarkValue += "ETA: " + $eta + $vbCrLf
            }
            if ($item.cont_number) {
                $RemarkValue += "CONT: " + $item.cont_number
            }
            $RemarkValue = $RemarkValue.TrimEnd($vbCrLf)

            # Update Cells
            if (-not $RemarkValue) {
                continue
            }

            #Write-Host ""
            #Write-Host "======================================================="
            #Write-Host $item.file_path
            #Write-Host $CellAnchor.Address()

            Update-Cell `
                -WorkSheet $WorkSheet `
                -CellRefCol $REMARK `
                -CellRefRow $CellAnchor.Address() `
                -Str $RemarkValue

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

    Write-Output 'ln'
}

Write-Host
Write-Host
Write-Host

