# Power Apps para Operaciones Basicas de SecureNet

## Objetivo

La gestion operativa se hara solo con Microsoft Power Apps para tareas sencillas:

- Ver si las instancias EC2 estan activas.
- Ver si los contenedores Docker estan levantados.
- Reiniciar servicios o contenedores.
- Ejecutar acciones basicas de operacion.

No se desarrollara una plataforma custom adicional.

---

## Alcance

### Incluido

1. Dashboard web en Power Apps.
2. Flujos en Power Automate para acciones basicas.
3. Integracion con APIs/acciones en AWS (EC2/Jenkins).
4. Registro simple de acciones (auditoria basica).

### No incluido

1. Plataforma propia con backend dedicado.
2. Desarrollo de panel React/FastAPI para operaciones.
3. Orquestacion avanzada tipo Kubernetes desde esta app.

---

## Funciones Basicas

### 1) Estado de infraestructura

- Estado de instancia Jenkins.
- Estado de instancia de aplicaciones.
- Ultima vez reportada como activa.

### 2) Estado de contenedores

- Lista de contenedores en cada instancia.
- Estado: running / stopped / restarting.
- Contenedor principal de Jenkins.

### 3) Acciones operativas

- Start contenedor.
- Stop contenedor.
- Restart contenedor.
- Refresh de estado.

### 4) Logs basicos

- Consulta de ultimas lineas de log para diagnostico rapido.

---

## Arquitectura Simple

```
Power Apps (web)
   |
Power Automate (flows)
   |
Acciones sobre AWS (Jenkins/EC2)
```

Implementacion recomendada:

1. Power Apps para UI.
2. Power Automate para botones y acciones.
3. Endpoints simples o scripts remotos para ejecutar operaciones Docker.

---

## Seguridad

- Acceso a la app con identidad corporativa (Azure AD/Microsoft 365).
- Permisos por roles basicos (viewer/operator).
- Registro de acciones en lista simple (SharePoint o equivalente).

---

## Roadmap

### Fase 1 (MVP)

1. Ver estado de instancias.
2. Ver estado de contenedores.
3. Reiniciar contenedor.

### Fase 2

1. Start/Stop desde UI.
2. Logs basicos desde UI.
3. Auditoria de acciones.

### Fase 3

1. Mejoras de UX.
2. Alertas simples (Teams/Email).
3. Ajustes de permisos por entorno.

---

## Nota de Proyecto

La decision final del proyecto es utilizar solo Power Apps para gestion operativa sencilla. Cualquier evolucion avanzada se evaluara mas adelante segun necesidades reales de produccion.
