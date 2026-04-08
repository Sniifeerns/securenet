FROM nginx:alpine

# Copiar configuración personalizada de nginx
COPY docker/gateway/nginx.conf /etc/nginx/nginx.conf

# Copiar certificados SSL
COPY docker/gateway/certs /etc/nginx/certs

# Exponer puertos
EXPOSE 80 443

# El comando por defecto de nginx:alpine ya está configurado
