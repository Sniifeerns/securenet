# 🔐 SecureNet Lab

**Proyecto de Innovación - Grupo B**  
**2º ASIR - IES Gregorio Prieto**

> **📘 Repositorio público de portfolio** - Este repo contiene el código fuente limpio del proyecto, sin claves privadas ni credenciales. Para desarrollo, ver [REPO-STRATEGY.md](REPO-STRATEGY.md).

---

## 📌 Descripción del proyecto

**SecureNet Lab** es un proyecto de innovación desarrollado en el ciclo de **Administración de Sistemas Informáticos en Red (ASIR)** del **IES Gregorio Prieto**.

El objetivo ha sido diseñar e implementar una infraestructura de red segura y profesional, simulando un entorno empresarial real con buenas prácticas de:

- Ciberseguridad
- Administración de redes
- Despliegue de servicios
- Monitorización en tiempo real

Se ha construido un laboratorio funcional con segmentación por VLAN, DMZ protegida, ACLs, publicación web, VPN y observabilidad.

---

## 🎯 Objetivos del proyecto

- Diseñar una arquitectura de red segmentada por VLAN.
- Implementar una **DMZ aislada** para servicios expuestos.
- Configurar enrutamiento inter-VLAN.
- Aplicar **ACLs de seguridad** entre zonas.
- Implementar NAT y Port Forwarding.
- Publicar un sitio web con HTTPS.
- Configurar acceso remoto seguro por VPN (Tailscale).
- Implementar **DHCP con failover**.
- Desplegar servicios de automatización con **n8n**.
- Integrar monitorización en tiempo real con **Netdata + API propia**.
- Containerizar y automatizar despliegues (**Docker + CI/CD**).

---

## 🏗 Arquitectura de red

| Segmento | Red | Descripción |
|---|---|---|
| VLAN 10 | 172.16.10.0/24 | Soporte |
| VLAN 20 | 172.16.20.0/24 | Administración |
| VLAN 30 | 172.16.30.0/24 | Ventas |
| DMZ (VLAN 40) | 172.16.40.0/24 | Servidores expuestos |
| Red de tránsito | 10.10.0.0/30 | Comunicación entre routers |

### 🔒 Política de seguridad

- La **DMZ no puede acceder a las VLAN internas**.
- Las VLAN internas sí pueden acceder a servicios concretos en DMZ.
- Internet no puede acceder directamente a la red interna.
- Exposición pública solo mediante reglas explícitas (Port Forwarding).
- HTTPS en servicios web.
- Acceso remoto administrativo por VPN privada.

---

## 🛡️ Seguridad adicional (Reverse Proxy + CI/CD)

Además de la segmentación y ACLs, se reforzó la seguridad a nivel de publicación y despliegue.

### Reverse Proxy como punto único de entrada

- La infraestructura publica servicios únicamente a través de un **Gateway (Reverse Proxy)**.
- Se centraliza el control de:
  - **TLS/HTTPS**
  - **Redirección HTTP -> HTTPS**
  - **Rutas publicadas** (`/`, `/api/*`)
  - **Cabeceras de proxy** (`X-Forwarded-For`, `X-Forwarded-Proto`)
- Esto evita exponer servicios internos directamente y reduce superficie de ataque.

### CI/CD (automatización segura)

- Los despliegues se automatizan con **GitHub Actions**.
- Se reduce el riesgo de errores manuales.
- Se asegura trazabilidad: cada despliegue queda ligado a commit y run de Actions.
- En DMZ/VPN se utiliza un **runner self-hosted** para no abrir SSH al exterior.

---

## 🛠 Herramientas y tecnologías utilizadas

### Infraestructura de red

- Cisco 1900
- Cisco RV340
- Cisco 2960 / 3560
- VLANs 802.1Q
- ACLs
- NAT
- Port Forwarding

### Servidores y servicios

- Ubuntu Server
- Apache2 *(fase inicial; reemplazado por Gateway Nginx en Docker para publicación)*
- DHCP (ISC DHCP Server con Failover)
- n8n (automatización)
- Netdata (monitorización)
- Node.js + Express (API de métricas)
- SSH seguro
- Docker + Docker Compose

### Desarrollo web

- React + Vite
- TailwindCSS
- Framer Motion
- Build estática para producción (`dist`)

### Seguridad y acceso remoto

