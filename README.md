# 🔐 SecureNet Lab
## Proyecto de Innovación – Grupo B
### 2º ASIR · IES Gregorio Prieto

---

## 📌 Descripción del Proyecto

**SecureNet Lab** es un proyecto de innovación desarrollado en el ciclo formativo de **Administración de Sistemas Informáticos en Red (ASIR)** en el **IES Gregorio Prieto**.

El objetivo ha sido diseñar e implementar un entorno de red seguro y profesional que simule una infraestructura real de empresa, aplicando buenas prácticas de:

- ciberseguridad
- administración de redes
- despliegue de servicios
- monitorización en tiempo real

Se ha construido un laboratorio funcional con segmentación por VLAN, DMZ protegida, ACLs, publicación web, VPN y observabilidad.

---

## 🎯 Objetivos del Proyecto

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
- **Containerizar y automatizar despliegues (Docker + CI/CD)**.

---

## 🏗 Arquitectura de Red

| Segmento | Red | Descripción |
|----------|------|-------------|
| VLAN 10 | 172.16.10.0/24 | Soporte |
| VLAN 20 | 172.16.20.0/24 | Administración |
| VLAN 30 | 172.16.30.0/24 | Ventas |
| DMZ (VLAN 40) | 172.16.40.0/24 | Servidores expuestos |
| Red de tránsito | 10.10.0.0/30 | Comunicación entre routers |

### 🔒 Política de Seguridad

- La **DMZ no puede acceder a las VLAN internas**.
- Las VLAN internas sí pueden acceder a servicios concretos en DMZ.
- Internet no puede acceder directamente a la red interna.
- Exposición pública solo mediante reglas explícitas (Port Forwarding).
- HTTPS en servicios web.
- Acceso remoto administrativo por VPN privada.

---

## 🛡️ Seguridad adicional (Reverse Proxy + CI/CD)

Además de la segmentación y ACLs, se reforzó la seguridad a nivel de publicación y despliegue:

### Reverse Proxy como punto único de entrada
- La infraestructura publica servicios únicamente a través de un **Gateway (Reverse Proxy)**.
- Se centraliza el control de:
  - **TLS/HTTPS**
  - **Redirección HTTP → HTTPS**
  - **Rutas publicadas** (`/`, `/api/*`)
  - **Cabeceras de proxy** (Forwarded-For / Proto)
- Esto evita exponer servicios internos directamente y reduce superficie de ataque.

### CI/CD (automatización segura)
- Los despliegues se automatizan con **GitHub Actions**.
- Se reduce el riesgo de errores manuales (subidas de `dist`, permisos, configuraciones inconsistentes).
- Se asegura trazabilidad: cada despliegue está asociado a un commit y un run en Actions.
- En DMZ/VPN se utiliza un **runner self-hosted** para no abrir SSH al exterior.

---

## 🛠 Herramientas y Tecnologías Utilizadas

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
- Build estática para producción (dist)

### Seguridad y acceso remoto
- Segmentación por VLAN
- DMZ aislada
- ACLs personalizadas
- VPN con Tailscale
- Restricción de acceso desde WAN

---

## 🌐 Servicios Implementados

- Web principal del proyecto (SecureNet Lab)
- Página 404 personalizada
- Dashboard con métricas en vivo
- API `/api/metrics` y `/api/health`
- n8n en servidor
- DHCP redundante
- Acceso remoto VPN

---

## 📊 Monitorización (nuevo)

Se implementó monitorización en tiempo real con esta arquitectura:

**Frontend React** → `https://<host>/api/metrics` → **Reverse Proxy (Gateway Nginx)** → **Metrics API** → **Netdata (host)**

### Endpoints
- `GET /api/health`
- `GET /api/metrics`

### Métricas mostradas
- CPU (%)
- RAM (%)
- Tráfico de red (entrada/salida)
- timestamp de actualización

> Se corrigió el cálculo de CPU para entornos Netdata que no exponen `idle`, sumando estados `user/system/nice/...` para evitar valores fijos incorrectos.

---

## 🐳 Despliegue Docker + HTTPS (Gateway) + CI/CD (nuevo)

