# =====================================================================
# SCRIPT DE DEPLOY AUTOMATIZADO COM DOCKER - MR MATERIAL DE CONSTRUÇÃO
# =====================================================================
# Empacota a API REST comercial, transfere para a VPS via SCP e orquestra
# os containers Docker (API Node.js + Banco PostgreSQL isolado).
# Roteamento Nginx:
#   - Documentação Swagger: https://winnicius.com/tecinfo/labs/api-mr-construcao/docs
#   - Servidor API (Root):  https://winnicius.com/tecinfo/labs/api-mr-construcao/server

# --- Variáveis de Configuração ---
$remoteHost   = "187.77.46.68"
$remoteUser   = "root"
$remotePath   = "/var/www/api-mr-construcao"
$sshKeyPath   = "C:\Users\wnn-dev\.ssh\id_ed25519"
$archiveName  = "api-mr-construcao-deploy.tar.gz"

# --- Função de Verificação de Erros ---
function Check-LastCommand {
    param ($errorMessage)
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERRO] $errorMessage" -ForegroundColor Red
        if (Test-Path $archiveName) { Remove-Item $archiveName -Force }
        exit $LASTEXITCODE
    }
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   Iniciando Deploy Seguro: MR - Material de Construção   " -ForegroundColor Cyan
Write-Host "      winnicius.com/tecinfo/labs/api-mr-construcao/docs   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Verificar chave SSH local
if (-not (Test-Path $sshKeyPath)) {
    Write-Host "[ERRO] Chave SSH nao encontrada no caminho: $sshKeyPath" -ForegroundColor Red
    exit 1
}

# 2. Empacotar código-fonte limpo
Write-Host "`n[1/7] Empacotando codigo-fonte (excluindo dependencias e arquivos temporarios)..." -ForegroundColor Green
tar -czf $archiveName `
    --exclude="node_modules" `
    --exclude="dist" `
    --exclude=".git" `
    --exclude="*.tar" `
    --exclude="*.tar.gz" `
    --exclude="*.log" `
    --exclude="deploy.ps1" `
    --exclude=$archiveName `
    *
Check-LastCommand "Falha ao empacotar os arquivos do projeto."

$archiveSize = (Get-Item $archiveName).Length / 1MB
Write-Host ("-> Pacote gerado com sucesso! Tamanho: {0:N2} MB" -f $archiveSize) -ForegroundColor Gray

# 3. Garantir diretório na VPS
Write-Host "`n[2/7] Verificando diretorio de destino na VPS..." -ForegroundColor Green
ssh -i $sshKeyPath -o StrictHostKeyChecking=accept-new "$remoteUser@$remoteHost" "mkdir -p $remotePath"
Check-LastCommand "Nao foi possivel conectar ou criar a pasta na VPS via SSH."

# 4. Enviar pacote via SCP
Write-Host "`n[3/7] Enviando pacote para a VPS via SCP..." -ForegroundColor Green
scp -i $sshKeyPath $archiveName "$($remoteUser)@$($remoteHost):/root/"
Check-LastCommand "Falha no envio do pacote via SCP."

# 5. Extrair na pasta final da VPS
Write-Host "`n[4/7] Extraindo arquivos do projeto na VPS..." -ForegroundColor Green
ssh -i $sshKeyPath "$remoteUser@$remoteHost" "tar -xzf /root/$archiveName -C $remotePath && rm /root/$archiveName"
Check-LastCommand "Falha ao extrair os arquivos na VPS."

# 6. Build e Inicialização dos Containers via Docker Compose
Write-Host "`n[5/7] Executando build e subindo containers Docker (Porta 3004:3000)..." -ForegroundColor Green
ssh -i $sshKeyPath "$remoteUser@$remoteHost" "cd $remotePath && docker compose up -d --build"
Check-LastCommand "Erro ao subir os containers via Docker Compose na VPS."

# 7. Configuração e Recarga do Nginx
Write-Host "`n[6/7] Verificando e atualizando configuracao do Nginx na VPS..." -ForegroundColor Green
ssh -i $sshKeyPath "$remoteUser@$remoteHost" "grep -q 'location /tecinfo/labs/api-mr-construcao' /etc/nginx/sites-available/default"

if ($LASTEXITCODE -ne 0) {
    Write-Host "-> Injetando rota /tecinfo/labs/api-mr-construcao no Nginx..." -ForegroundColor Yellow
    @'
conf_path = '/etc/nginx/sites-available/default'
with open(conf_path, 'r') as f:
    content = f.read()

target = '    listen [::]:443 ssl ipv6only=on;'
block = """    # =================================================================
    # 📌 ROTA 8: API MR - MATERIAL DE CONSTRUÇÃO (Porta 3004)
    # Docs: winnicius.com/tecinfo/labs/api-mr-construcao/docs
    # Serv: winnicius.com/tecinfo/labs/api-mr-construcao/server
    # =================================================================
    location /tecinfo/labs/api-mr-construcao {
        proxy_pass http://127.0.0.1:3004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

"""

if 'location /tecinfo/labs/api-mr-construcao' not in content:
    new_content = content.replace(target, block + target)
    with open(conf_path, 'w') as f:
        f.write(new_content)
'@ | ssh -i $sshKeyPath "$remoteUser@$remoteHost" "python3 -"
} else {
    Write-Host "-> Rota /tecinfo/labs/api-mr-construcao ja existente no Nginx." -ForegroundColor Gray
}

ssh -i $sshKeyPath "$remoteUser@$remoteHost" "nginx -t && systemctl reload nginx"
Check-LastCommand "Falha ao recarregar o Nginx na VPS."

# 8. Limpeza local
Write-Host "`n[7/7] Limpando arquivos temporarios locais..." -ForegroundColor Green
if (Test-Path $archiveName) {
    Remove-Item $archiveName -Force
}

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host " Deploy concluido com 100% de sucesso na VPS!           " -ForegroundColor Green
Write-Host " 📖 Swagger Docs:  https://winnicius.com/tecinfo/labs/api-mr-construcao/docs" -ForegroundColor Green
Write-Host " 🚀 Servidor API:  https://winnicius.com/tecinfo/labs/api-mr-construcao/server" -ForegroundColor Green
Write-Host " 🩺 Healthcheck:   https://winnicius.com/tecinfo/labs/api-mr-construcao/server/api/health" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
