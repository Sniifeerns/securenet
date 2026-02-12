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
- Apache2
- DHCP (ISC DHCP Server con Failover)
- n8n (automatización)
- Netdata (monitorización)
- Node.js + Express (API de métricas)
- SSH seguro

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

**Frontend React** → `https://<host>/api/metrics` → **Apache ProxyPass** → `http://127.0.0.1:3001/api/metrics` → **Netdata** `127.0.0.1:19999`

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

## 🚀 Despliegue del frontend

### Local
```bash
npm install
npm run dev
```

### Build producción
```bash
npm run build
```

### Publicación en servidor
```bash
cp -r dist/* /var/www/...
```

### Configurar VirtualHost SSL

- VirtualHost HTTPS en Apache apuntando a `/var/www/...`

### Configurar ProxyPass de `/api` al servidor Node local

Ejemplo:

```apache
ProxyPass /api http://127.0.0.1:3001/api
ProxyPassReverse /api http://127.0.0.1:3001/api
```

### Recargar Apache

```bash
sudo systemctl reload apache2
```

### ⚙️ Variables de entorno

#### Desarrollo (`.env`)

```bash
VITE_METRICS_API=http://127.0.0.1:3001/api
```

#### Producción (`.env.production`)

```bash
VITE_METRICS_API=/api
```

> Importante: en producción no usar 127.0.0.1 desde frontend del cliente; debe resolverse por proxy `/api`.

---

## 🧪 Verificaciones útiles

### Backend de métricas

```bash
curl -s http://127.0.0.1:3001/api/health
curl -s http://127.0.0.1:3001/api/metrics
```

### Proxy HTTPS (Apache)

```bash
curl -k https://127.0.0.1/api/health
curl -k https://127.0.0.1/api/metrics
```

### Diagnóstico frontend

- DevTools > Network
  - Confirmar request a `/api/metrics`
  - Evitar errores tipo `/api/api/metrics`
- Hard refresh (`Ctrl + Shift + R`) tras cada despliegue

---

## 🧯 Incidencias reales resueltas

- `Failed to fetch` por ruta incorrecta o build antiguo en caché.
- `Unexpected token '<'` al recibir HTML (404) en vez de JSON.
- `Mismatching encryption keys` en n8n por clave distinta en volumen/config.
- Errores de permisos al subir build por SCP.
- Cálculo de CPU fijo (0 o 100) por parseo incorrecto de labels Netdata.

---

## 🏫 Contexto Académico

Proyecto desarrollado durante el curso **2025–2026** en:

> 🎓 **IES Gregorio Prieto**  
> Ciclo Formativo de Grado Superior  
> Administración de Sistemas Informáticos en Red (2º ASIR)

Este proyecto forma parte del enfoque de innovación tecnológica aplicado a entornos reales de infraestructura y seguridad.

---

## 👥 Integrantes – Grupo B

- **Tania Morales**  
  `https://www.linkedin.com/in/tania-morales-sánchez-348615164`

- **Javier Naranjo**  
  `https://www.linkedin.com/in/javier-naranjo-simarro-67325a356`

- **Adrián Delgado**  
  `https://www.linkedin.com/in/adrian-delgado-campos-b025333ab`

- **Martín Labrador**  
  `https://www.instagram.com/_martinlabrador_`

---

## 🚀 Impacto del Proyecto

SecureNet Lab no solo es un laboratorio académico, sino una simulación realista de:

- Infraestructura empresarial
- Segmentación segura
- Publicación controlada de servicios
- Buenas prácticas DevOps
- Arquitectura de red profesional

Demuestra la capacidad de diseñar, implementar y asegurar entornos de red complejos aplicando conocimientos de:

Noticia publicada:  
`https://somosdelprieto.com/index.php/2025/11/27/trabajando-en-el-proyecto-securenet-lab/`

---

## ✅ Estado actual

✅ Infraestructura segmentada operativa  
✅ DMZ aislada con políticas de acceso  
✅ Web desplegada con HTTPS  
✅ Monitorización en tiempo real funcional  
✅ Acceso remoto por VPN  
✅ Servicios de automatización desplegados  
✅ DHCP con failover en laboratorio  

---

## 📢 Proyecto de Innovación

SecureNet Lab representa una implementación práctica y profesional de redes seguras en un entorno académico, integrando conocimientos de:

- Networking
- Seguridad
- Sistemas Linux
- Automatización
- Despliegue web
- Observabilidad

---

**SecureNet Lab – Grupo B – Proyecto de Innovación 2026**
