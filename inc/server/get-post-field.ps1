param (
    [Parameter(Mandatory = $true)]
    [System.Net.HttpListenerRequest]$Request,

    [Parameter(Mandatory = $true)]
    [string]$FieldName
)

# Read the Request input stream
$reader = New-Object System.IO.StreamReader($Request.InputStream)
$formData = $reader.ReadToEnd()

# Split the form data by newlines and filter out empty lines
$lines = $formData -split "`r`n" | Where-Object { $_ -ne '' }

# Initialize the value variable
$value = ""

# Iterate through the lines to find the field name and its value
for ($i = 0; $i -lt $lines.Length; $i++) {
    if ($lines[$i] -match "name=`"$FieldName`"") {
        # The value is on the next non-empty line
        $value = $lines[$i + 1]
        break
    }
}

Write-Output $value