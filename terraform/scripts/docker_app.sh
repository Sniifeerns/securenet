#!/bin/bash
set -euxo pipefail

# 1. Guardar un log de todo lo que ocurre para poder depurar si algo falla
exec > >(tee /var/log/user-data.log | logger -t user-data -s) 2>&1

echo "Iniciando configuración de la máquina App (Docker)..."

# 2. Actualizar el sistema e instalar dependencias clave
dnf update -y
dnf install -y docker git curl

# 3. Iniciar Docker y asegurar que se levanta si la máquina se reinicia
systemctl enable --now docker

# 4. Dar permisos de Docker al usuario por defecto (ec2-user)
usermod -aG docker ec2-user

# 5. Instalar Docker Compose (modo plugin)
DOCKER_CONFIG=${DOCKER_CONFIG:-/usr/local/lib/docker}
mkdir -p $DOCKER_CONFIG/cli-plugins
curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64" \
  -o $DOCKER_CONFIG/cli-plugins/docker-compose
chmod +x $DOCKER_CONFIG/cli-plugins/docker-compose

# 6. Crear la carpeta donde vivirá tu aplicación y darle permisos al ec2-user
mkdir -p /opt/app
chown -R ec2-user:ec2-user /opt/app

# 7. Marcador de finalización
echo "$(date -Is) user_data completed" > /opt/app/.user_data_ran

echo "Instalación base completada con éxito."