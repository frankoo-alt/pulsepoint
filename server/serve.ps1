# ==============================================================================
# PulsePoint Local Static Web Server (PowerShell HttpListener)
# Serves static assets & ES modules over HTTP with proper MIME types
# ==============================================================================

param(
    [int]$Port = 8080,
    [string]$RootDirectory = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
)

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Prefixes.Add("http://127.0.0.1:$Port/")

try {
    $listener.Start()
    Write-Host "======================================================================" -ForegroundColor Cyan
    Write-Host " PulsePoint Web Platform running at: http://localhost:$Port" -ForegroundColor Green
    Write-Host " Serving files from: $RootDirectory" -ForegroundColor Gray
    Write-Host " Press Ctrl+C in this terminal to terminate server" -ForegroundColor Yellow
    Write-Host "======================================================================" -ForegroundColor Cyan
} catch {
    Write-Host "Port $Port is busy, trying port 8085..." -ForegroundColor Yellow
    $Port = 8085
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$Port/")
    $listener.Prefixes.Add("http://127.0.0.1:$Port/")
    $listener.Start()
    Write-Host "PulsePoint Web Platform running at: http://localhost:$Port" -ForegroundColor Green
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".sql"  = "text/plain; charset=utf-8"
    ".md"   = "text/markdown; charset=utf-8"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        try {
            $request = $context.Request
            $response = $context.Response

            # Standard CORS and cache headers
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.AddHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS")
            $response.AddHeader("Access-Control-Allow-Headers", "*")
            $response.AddHeader("Cache-Control", "no-cache")

            if ($request.HttpMethod -eq "OPTIONS") {
                $response.StatusCode = 200
                $response.Close()
                continue
            }

            $urlPath = $request.Url.LocalPath.TrimStart('/')
            if ([string]::IsNullOrWhiteSpace($urlPath)) {
                $urlPath = "index.html"
            }

            # Prevent directory traversal
            $filePath = [System.IO.Path]::GetFullPath((Join-Path $RootDirectory $urlPath))
            if (-not $filePath.StartsWith($RootDirectory, [System.StringComparison]::OrdinalIgnoreCase)) {
                $response.StatusCode = 403
                $response.Close()
                continue
            }

            if (Test-Path $filePath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
                $response.ContentType = $contentType
                $response.StatusCode = 200

                $bytes = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentLength64 = $bytes.Length

                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                }
            } else {
                $response.StatusCode = 404
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
                $response.ContentType = "text/plain; charset=utf-8"
                $response.ContentLength64 = $errBytes.Length

                if ($request.HttpMethod -ne "HEAD") {
                    $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
                }
            }

            $response.Close()
        } catch {
            Write-Warning "Error processing request: $_"
            try { $context.Response.Close() } catch {}
        }
    }
} finally {
    $listener.Stop()
    $listener.Close()
}
