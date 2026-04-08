#!/bin/bash
set -euxo pipefail

# Log user-data output for troubleshooting

exec > >(tee /var/log/user-data.log | logger -t user-data -s 2>/dev/console) 2>&1

sudo dnf update -y
sudo dnf install -y docker git 

sudo systemctl enable --now docker
sudo usermod -aG docker ec2-user


# Optional quick check
sudo docker --version
sudo git --version

# Install Docker Compose plugin if it is not available in the AMI repositories.
if ! sudo docker compose version >/dev/null 2>&1; then
  sudo mkdir -p /usr/local/lib/docker/cli-plugins
  sudo curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64" -o /usr/local/lib/docker/cli-plugins/docker-compose
  sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
fi

sudo docker compose version

sudo mkdir -p /opt/jenkins

sudo tee /opt/jenkins/docker-compose.yaml > /dev/null <<'EOF'
services:
  jenkins:
    image: jenkins/jenkins:lts
    container_name: jenkins
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

volumes:
  jenkins_home:
EOF

sudo docker compose -f /opt/jenkins/docker-compose.yaml up -d

# Wait for Jenkins to report healthy state (up to 10 minutes).
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

