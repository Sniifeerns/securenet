FROM nginx:alpine

# Instalar OpenSSL para generar certificados
RUN apk add --no-cache openssl

# Copiar configuración personalizada de nginx
COPY docker/gateway/nginx.conf /etc/nginx/nginx.conf

# Crear directorio para certificados y generar certificados autofirmados
RUN mkdir -p /etc/nginx/certs && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/certs/local.key \
    -out /etc/nginx/certs/local.crt \
    -subj "/C=ES/ST=Madrid/L=Madrid/O=SecureNet/OU=Dev/CN=localhost"

# Exponer puertos
EXPOSE 80 443

# El comando por defecto de nginx:alpine ya está configurado