A partir de esta fase, el despliegue evolucionó a un modelo **containerizado** con **Docker Compose**, centralizando la publicación en un **Gateway Nginx** que gestiona **HTTPS** y la redirección **HTTP → HTTPS**. Además, se integró un flujo **CI/CD** con GitHub Actions para automatizar despliegues.

### 🧱 Servicios (Docker Compose)
- **gateway** (Nginx): entrada única al sistema (**80/443**), redirección 80→443, reverse proxy.
- **frontend**: web React (build) servida por Nginx dentro del contenedor.
- **api**: Node.js + Express (`/api/health`, `/api/metrics`) containerizado.
- **netdata**: en producción se mantiene **en el host** (sin Docker) para medir métricas reales del servidor.

### 🔐 HTTPS y redirección 80 → 443
El gateway expone:
- `http://<host>` → **301** a `https://<host>`
- `https://<host>` → frontend
- `https://<host>/api/*` → API de métricas

> En el servidor se usa certificado **autofirmado** (el navegador mostrará aviso de confianza).

### 📦 Producción: imágenes desde GHCR (GitHub Container Registry)
En producción, el servidor **no compila** el proyecto: consume imágenes publicadas en GHCR:

- `ghcr.io/<owner>/securenet-frontend:latest`
- `ghcr.io/<owner>/securenet-api:latest`

> Nota: GHCR requiere el owner en **minúsculas**, por eso el workflow fuerza `IMAGE_OWNER=${GITHUB_REPOSITORY_OWNER,,}`.

### 🔁 CI/CD con GitHub Actions + Runner self-hosted (DMZ/VPN)
Como el servidor está accesible por VPN (Tailscale), GitHub Actions (runner cloud) **no puede** acceder directamente a la IP privada `100.115.248.23`.  
Solución: se configuró un **runner self-hosted** dentro del servidor/DMZ.

Pipeline:
1) **Build + Push** de imágenes Docker a GHCR (runner cloud).
2) **Deploy** automático en el servidor (runner self-hosted):
   - `docker compose pull`
   - `docker compose up -d`

### 🧪 Verificación rápida (Docker)

```bash
# Ver contenedores
docker compose ps

# Comprobar HTTPS y endpoints
curl -k https://<host>/api/health
curl -k https://<host>/api/metrics

# Comprobar redirección HTTP→HTTPS
curl -I http://<host>
```

### 🧯 Incidencias reales resueltas (Docker/CI)

- **Nginx frontend**: `http directive is not allowed here` por incluir `http {}` en `default.conf`.  
  ✅ Solución: dejar solo el bloque `server {}` en la configuración del sitio.
- **Proxy `/api`**: rutas rotas por `proxy_pass` con `/` final.  
  ✅ Solución: ajustar `proxy_pass` para conservar `/api/...` correctamente.
- **GHCR**: fallo por *namespace* en mayúsculas.  
  ✅ Solución: forzar el `owner` en minúsculas (`${GITHUB_REPOSITORY_OWNER,,}`).
- **Runner self-hosted**: `permission denied` en `/var/run/docker.sock`.  
  ✅ Solución: añadir el usuario del runner al grupo `docker` y reiniciar sesión/servicio.
- **Migración final**: conflicto de puertos 80/443 entre Apache y Gateway.  
  ✅ Solución: retirar Apache y dejar solo el Gateway Nginx escuchando en 80/443.

### 📸 Dónde poner capturas (opcional pero recomendado)

- **GitHub Actions** con el *run* en verde (build/push + deploy self-hosted).
- `docker compose ps` mostrando `gateway`, `frontend`, `api` en estado **Up**.
- `curl -I http://<host>` mostrando `301 Location: https://...`.
- `curl -k https://<host>/api/metrics` devolviendo JSON válido.

### 🚀 Despliegue del frontend (fase inicial, sin Docker)

1. **Local**
   - `npm install`
   - `npm run dev`
2. **Build producción**
   - `npm run build`
3. **Publicación en servidor**
   - `cp -r dist/* /var/www/...`
4. **Configurar VirtualHost SSL (Apache)**
   - VirtualHost HTTPS apuntando a `/var/www/...`
   - Configurar `ProxyPass` de `/api` al servidor Node local.

Ejemplo de configuración de proxy en Apache:

