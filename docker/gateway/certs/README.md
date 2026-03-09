# Certificados TLS para el Gateway Nginx

Este directorio contiene los certificados TLS utilizados por el gateway Nginx.
**Los archivos de certificado y clave privada no se incluyen en el repositorio** por seguridad.

## Generación de certificado autofirmado (desarrollo local)

Ejecuta el siguiente comando desde la raíz del proyecto para generar `local.crt` y `local.key`:

```bash
openssl req -x509 -nodes -newkey rsa:2048 -days 365 \
  -keyout docker/gateway/certs/local.key \
  -out docker/gateway/certs/local.crt \
  -subj "/CN=localhost"
```

> ⚠️ El certificado autofirmado hará que el navegador muestre un aviso de seguridad. Esto es esperado en entornos de desarrollo y laboratorio.

## Producción

En producción se recomienda usar certificados firmados por una CA de confianza (por ejemplo, Let's Encrypt con Certbot).
