#!/bin/bash
# Actualizar el sistema
apt-get update -y
apt-get upgrade -y

# Instalar Docker
apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
add-apt-repository "deb [arch=arm64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io

# Dar permisos al usuario ubuntu para usar Docker sin sudo
usermod -aG docker ubuntu

# Reiniciar el servicio de Docker por si acaso
systemctl enable docker
systemctl restart docker

# Script to install git on the compute instance
# Actualizar el sistemas
apt-get update -y
apt-get upgrade -y

# Instalar git
apt-get install -y git

sudo -u ubuntu git config --global user.name "Sniifeerns"
sudo -u ubuntu git config --global user.email "javiernsxs@gmail.com"

