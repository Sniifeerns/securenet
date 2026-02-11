# 🔐 SecureNet Lab  
## Proyecto de Innovación – Grupo B  
### 2º ASIR · IES Gregorio Prieto

---

## 📌 Descripción del Proyecto

**SecureNet Lab** es un proyecto de innovación desarrollado en el ciclo formativo de **Administración de Sistemas Informáticos en Red (ASIR)** en el **IES Gregorio Prieto**.

El objetivo del proyecto ha sido diseñar e implementar un entorno de red seguro, segmentado y profesional que simule una infraestructura real de empresa, aplicando buenas prácticas de ciberseguridad, administración de redes y despliegue de servicios.

Se ha construido un laboratorio funcional con segmentación por VLAN, una DMZ protegida, control de acceso mediante ACLs, publicación segura de servicios web y automatización.

---

## 🎯 Objetivos del Proyecto

- Diseñar una arquitectura de red segmentada por VLAN.
- Implementar una **DMZ aislada** para servicios expuestos.
- Configurar enrutamiento inter-VLAN.
- Aplicar **ACLs de seguridad** para controlar tráfico entre zonas.
- Implementar NAT y Port Forwarding.
- Publicar un servidor web seguro mediante HTTPS.
- Configurar acceso remoto seguro mediante VPN (Tailscale).
- Implementar **DHCP con failover**.
- Desplegar servicios de automatización con **n8n**.
- Simular un entorno empresarial real con buenas prácticas.

---

## 🏗 Arquitectura de Red

El laboratorio está compuesto por las siguientes redes:

| Segmento | Red | Descripción |
|----------|------|-------------|
| VLAN 10 | 172.16.10.0/24 | Soporte |
| VLAN 20 | 172.16.20.0/24 | Administración |
| VLAN 30 | 172.16.30.0/24 | Ventas |
| DMZ (VLAN 40) | 172.16.40.0/24 | Servidores expuestos |
| Red de tránsito | 10.10.0.0/30 | Comunicación entre routers |

### 🔒 Política de Seguridad

- La **DMZ no puede acceder a las VLAN internas**.
- Las VLAN internas sí pueden acceder a servicios de la DMZ.
- Internet no puede acceder a la red interna.
- Acceso público solo permitido mediante reglas específicas (Port Forwarding).
- HTTPS obligatorio para servicios web.
- Acceso remoto seguro mediante VPN privada.

---

## 🛠 Herramientas y Tecnologías Utilizadas

### Infraestructura de Red
- Cisco 1900
- Cisco RV340
- Cisco 2960 / 3560
- VLANs 802.1Q
- ACLs
- NAT
- Port Forwarding

### Servidores y Servicios
- Ubuntu Server
- Apache2
- DHCP (ISC DHCP Server con Failover)
- n8n (automatización)
- HTTPS con SSL
- SSH seguro

### Seguridad
- Segmentación por VLAN
- DMZ aislada
- ACLs personalizadas
- VPN con Tailscale
- Restricción de acceso desde WAN
- Firewalling avanzado

### Desarrollo Web
- React + Vite
- TailwindCSS
- Apache2 (producción)

---

## 🌐 Servicios Implementados

- Servidor web en DMZ
- Panel web del proyecto
- Automatización mediante n8n
- DHCP redundante
- Acceso remoto VPN
- Publicación segura con HTTPS

---

## 🏫 Contexto Académico

Proyecto desarrollado durante el curso **2025–2026** en:

> 🎓 **IES Gregorio Prieto**  
> Ciclo Formativo de Grado Superior  
> Administración de Sistemas Informáticos en Red (2º ASIR)

Este proyecto forma parte del módulo de innovación tecnológica aplicado a entornos reales de infraestructura y seguridad.

---

## 👥 Integrantes – Grupo B

- **Tania Morales**  
  https://www.linkedin.com/in/tania-morales-sánchez-348615164

- **Javier Naranjo**  
  https://www.linkedin.com/in/javier-naranjo-simarro-67325a356

- **Adrián Delgado**  
  https://www.linkedin.com/in/adrian-delgado-campos-b025333ab

- **Martín Labrador**  
  https://www.instagram.com/_martinlabrador_

---

## 🚀 Impacto del Proyecto

SecureNet Lab no solo es un laboratorio académico, sino una simulación realista de:

- Infraestructura empresarial
- Segmentación segura
- Publicación controlada de servicios
- Buenas prácticas DevOps
- Arquitectura de red profesional

Demuestra la capacidad de diseñar, implementar y asegurar entornos de red complejos aplicando conocimientos de:

- Networking
- Seguridad
- Sistemas
- Automatización
- Administración Linux

---

## 🔐 Estado del Proyecto

✅ Infraestructura funcional  
✅ DMZ aislada  
✅ Publicación web segura  
✅ Acceso remoto VPN  
✅ Automatización activa  
✅ DHCP con failover  

---

## 📢 Proyecto de Innovación

SecureNet Lab representa una aproximación práctica y profesional a la implementación de redes seguras en entornos empresariales, integrando conocimientos multidisciplinares del ciclo formativo.

---

**SecureNet Lab – Grupo B – Proyecto de Innovación 2026**
