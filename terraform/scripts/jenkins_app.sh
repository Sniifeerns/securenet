#!/bin/bash
set -euxo pipefail

# Log user-data output for troubleshooting
exec > >(tee /var/log/user-data.log | logger -t user-data -s 2>/dev/console) 2>&1

sudo dnf update -y
sudo dnf install -y docker git

sudo systemctl enable --now docker
sudo usermod -aG docker ec2-user

# Install Docker Compose plugin
if ! sudo docker compose version >/dev/null 2>&1; then
  sudo mkdir -p /usr/local/lib/docker/cli-plugins
  sudo curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64" -o /usr/local/lib/docker/cli-plugins/docker-compose
  sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
fi

sudo mkdir -p /opt/jenkins

# 1. Creamos un Dockerfile para instalar Docker dentro de Jenkins
sudo tee /opt/jenkins/Dockerfile > /dev/null <<'EOF'
FROM jenkins/jenkins:lts
USER root
RUN apt-get update && apt-get install -y docker.io awscli
EOF

# 2. Creamos el docker-compose
# 2. MODIFICADO: Quitamos el bloque "build" y usamos "image"
sudo tee /opt/jenkins/docker-compose.yaml > /dev/null <<'EOF'
services:
  jenkins:
    image: custom-jenkins:latest
    container_name: jenkins
    user: root # Necesario para tener permisos sobre el docker.sock
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "curl -fsS http://localhost:8080/login >/dev/null || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 10
      start_period: 120s
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock

volumes:
  jenkins_home:
EOF

cd /opt/jenkins

# 🚨 EL TRUCO: Construimos la imagen primero usando el motor clásico de Docker
sudo docker build -t custom-jenkins:latest .

# Levantamos el servicio (ahora Compose solo lo arranca, no lo construye)
sudo docker compose up -d

# Wait for Jenkins to report healthy state
for _ in $(seq 1 60); do
  health_status="$(sudo docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}no-healthcheck{{end}}' jenkins || true)"
  if [ "$health_status" = "healthy" ]; then
    echo "Jenkins is healthy"
    break
  fi
  sleep 10
done

if [ "${health_status:-}" != "healthy" ]; then
  echo "Jenkins did not become healthy in time" >&2
  sudo docker ps -a
  exit 1
fi

echo "$(date -Is) user_data completed" | sudo tee /opt/jenkins/.user_data_ran > /dev/null