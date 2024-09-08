param (
    [Parameter(Mandatory = $true)]
    [string]$ScriptRoot,

    [Parameter(Mandatory = $true)]
    [string]$FilePath,

    [Parameter(Mandatory = $true)]
    [string]$xpdf,

    [Parameter(Mandatory = $true)]
    [string]$tesseract
)

$fileTxt = & "$ScriptRoot\inc\get-file-ext.ps1" -FilePath $FilePath

if (Test-Path -Path $FilePath) {
    if (-not (Test-Path $fileTxt)) {
        $fileContent = ""
        $Content = & "$xpdf\pdftotext.exe" -q -table $FilePath -
        
        Set-Content -Path $fileTxt -Value $Content

        # Extract image and convert to text
        & "$xpdf\pdfimages.exe" -j $FilePath $TmpPath"\"

        Get-ChildItem -Path $TmpPath -Filter "*.jpg" | Select-Object -First 2 |
        ForEach-Object {
            $OutputPath = Join-Path -Path $TmpPath -ChildPath $_.BaseName
            $outputPDF = $OutputPath + ".pdf"

            & "$tesseract\tesseract.exe" $_.FullName $OutputPath --tessdata-dir "$tesseract\tessdata" -l eng --dpi 300 --psm 11 --oem 2 pdf
            
            $Content = & "$xpdf\pdftotext.exe" -q -table $outputPDF -
            Add-Content -Path $fileTxt -Value $Content
        }

        # Remove all files in the TmpPath to make the next round clean
        Get-ChildItem -Path $TmpPath -File | Remove-Item -Force
    }
    $fileContent = ''
    if (Test-Path -Path $fileTxt) {
        $fileContent = Get-Content -Path $fileTxt -Raw
    }
    Write-Output $fileContent
}

