# Converte cada SVG de saida/ em PNG com o Edge sem janela (Windows).
# Uso, no PowerShell, dentro desta pasta:  powershell -ExecutionPolicy Bypass -File fotografar.ps1
# No Mac, o mesmo com o Chrome: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --screenshot=...
$saida = Join-Path $PSScriptRoot 'saida'
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
Get-ChildItem $saida -Filter *.svg | ForEach-Object {
  $svg = Get-Content $_.FullName -Raw
  $w = [int]([regex]::Match($svg, 'width="(\d+)"').Groups[1].Value)
  $h = [int]([regex]::Match($svg, 'height="(\d+)"').Groups[1].Value)
  $html = Join-Path $saida ($_.BaseName + '.html')
  Set-Content -Path $html -Encoding utf8 -Value "<html><body style='margin:0;background:#0d1322'><img src='$($_.Name)' style='width:$($w)px;height:$($h)px;display:block'></body></html>"
  $png = Join-Path $saida ($_.BaseName + '.png')
  $url = 'file:///' + $html.Replace('\', '/')
  Start-Process -FilePath $edge -ArgumentList @('--headless=new', '--disable-gpu', '--hide-scrollbars', "--window-size=$w,$h", "--screenshot=$png", $url) -Wait -WindowStyle Hidden
  Remove-Item $html
}
Get-ChildItem $saida -Filter *.png | Measure-Object | ForEach-Object { "$($_.Count) imagens em $saida" }