- Segmentación por VLAN
- DMZ aislada
- ACLs personalizadas
- VPN con Tailscale
- Restricción de acceso desde WAN

---

## 🌐 Servicios implementados

- Web principal del proyecto (SecureNet Lab)
- Página 404 personalizada
- Dashboard con métricas en vivo
- API `/api/metrics` y `/api/health`
- n8n en servidor
- DHCP redundante
- Acceso remoto VPN

---

## 📊 Monitorización

Arquitectura de monitorización:

**Frontend React** -> `https://<host>/api/metrics` -> **Gateway Nginx (reverse proxy)** -> **Metrics API (Node/Express)** -> **Netdata (host)**

### Endpoints

- `GET /api/health`
- `GET /api/metrics`

### Métricas mostradas

- CPU (%)
- RAM (%)
- Tráfico de red (entrada/salida)
- Timestamp de actualización

> Se ajustó el cálculo de CPU para entornos Netdata que no exponen `idle`, sumando estados como `user/system/nice/...`.

---

## 🐳 Despliegue Docker + HTTPS + CI/CD

El despliegue evolucionó a un modelo containerizado con Docker Compose, usando **Gateway Nginx** como entrada única para HTTPS y redirección HTTP -> HTTPS.

### Servicios en Docker Compose

- **gateway** (Nginx): entrada única del sistema (`80/443`), redirección y reverse proxy.
- **frontend**: React build servido por Nginx en contenedor.
- **api**: Node.js + Express (`/api/health`, `/api/metrics`).
- **netdata**: en producción se mantiene en host para métricas reales del servidor.

### HTTPS y redirección 80 -> 443

- `http://<host>` -> `301` a `https://<host>`
- `https://<host>` -> frontend
- `https://<host>/api/*` -> API de métricas

> En servidor se usa certificado autofirmado (el navegador mostrará aviso de confianza).

### Imágenes en GHCR (producción)

- `ghcr.io/<owner>/securenet-frontend:latest`
- `ghcr.io/<owner>/securenet-api:latest`

> GHCR requiere `owner` en minúsculas. El workflow lo fuerza con `IMAGE_OWNER=${GITHUB_REPOSITORY_OWNER,,}`.

### CI/CD con GitHub Actions + runner self-hosted

El servidor está en red privada/VPN, por lo que el runner cloud no llega directamente. Se usa runner self-hosted dentro del entorno.

Flujo:

1. Build + Push de imágenes a GHCR (runner cloud).
2. Deploy en servidor (runner self-hosted):
   - `docker compose pull`
   - `docker compose up -d`

### Verificación rápida

```bash
# Ver contenedores

docker compose ps

# Comprobar HTTPS y endpoints
curl -k https://<host>/api/health
curl -k https://<host>/api/metrics

# Comprobar redirección HTTP -> HTTPS
curl -I http://<host>
```

### Incidencias reales resueltas (Docker/CI)

- Nginx frontend: `http directive is not allowed here` por `http {}` en `default.conf`.
- Proxy `/api`: rutas rotas por `proxy_pass` con `/` final (se ajustó para conservar `/api/...`).
- GHCR: fallo por namespace en mayúsculas.
- Runner self-hosted: `permission denied` en `/var/run/docker.sock`.
- Migración final: retirada de Apache para evitar conflicto con puertos `80/443`.

### Capturas recomendadas

- Run en verde de GitHub Actions (build/push + deploy).
- `docker compose ps` con `gateway`, `frontend`, `api` en `Up`.
- `curl -I http://<host>` mostrando `301 Location: https://...`.
- `curl -k https://<host>/api/metrics` devolviendo JSON.

---

## 🚀 Despliegue del frontend (fase inicial)

### Local

```bash
npm install
npm run dev
```

### Build de producción

```bash
npm run build
```

### Publicación en servidor

```bash
cp -r dist/* /var/www/...
```

### VirtualHost SSL (Apache)

Configurar el VirtualHost HTTPS apuntando a `/var/www/...`.

### ProxyPass de `/api` a Node local

```apache
ProxyPass /api http://127.0.0.1:3001/api
ProxyPassReverse /api http://127.0.0.1:3001/api
```

### Recargar Apache

```bash
sudo systemctl reload apache2
```

---

## ⚙️ Variables de entorno

### Desarrollo (`.env`)

```bash
VITE_METRICS_API=http://127.0.0.1:3001/api
```

