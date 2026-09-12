# Puts Medical Sign on the Desktop and in the Start menu, with its own icon.
#
#   Right-click this file -> Run with PowerShell
#
# Nothing is installed and nothing is written outside your own user folder;
# both entries just point at "Medical Sign.bat" in this folder. Delete the
# shortcuts whenever you like - the app itself is unaffected.

$ErrorActionPreference = 'Stop'

$here   = Split-Path -Parent $MyInvocation.MyCommand.Path
$target = Join-Path $here 'Medical Sign.bat'
$icon   = Join-Path $here 'medsign.ico'

if (-not (Test-Path $target)) {
    Write-Host "Could not find 'Medical Sign.bat' next to this script." -ForegroundColor Red
    Read-Host 'Press Enter to close'
    exit 1
}

$shell = New-Object -ComObject WScript.Shell

function New-MedSignShortcut([string]$path) {
    $lnk = $shell.CreateShortcut($path)
    $lnk.TargetPath       = $target
    $lnk.WorkingDirectory = $here
    $lnk.Description      = 'Medical Sign - מערכת ניהול שילוט דיגיטלי'
    # a .bat always flashes a console for a moment; 7 = minimised, least intrusive
    $lnk.WindowStyle      = 7
    if (Test-Path $icon) { $lnk.IconLocation = "$icon,0" }
    $lnk.Save()
    Write-Host "  created  $path" -ForegroundColor Green
}

$desktop = [Environment]::GetFolderPath('Desktop')
New-MedSignShortcut (Join-Path $desktop 'Medical Sign.lnk')

$startMenu = Join-Path $env:APPDATA 'Microsoft\Windows\Start Menu\Programs'
if (Test-Path $startMenu) {
    New-MedSignShortcut (Join-Path $startMenu 'Medical Sign.lnk')
}

Write-Host ''
Write-Host 'Done. Medical Sign is on your Desktop and in the Start menu.' -ForegroundColor Cyan
Write-Host 'Open it once, then use Chrome''s install button for a real app window.'
Write-Host ''
Read-Host 'Press Enter to close'
