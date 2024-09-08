param (
    [Parameter(Mandatory = $true)]
    [System.Net.HttpListenerResponse]$Response,
    
    [Parameter(Mandatory = $true)]
    [string]$ContentType,
    
    [Parameter(Mandatory = $true)]
    [byte[]]$Buffer,
    
    [int]$StatusCode = 200
)

# Set the response status code
$Response.StatusCode = $StatusCode

# Set the response content type
$Response.ContentType = $ContentType

# Set the content length to the length of the byte array
$Response.ContentLength64 = $Buffer.Length

# Write the byte array to the output stream
$Output = $Response.OutputStream
$Output.Write($Buffer, 0, $Buffer.Length)
$Output.Close()