# Simple Static Web Server in PowerShell with database API endpoint
$port = 8080
$root = "c:\Users\ADMIN\Desktop\project"
$dbFilePath = Join-Path $root "db.json"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host "Local server running at: http://localhost:$port/"
    Write-Host "Serving files from: $root"
    Write-Host "To stop server, close this window or terminate the task."

    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # Get request path and sanitize
        $urlPath = $request.RawUrl.Split('?')[0].TrimStart("/")
        if ([string]::IsNullOrWhiteSpace($urlPath)) { $urlPath = "index.html" }

        # 1. API Route: GET / POST db.json database
        if ($urlPath -eq "api/db") {
            if ($request.HttpMethod -eq "GET") {
                if (-not (Test-Path $dbFilePath)) {
                    [System.IO.File]::WriteAllText($dbFilePath, "{}")
                }
                $response.ContentType = "application/json; charset=utf-8"
                $buffer = [System.IO.File]::ReadAllBytes($dbFilePath)
                $response.ContentLength64 = $buffer.Length
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
                $response.StatusCode = 200
            }
            elseif ($request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream)
                $body = $reader.ReadToEnd()
                [System.IO.File]::WriteAllText($dbFilePath, $body)

                $response.ContentType = "application/json; charset=utf-8"
                $resBody = '{"success":true}'
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($resBody)
                $response.ContentLength64 = $buffer.Length
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
                $response.StatusCode = 200
            }
            $response.Close()
            continue
        }

        # 2. Static Files Route
        $filePath = Join-Path $root $urlPath
        if (Test-Path $filePath -PathType Leaf) {
            # Set correct MIME Type
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = "application/octet-stream"
            if ($ext -eq ".html" -or $ext -eq ".htm") { $contentType = "text/html; charset=utf-8" }
            elseif ($ext -eq ".css") { $contentType = "text/css; charset=utf-8" }
            elseif ($ext -eq ".js") { $contentType = "application/javascript; charset=utf-8" }
            elseif ($ext -eq ".png") { $contentType = "image/png" }
            elseif ($ext -eq ".jpg" -or $ext -eq ".jpeg") { $contentType = "image/jpeg" }
            elseif ($ext -eq ".svg") { $contentType = "image/svg+xml" }

            $response.ContentType = $contentType
            $buffer = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.StatusCode = 200
        } else {
            $response.StatusCode = 404
            Write-Host "404 Not Found: $urlPath"
        }
        $response.Close()
    }
} catch {
    Write-Host "Error: $_"
} finally {
    $listener.Stop()
}
