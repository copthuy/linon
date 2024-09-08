param(
    [Parameter(Mandatory = $true)]
    [System.Net.HttpListenerRequest]$Request,

    [Parameter(Mandatory = $true)]
    [System.Net.HttpListenerResponse]$Response
)

$FilePath = $Request.QueryString["path"]

# Check if the file exists
if (Test-Path -Path $FilePath) {
    #Write-Host "Loading PDF: " $FilePath
    # Read the PDF file content
    $pdfContent = [System.IO.File]::ReadAllBytes($FilePath)

    # Set the response headers
    $Response.ContentType = "application/pdf"
    $Response.ContentLength64 = $pdfContent.Length

    # Write the PDF content to the response output stream
    $Response.OutputStream.Write($pdfContent, 0, $pdfContent.Length)
    $Response.OutputStream.Close()
} else {
    # Return a 404 Not Found response if the file does not exist
    $Response.StatusCode = 404
    $Response.StatusDescription = "File Not Found"
    $Response.OutputStream.Close()
}
