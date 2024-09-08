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
Write-Host "SAVING TO SHIPPING REPORT"
Write-Host "==================================================================="

$WorkBook = & "$ScriptRoot\inc\get-report.ps1" `
    -ReportPath $ReportPath `
    -FileRegex "shipping\s+report.*\.xlsx" `
    -Excel $Excel

if ($null -ne $WorkBook) {

    # Loop through WorkSheets
    $UpdatedRange = ""
    foreach ($WorkSheet in $WorkBook.WorkSheets) {
        if ($WorkSheet.Name -imatch "^0{5,}|^delivered|list$") {
            continue
        }
        Write-Host "WorkSheet:" $WorkSheet.Name -ForegroundColor Green

        $BOOKING = Find-Header -WorkSheet $WorkSheet -HeaderStr "BOOKING"
        $DATE    = "C1"
        $POL =     Find-Header -WorkSheet $WorkSheet -HeaderStr "POL"
        $POD =     Find-Header -WorkSheet $WorkSheet -HeaderStr "POD"
        $ETD =     Find-Header -WorkSheet $WorkSheet -HeaderStr "ETD"
        $ATD =     Find-Header -WorkSheet $WorkSheet -HeaderStr "ATD"
        $ETA =     Find-Header -WorkSheet $WorkSheet -HeaderStr "ETA"
        $CONT =    Find-Header -WorkSheet $WorkSheet -HeaderStr "CONT"
        $REMARK1 = Find-Header -WorkSheet $WorkSheet -HeaderStr "REMARK1"
        $BILL =    Find-Header -WorkSheet $WorkSheet -HeaderStr "BILL"

        #Write-Host $BOOKING
        #Write-Host $DATE
        #Write-Host $POL
        #Write-Host $POD
        #Write-Host $ETD
        #Write-Host $ATD
        #Write-Host $ETA
        #Write-Host $CONT
        #Write-Host $REMARK1
        #Write-Host $BILL
        #continue

        foreach ($item in $PostData) {
            $Str = $null
            switch ($item.type) {
                "booking" { 
                    $SH = switch ($item.shipping_company) {
                        "EVERGREEN LINE" { "EVERGREEN" }
                        "MEDITERRANEAN SHIPPING" { "MSC" }
                        "OCEAN NETWORK EXPRESS" { "ONE" }
                        default { $item.shipping_company }
                    }
                    if ($SH -ne $WorkSheet.Name) {
                        continue
                    }
                    $Str = "APPEND TO BOTTOM"
                    $DataList = @(
                        [pscustomobject]@{
                            Field = $BOOKING
                            Value = $item.booking_number
                        },
                        [pscustomobject]@{
                            Field = $DATE
                            Value = $item.booking_date
                        },
                        [pscustomobject]@{
                            Field = $POD
                            Value = $item.pod
                        },
                        [pscustomobject]@{
                            Field = $POL
                            Value = $item.pol
                        },
                        [pscustomobject]@{
                            Field = $ETD
                            Value = $item.etd
                        },
                        [pscustomobject]@{
                            Field = $ETA
                            Value = $item.eta
                        },
                        [pscustomobject]@{
                            Field = $BILL
                            Value = $item.bill_number
                        }
                    )
                }
                "doc" {
                    $Str = $item.bill_number
                    $DataList = @(
                        [pscustomobject]@{
                            Field = $ATD
                            Value = $item.eta
                        },
                        [pscustomobject]@{
                            Field = $CONT
                            Value = $item.cont_number
                        }
                    )
                }
                "new" {
                    $Str = $item.booking_number
                    $DataList = @(
                        [pscustomobject]@{
                            Field = $REMARK1
                            Value = $item.etd
                        }
                    )
                }
            }

            if (-not $Str) {
                continue
            }

            #Write-Host ""
            #Write-Host "======================================================="
            #Write-Host $item.file_path

            $CellAnchor = Find-Target `
                -ArrStr $Str `
                -WorkSheet $WorkSheet `
                -Anchor $BILL

            #Write-Host $CellAnchor.Address()
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

    Write-Output 'shipping'
}

Write-Host
Write-Host
Write-Host