### Producción (`.env.production`)

```bash
VITE_METRICS_API=/api
```

> En producción no usar `127.0.0.1` desde el frontend del cliente; debe resolverse por proxy en `/api`.

---

## 🧪 Verificaciones útiles

### Backend de métricas

```bash
curl -s http://127.0.0.1:3001/api/health
curl -s http://127.0.0.1:3001/api/metrics
```

### Proxy HTTPS

```bash
curl -k https://127.0.0.1/api/health
curl -k https://127.0.0.1/api/metrics
```

### Diagnóstico de frontend

- Revisar `DevTools > Network`.
- Confirmar request a `/api/metrics`.
- Evitar errores tipo `/api/api/metrics`.
- Hard refresh (`Ctrl + Shift + R`) tras cada despliegue.

---

## 🧯 Incidencias reales resueltas

- `Failed to fetch` por ruta incorrecta o build antiguo en caché.
- `Unexpected token '<'` al recibir HTML (404) en lugar de JSON.
- `Mismatching encryption keys` en n8n por clave distinta en volumen/config.
- Errores de permisos al subir build por SCP.
- Cálculo de CPU fijo (0 o 100) por parseo incorrecto de labels Netdata.

---

## 🏫 Contexto académico

Proyecto desarrollado durante el curso **2025-2026** en:

**IES Gregorio Prieto**  
Ciclo Formativo de Grado Superior  
Administración de Sistemas Informáticos en Red (2º ASIR)

---

## 👥 Integrantes (Grupo B)

- **Tania Morales**  
  https://www.linkedin.com/in/tania-morales-sánchez-348615164
- **Javier Naranjo**  
  https://www.linkedin.com/in/javier-naranjo-simarro-67325a356
- **Adrián Delgado**  
  https://www.linkedin.com/in/adrian-delgado-campos-b025333ab
- **Martín Labrador**  
  https://www.instagram.com/_martinlabrador_

---

## 🚀 Impacto del proyecto

SecureNet Lab representa una simulación realista de infraestructura empresarial y demuestra capacidad para diseñar, implementar y asegurar entornos de red complejos en un contexto académico-profesional.

Áreas aplicadas:

- Networking
- Seguridad
- Sistemas Linux
- Automatización
- Despliegue web
- Observabilidad

Noticia publicada:  
https://somosdelprieto.com/index.php/2025/11/27/trabajando-en-el-proyecto-securenet-lab/

---

## ✅ Estado actual

- Infraestructura segmentada operativa.
- DMZ aislada con políticas de acceso.
- Web desplegada con HTTPS.
- Monitorización en tiempo real funcional.
- Acceso remoto por VPN.
- Servicios de automatización desplegados.
- DHCP con failover en laboratorio.
- Despliegue Docker con reverse proxy y CI/CD.

---

## 📢 Proyecto de innovación

SecureNet Lab integra de forma práctica conocimientos de redes, seguridad, sistemas y despliegue moderno en un entorno académico con enfoque profesional.

**SecureNet Lab - Grupo B - Proyecto de Innovación 2026**

---

## 🔧 Configuración para desarrollo local

Este repositorio **no contiene** claves privadas, certificados ni credenciales. Para trabajar localmente:

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Edita .env con tus valores
```

### 3. Generar certificados SSL para desarrollo
```bash
bash scripts/generate-certs.sh
```

### 4. Configurar Terraform (opcional)
```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edita terraform.tfvars con tus IDs de cloud
```

### 5. Instalar protección pre-commit
```bash
cp scripts/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

📖 **Más información**: Ver [SECURITY.md](SECURITY.md) y [REPO-STRATEGY.md](REPO-STRATEGY.md)

---

## 📚 Documentación adicional

- [SECURITY.md](SECURITY.md) - Configuración de seguridad y archivos sensibles
- [REPO-STRATEGY.md](REPO-STRATEGY.md) - Estrategia de repositorios (público + privado)

---

## ⚠️ Nota de seguridad

Este repo es **público** y contiene solo código fuente limpio. NO contiene:
- Claves privadas (`.pem`, `.key`)
- Certificados SSL reales
- Variables de entorno con credenciales (`.env`)
- Configuraciones de infraestructura con IDs reales (`terraform.tfvars`)
- Estado de Terraform (`*.tfstate`)

Para deploy o desarrollo, configura estos archivos localmente usando las plantillas `.example`.
