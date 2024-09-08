param (
    [Parameter(Mandatory = $true)]
    [string]$ScriptRoot,

    [Parameter(Mandatory = $true)]
    [string]$FilePath,

    [Parameter(Mandatory = $true)]
    [Microsoft.Office.Interop.Excel.Application]$Excel,

    [Parameter(Mandatory = $true)]
    [string]$xpdf,

    [Parameter(Mandatory = $true)]
    [string]$tesseract
)

$FilePDF = $FilePath -replace '.xlsx?', '.pdf'
$FileTxt = & "$ScriptRoot\inc\get-file-ext.ps1" -FilePath $FilePath
$FileExtension = [System.IO.Path]::GetExtension($FilePath).ToLower()

if (-not (Test-Path -Path $FilePDF)) {
    $xlsFile = & "$ScriptRoot\inc\get-file-ext.ps1" -FilePath $FilePath -ext "xls"
    $xlsxFile = & "$ScriptRoot\inc\get-file-ext.ps1" -FilePath $FilePath -ext "xlsx"
    $excelFile = if (Test-Path -Path $xlsFile) { $xlsFile } elseif (Test-Path -Path $xlsxFile) { $xlsxFile }

    if ($excelFile) {
        Write-Host "Converting $xlsFile to $FilePDF"
        # Initialize the main output file (clear or create it)
        Out-File -FilePath $FileTxt -Encoding UTF8 -Force
        
        $Workbook = $Excel.Workbooks.Open($excelFile)
        # Fix scaling to avoid drop content
        $margin = $Excel.Application.InchesToPoints(0.25)
        $paperWidth = $Excel.Application.InchesToPoints(8.27)    
        
        foreach ($sheet in $Workbook.Sheets) {
            Write-Host $sheet.Name
            $sheet.PageSetup.PaperSize = 9
            $sheet.PageSetup.LeftMargin = 0
            $sheet.PageSetup.RightMargin = 0
            $printableWidth = $paperWidth - 2 * $margin;

            # Get the current print area
            $printArea = $sheet.PageSetup.PrintArea
            #Write-Host "printArea: "$printArea
            
            # If no print area is defined, use the used range
            if ([string]::IsNullOrEmpty($printArea)) {
                $printAreaRange = $sheet.UsedRange
            } else {
                # Define the print area range
                $printAreaRange = $sheet.Range($printArea)
            }
            
            # Use A4 paper size width
            $printAreaWidth = $printAreaRange.Width
            #Write-Host "printAreaWidth: "$printAreaWidth

            $zoomScale = [math]::min(100, ($printableWidth / $printAreaWidth) * 100)
            $zoomScale = [math]::floor($zoomScale) - 5
            
            # Ensure zoomScale is not negative or out of valid range
            if ($zoomScale -lt 10) {
                $zoomScale = 10
            }
            $sheet.PageSetup.Zoom = [int]$zoomScale
            #Write-Host
            #Write-Host
            #Write-Host
        }            
        $Workbook.ExportAsFixedFormat([Microsoft.Office.Interop.Excel.XlFixedFormatType]::xlTypePDF, $FilePDF)
        $Workbook.Close()
        & "$xpdf\pdftotext.exe" -q -table $FilePDF $fileTxt
    }
}

if (-not (Test-Path -Path $FileTxt)) {
    if (Test-Path -Path $FilePDF) {
        # Extract text from the current page
        & "$xpdf\pdftotext.exe" -q -table $FilePDF $fileTxt
    }
}

$FileContent = ''
if (Test-Path -Path $FileTxt) {
    $FileContent = Get-Content -Path $FileTxt -Raw
}
Write-Output $FileContent
