#!/bin/bash
set -euxo pipefail

# 1. Guardar un log de todo lo que ocurre para poder depurar si algo falla
exec > >(tee /var/log/user-data.log | logger -t user-data -s) 2>&1

AWS_REGION="${aws_region}"
NEW_RELIC_SECRET_ID="${new_relic_secret_id}"

echo "Iniciando configuración de la máquina App (Docker)..."

# 2. Actualizar el sistema e instalar dependencias clave
dnf update -y
dnf install -y docker git curl jq awscli --allowerasing

# 3. Instalar New Relic Infrastructure Agent en el host
curl -fsSL -o /etc/yum.repos.d/newrelic-infra.repo \
  https://download.newrelic.com/infrastructure_agent/linux/yum/amazonlinux/2023/x86_64/newrelic-infra.repo
dnf install -y newrelic-infra

# 4. Iniciar Docker y asegurar que se levanta si la máquina se reinicia
systemctl enable --now docker

# 5. Dar permisos de Docker al usuario por defecto (ec2-user)
usermod -aG docker ec2-user

# 6. Instalar Docker Compose (modo plugin)
DOCKER_CONFIG=$${DOCKER_CONFIG:-/usr/local/lib/docker}
mkdir -p "$DOCKER_CONFIG/cli-plugins"
curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64" \
  -o "$DOCKER_CONFIG/cli-plugins/docker-compose"
chmod +x "$DOCKER_CONFIG/cli-plugins/docker-compose"

# 7. Crear la carpeta donde vivirá tu aplicación y darle permisos al ec2-user
mkdir -p /opt/app
chown -R ec2-user:ec2-user /opt/app

# 8. Script para sincronizar secretos desde AWS Secrets Manager al host
cat > /usr/local/bin/securenet-sync-newrelic.sh <<EOF
#!/bin/bash
set -euo pipefail

AWS_REGION="$AWS_REGION"
SECRET_ID="$NEW_RELIC_SECRET_ID"

SECRET_STRING=\$(aws secretsmanager get-secret-value \
  --region "\$AWS_REGION" \
  --secret-id "\$SECRET_ID" \
  --query SecretString \
  --output text)

if [ -z "\$SECRET_STRING" ] || [ "\$SECRET_STRING" = "None" ]; then
  echo "El secreto \$SECRET_ID no tiene contenido (SecretString vacío)." >&2
  exit 1
fi

NR_LICENSE_KEY=\$(echo "\$SECRET_STRING" | jq -r '.NEW_RELIC_LICENSE_KEY // empty')
NR_ACCOUNT_ID=\$(echo "\$SECRET_STRING" | jq -r '.NEW_RELIC_ACCOUNT_ID // empty')
NR_API_KEY=\$(echo "\$SECRET_STRING" | jq -r '.NEW_RELIC_API_KEY // empty')
NR_REGION=\$(echo "\$SECRET_STRING" | jq -r '.NEW_RELIC_REGION // "eu"')
NR_LOOKBACK=\$(echo "\$SECRET_STRING" | jq -r '.METRICS_LOOKBACK_MINUTES // "5"')

if [ -z "\$NR_LICENSE_KEY" ] || [ -z "\$NR_ACCOUNT_ID" ] || [ -z "\$NR_API_KEY" ]; then
  echo "Faltan claves requeridas en el secreto \$SECRET_ID." >&2
  exit 1
fi

# Configuración del agente New Relic en el host (sin contenedor)
cat > /etc/newrelic-infra.yml <<CFG
license_key: \$NR_LICENSE_KEY
display_name: securenet-host
enable_process_metrics: true
CFG
chmod 600 /etc/newrelic-infra.yml
chown root:root /etc/newrelic-infra.yml

# Variables para la app/API en la máquina destino
cat > /opt/app/.env <<ENV
NODE_ENV=production
VITE_METRICS_API=/api
NEW_RELIC_LICENSE_KEY=\$NR_LICENSE_KEY
NEW_RELIC_ACCOUNT_ID=\$NR_ACCOUNT_ID
NEW_RELIC_API_KEY=\$NR_API_KEY
NEW_RELIC_REGION=\$NR_REGION
METRICS_LOOKBACK_MINUTES=\$NR_LOOKBACK
ENV
chmod 600 /opt/app/.env
chown ec2-user:ec2-user /opt/app/.env

systemctl enable --now newrelic-infra
systemctl restart newrelic-infra
systemctl --no-pager --full status newrelic-infra || true

echo "New Relic sincronizado desde Secrets Manager."
EOF

chmod 750 /usr/local/bin/securenet-sync-newrelic.sh

# Intentar sincronizar durante bootstrap (si el secreto no existe aún, continuamos)
if ! /usr/local/bin/securenet-sync-newrelic.sh; then
  echo "Advertencia: no se pudo sincronizar New Relic durante user_data. Reintenta en deploy." >&2
fi

# 9. Marcador de finalización
echo "$(date -Is) user_data completed" > /opt/app/.user_data_ran

echo "Instalación base completada con éxito."
