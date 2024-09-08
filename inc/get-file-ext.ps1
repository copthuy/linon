param(
    [Parameter(Mandatory = $true)]
    [string]$FilePath,

    [string]$ext = 'txt'
)
$fileBaseName = [System.IO.Path]::GetFileNameWithoutExtension($FilePath)
$fileDirectory = [System.IO.Path]::GetDirectoryName($FilePath)
$fileTxt = [System.IO.Path]::Combine($fileDirectory, "$fileBaseName.$ext")

Write-Output $fileTxt