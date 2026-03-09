#!/bin/bash
# ========================
# Genera certificados SSL autofirmados para desarrollo local
# ========================
# Uso: ./scripts/generate-certs.sh

set -e

CERTS_DIR="docker/gateway/certs"

mkdir -p "$CERTS_DIR"

if [ -f "$CERTS_DIR/local.key" ] && [ -f "$CERTS_DIR/local.crt" ]; then
    echo "Los certificados ya existen en $CERTS_DIR"
    echo "Elimínalos manualmente si quieres regenerarlos."
    exit 0
fi

echo "Generando certificados SSL autofirmados..."

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "$CERTS_DIR/local.key" \
    -out "$CERTS_DIR/local.crt" \
    -subj "/C=ES/ST=Madrid/L=Madrid/O=SecureNet/OU=Dev/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"

echo "Certificados generados en $CERTS_DIR/"
echo "  - local.key (clave privada)"
echo "  - local.crt (certificado)"
