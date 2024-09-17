$xlWhole = 1
$xlPart = 2
$xlByRows = 1
$xlByColumns = 2
$xlNone = -4142
$vbCrLf = [Environment]::NewLine

# Get cell coord
# 'B5' if get by row => '5', if get by col => 'B'
function Get-Coord {
    param (
        [Parameter(Mandatory = $true)]
        [string]$Address,

        [Parameter(Mandatory = $true)]
        [int]$xlOption
    )

    # Define the pattern based on xlOption
    $pattern = if ($xlOption -eq $xlByRows) { '\d+' } else { '[a-z]+' }

    # Extract the coordinate
    $address -match $pattern | Out-Null
    [string]$matches[0]
}

# Get cell based on a cell column and a cell row
# 'B5', 'C6' => 'B6'
function Get-Cell {
    param (
        [Parameter(Mandatory = $true)]
        [string]$CellRefCol,

        [Parameter(Mandatory = $true)]
        [string]$CellRefRow
    )
    
    $Col = Get-Coord -Address $cellRefCol -xlOption $xlByColumns
    $Row = Get-Coord -Address $cellRefRow -xlOption $xlByRows
    
    [string]"$Col$Row"
}

function Find-Range {
    param (
        [Parameter(Mandatory = $true)]
        [object]$Range,

        [Parameter(Mandatory = $true)]
        [string]$FindStr,

        [Parameter(Mandatory = $true)]
        [int]$LookAt
    )

    $cells = @()

    # Find the first occurrence
    $cell = $Range.Find($FindStr, [Type]::Missing, [Type]::Missing, $LookAt)
    
    if ($cell) {
        $FirstAddress = $cell.Address()
        Do {
            $cells += $cell.Address()
            $cell = $range.FindNext($cell)
        } While ($cell -and $FirstAddress -ne $cell.Address())
    }

    [array]$cells
}

function Find-Header {
    param (
        [Parameter(Mandatory = $true)]
        [object]$WorkSheet,

        [Parameter(Mandatory = $true)]
        [string]$HeaderStr
    )

    $HeaderAddress = $null
    $HeaderRange = [array]( 
        Find-Range `
        -Range $WorkSheet.UsedRange `
        -FindStr $HeaderStr `
        -LookAt $xlPart `
    )

    if ($HeaderRange.Length -ge 1 ) {
        $HeaderAddress = $HeaderRange[0]
    }

    $HeaderAddress
}

function Find-Target {
    param (
        [Parameter(Mandatory = $true)]
        [string]$ArrStr,

        [Parameter(Mandatory = $true)]
        [object]$WorkSheet,

        [Parameter(Mandatory = $true)]
        [string]$Anchor,

        [bool]$AppendRow = $true,

        [int]$LookAt = $xlWhole
    )

    $arr = [array]( $ArrStr -split ";" | ForEach-Object { $_.Trim() } | Sort )
    $cells = [array](
        Find-Range `
        -Range $WorkSheet.UsedRange `
        -FindStr $arr[0] `
        -LookAt $LookAt
    )
    
    $UpdateCell = $null
    foreach ($cell in $cells) {
        $RemarkCell = Get-Cell -CellRefCol $Anchor -CellRefRow $cell

        # Write-Host $RemarkCell
        $TargetCell = $WorkSheet.Range($RemarkCell)
        $TargetMergeAddress = $TargetCell.MergeArea.Address()

        if ( $TargetMergeAddress -ne $TargetCell.Address() ) {
            $Column = Get-Coord -Address $cell -xlOption $xlByColumns
            $Range = $TargetMergeAddress -replace '[a-z]+', $Column
            $RangeArr = $WorkSheet.Range( $Range ).Value() | Sort -Unique

            if ( ( "$arr" -eq "$RangeArr" ) -or ( $LookAt -eq $xlPart ) ) {
                $UpdateCell = $TargetCell
            }

        } elseif ($arr.Length -eq 1) {
            $UpdateCell = $TargetCell
        }
    }

    if ( -not $UpdateCell -and $AppendRow) {
        $RemarkColumn = Get-Coord -Address "$Anchor" -xlOption $xlByColumns
        $LastRow = $WorkSheet.UsedRange.Rows.Count + 1
        $UpdateCell = $WorkSheet.Range($RemarkColumn + $LastRow)
    }

    $UpdateCell

}

function Update-Cell {
    param (
        [Parameter(Mandatory = $true)]
        [object]$WorkSheet,

        [Parameter(Mandatory = $true)]
        [string]$CellRefCol,

        [Parameter(Mandatory = $true)]
        [string]$CellRefRow,

        [Parameter(Mandatory = $false)]
        [string]$Str
    )

    if (-not $Str) {
        return
    }

    $Col = $WorkSheet.Range($CellRefCol).Value()
    $CellAddress = Get-Cell -CellRefCol $CellRefCol -CellRefRow $CellRefRow
    $Cell = $WorkSheet.Range($CellAddress)
    $OldValue = $Cell.MergeArea.Value()
    #$OldValue = ""

    if ($OldValue -ne $Str) {
        #Write-Host $Col": " -NoNewLine
        #Write-Host $Cell.Address()": "$OldValue "----->" $Str
        if ( $Col -imatch 'comments|remark' ) {
            $Str = $OldValue + $vbCrLf + "====================" + $vbCrLf + $Str
        }
        $Cell.MergeArea.Value = $Str
        $Cell.MergeArea.Rows.AutoFit() | Out-Null
    }
}


function Color-Row {
    param (
        [Parameter(Mandatory = $true)]
        [object]$WorkSheet,

        [Parameter(Mandatory = $true)]
        [object]$CellAnchor
    )

    $StartRow = $CellAnchor.MergeArea.Row
    $StartColumn = $WorkSheet.UsedRange.Column
    $StartCell = $WorkSheet.Cells.Item($StartRow, $StartColumn)

    $EndRow = $StartRow + $CellAnchor.MergeArea.Rows.Count - 1
    $EndColumn = $StartColumn + $WorkSheet.UsedRange.Columns.Count - 1
    $EndCell = $WorkSheet.Cells.Item($EndRow, $EndColumn)
    
    $ColorIndex = 33
    $Range = $WorkSheet.Range($StartCell, $EndCell) 
    $Range | ForEach-Object {
        $_.Interior.ColorIndex = $ColorIndex
    }

    Write-Output $Range.Address()
}
