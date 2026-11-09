param(
  [string]$remoteUrl = ""
)

Write-Host "🔄 Sincronizando Desktop com Drive D (se disponível)..." -ForegroundColor Cyan
if (Test-Path "D:\Projetos\Idiomas") {
  robocopy "C:\Users\seuca\Desktop\Idiomas" "D:\Projetos\Idiomas" /E /XD node_modules
  Write-Host "✅ Drive D sincronizado com sucesso!" -ForegroundColor Green
} else {
  Write-Host "⚠️ Drive D não conectado no momento. Sincronização com o drive externo adiada." -ForegroundColor Yellow
}

if ($remoteUrl) {
  Write-Host "🚀 Enviando commits para o GitHub: $remoteUrl..." -ForegroundColor Cyan
  git remote remove origin 2>$null
  git remote add origin $remoteUrl
  git branch -M main
  git push -u origin main
}