```apache
ProxyPass /api http://127.0.0.1:3001/api
ProxyPassReverse /api http://127.0.0.1:3001/api
```

Recargar Apache:

```bash
sudo systemctl reload apache2
```

### ⚙️ Variables de entorno

- **Desarrollo** (`.env`):

  ```env
  VITE_METRICS_API=http://127.0.0.1:3001/api
  ```

- **Producción** (`.env.production`):

  ```env
  VITE_METRICS_API=/api
  ```

> Importante: en producción no usar `127.0.0.1` desde el navegador del cliente; el acceso debe hacerse siempre a través del proxy `/api` del servidor.

### 🧪 Verificaciones útiles

- **Backend de métricas (directo al Node local)**:

  ```bash
  curl -s http://127.0.0.1:3001/api/health
  curl -s http://127.0.0.1:3001/api/metrics
  ```

- **Proxy HTTPS (Gateway / Apache)**:

  ```bash
  curl -k https://127.0.0.1/api/health
  curl -k https://127.0.0.1/api/metrics
  ```

- **Diagnóstico frontend**:
  - Abrir **DevTools > Network**.
  - Confirmar que hay petición a `/api/metrics`.
  - Evitar errores tipo `/api/api/metrics` en la URL.
  - Hacer *hard refresh* (`Ctrl + Shift + R`) tras cada despliegue.

### 🧯 Incidencias reales resueltas (general)

- `Failed to fetch` por ruta incorrecta o *build* antiguo en caché.
- `Unexpected token '<'` al recibir HTML (404) en vez de JSON en `/api/metrics`.
- `Mismatching encryption keys` en **n8n** por clave distinta en volumen/config.
- Errores de permisos al subir *build* por SCP.
- Cálculo de CPU fijo (0 o 100) por parseo incorrecto de labels Netdata.

## 🏫 Contexto Académico

Proyecto desarrollado durante el curso **2025–2026** en:

- 🎓 **IES Gregorio Prieto**
- Ciclo Formativo de Grado Superior: **Administración de Sistemas Informáticos en Red (2º ASIR)**

Este proyecto forma parte del enfoque de innovación tecnológica aplicado a entornos reales de infraestructura y seguridad.

## 👥 Integrantes – Grupo B

- **Tania Morales**  
  [LinkedIn](https://www.linkedin.com/in/tania-morales-sánchez-348615164)
- **Javier Naranjo**  
  [LinkedIn](https://www.linkedin.com/in/javier-naranjo-simarro-67325a356)
- **Adrián Delgado**  
  [LinkedIn](https://www.linkedin.com/in/adrian-delgado-campos-b025333ab)
- **Martín Labrador**  
  [Instagram](https://www.instagram.com/_martinlabrador_)

## 🚀 Impacto del Proyecto

**SecureNet Lab** no solo es un laboratorio académico, sino una simulación realista de:

- Infraestructura empresarial
- Segmentación segura
- Publicación controlada de servicios
- Buenas prácticas DevOps
- Arquitectura de red profesional

Demuestra la capacidad de diseñar, implementar y asegurar entornos de red complejos aplicando conocimientos de:

- Networking
- Seguridad
- Sistemas Linux
- Automatización
- Despliegue web
- Observabilidad

📄 Noticia publicada sobre el proyecto:

- [Trabajando en el proyecto SecureNet Lab](https://somosdelprieto.com/index.php/2025/11/27/trabajando-en-el-proyecto-securenet-lab/)

## ✅ Estado actual

- ✅ Infraestructura segmentada operativa
- ✅ DMZ aislada con políticas de acceso
- ✅ Web desplegada con HTTPS
- ✅ Monitorización en tiempo real funcional
- ✅ Acceso remoto por VPN
- ✅ Servicios de automatización desplegados
- ✅ DHCP con failover en laboratorio
- ✅ Despliegue Docker con reverse proxy y CI/CD

## 📢 Proyecto de Innovación

**SecureNet Lab** representa una implementación práctica y profesional de redes seguras en un entorno académico, integrando conocimientos de:

- Networking
- Seguridad
- Sistemas Linux
- Automatización
- Despliegue web
- Observabilidad

SecureNet Lab – Grupo B – Proyecto de Innovación 2026