# Power Apps para Operaciones Básicas de SecureNet Cloud

## 1. Objetivo

La gestión operativa básica de SecureNet Cloud se realiza con Microsoft Power Apps como capa low-code para consultar estado y ejecutar acciones controladas sobre servicios desplegados.

La aplicación propuesta se denomina **SecureNet Cloud Manager** y permite:

- Consultar estado de instancias EC2.
- Consultar estado de contenedores Docker.
- Ejecutar acciones operativas controladas.
- Consultar logs básicos para diagnóstico rápido.
- Registrar acciones en auditoría básica.

No se desarrolla una plataforma custom adicional para operaciones.

---

## 2. Alcance

### 2.1 Incluido

1. Aplicación web en Microsoft Power Apps.
2. Listas de SharePoint como almacenamiento operativo básico.
3. Flujos de Power Automate para ejecutar acciones.
4. Integración con Jenkins como capa intermedia de ejecución.
5. Ejecución de acciones controladas sobre contenedores Docker.
6. Registro de acciones para auditoría básica.
7. Consulta básica de logs de contenedores.
8. Separación de permisos por rol (Viewer, Operator, Admin).

### 2.2 No incluido

1. Plataforma propia con backend dedicado.
2. Panel React/FastAPI/Node para operación.
3. Orquestación avanzada con Kubernetes.
4. Ejecución de comandos libres desde Power Apps.
5. Gestión directa de credenciales AWS desde Power Apps.
6. Sustitución de Jenkins como CI/CD.
7. Monitorización avanzada (cubierta por New Relic).

---

## 3. Arquitectura propuesta

```text
Power Apps
    ↓
Power Automate
    ↓
Jenkins (job parametrizado)
    ↓
EC2 docker-aws
    ↓
Docker / Docker Compose
    ↓
SharePoint Lists (estado, acciones, logs, auditoría)
```

- **Power Apps**: interfaz de usuario.
- **Power Automate**: validación y orquestación de solicitudes.
- **Jenkins**: ejecución técnica de acciones permitidas.
- **EC2 docker-aws**: host de contenedores de SecureNet.
- **SharePoint**: persistencia operativa y trazabilidad.

---

## 4. Componentes principales

### 4.1 Power Apps

Pantallas y funcionalidades:

- Dashboard de estado general.
- Vista de instancias EC2.
- Vista de contenedores Docker.
- Ejecución de acciones predefinidas.
- Consulta de logs.
- Historial de auditoría.

### 4.2 Power Automate

Responsabilidades:

1. Recibir solicitud desde Power Apps.
2. Validar acción, recurso y usuario.
3. Registrar acción como `pending`.
4. Invocar job parametrizado en Jenkins.
5. Actualizar resultado (`ok` o `error`).
6. Devolver respuesta a Power Apps.

### 4.3 Jenkins

Job propuesto: `securenet-container-action`

Parámetros esperados:

- `ACTION`
- `CONTAINER`
- `MACHINE`
- `USER_EMAIL`

Acciones permitidas:

- `refresh`
- `start`
- `stop`
- `restart`
- `logs`

Contenedores permitidos:

- `jenkins`
- `securenet-api`
- `securenet-frontend`
- `securenet-gateway`

Máquinas permitidas:

- `jenkins-aws`
- `docker-aws`

Jenkins no debe aceptar comandos libres.

### 4.4 EC2 docker-aws

Servicios esperados:

- `securenet-api`
- `securenet-frontend`
- `securenet-gateway`

Ejemplos de comandos ejecutados por Jenkins:

```bash
docker ps
docker start securenet-api
docker stop securenet-api
docker restart securenet-api
docker logs --tail 80 securenet-api
```

### 4.5 SharePoint Lists

Listas operativas:

- **Infraestructura**
- **Contenedores**
- **Acciones**
- **Logs**

---

## 5. Modelo de datos (SharePoint)

### 5.1 Lista: Infraestructura

| Campo | Tipo | Descripción |
|---|---|---|
| Title | Texto | Nombre de la instancia |
| Tipo | Texto | Tipo de recurso |
| IP | Texto | IP pública o privada |
| Estado | Elección | Estado actual |
| Entorno | Texto | Entorno cloud |
| UltimaActualizacion | Fecha y hora | Última comprobación |
| Observaciones | Varias líneas | Notas operativas |

Valores recomendados de `Estado`: `running`, `stopped`, `unknown`, `error`.

Registros iniciales:

- `jenkins-aws`
- `docker-aws`

### 5.2 Lista: Contenedores

| Campo | Tipo | Descripción |
|---|---|---|
| Title | Texto | Nombre del contenedor |
| Maquina | Texto | Instancia donde se ejecuta |
| Imagen | Texto | Imagen Docker |
| Estado | Elección | Estado del contenedor |
| Puerto | Texto | Puerto expuesto/interno |
| UltimoReinicio | Fecha y hora | Último reinicio |
| Observaciones | Varias líneas | Notas operativas |

Valores recomendados de `Estado`: `running`, `stopped`, `restarting`, `unknown`, `error`.

Registros iniciales:

- `jenkins`
- `securenet-api`
- `securenet-frontend`
- `securenet-gateway`

### 5.3 Lista: Acciones

| Campo | Tipo | Descripción |
|---|---|---|
| Title | Texto | Nombre resumido de la acción |
| Usuario | Texto | Usuario que ejecuta |
| Accion | Elección | Acción solicitada |
| Recurso | Texto | Contenedor o recurso afectado |
| Fecha | Fecha y hora | Fecha de ejecución |
| Resultado | Elección | Resultado de la acción |
| Observaciones | Varias líneas | Detalle del resultado |

Valores de `Accion`: `refresh`, `start`, `stop`, `restart`, `logs`.

Valores de `Resultado`: `pending`, `ok`, `error`, `blocked`.

### 5.4 Lista: Logs

| Campo | Tipo | Descripción |
|---|---|---|
| Title | Texto | Nombre de la consulta |
| Contenedor | Texto | Contenedor consultado |
| Maquina | Texto | Máquina consultada |
| Fecha | Fecha y hora | Fecha de consulta |
| Contenido | Varias líneas | Últimas líneas del log |

---

## 6. Pantallas de Power Apps

### 6.1 Dashboard

- Estado general de SecureNet Cloud.
- Estado de `jenkins-aws`.
- Estado de `docker-aws`.
- Número de contenedores activos/detenidos.
- Última actualización.
- Botón `refresh`.

### 6.2 Instancias

- Nombre de instancia.
- Tipo de instancia.
- IP.
- Estado.
- Última actualización.
- Observaciones.

Instancias principales:

- `jenkins-aws`
- `docker-aws`

### 6.3 Contenedores

- Nombre de contenedor.
- Máquina asociada.
- Imagen.
- Estado.
- Puerto.
- Último reinicio.
- Observaciones.

Acciones por contenedor:

- `refresh`
- `start`
- `stop`
- `restart`
- `logs`

### 6.4 Acciones

Debe permitir seleccionar:

1. Máquina.
2. Contenedor.
3. Acción.
4. Confirmación.

Solo acciones de lista cerrada; sin comandos personalizados.

### 6.5 Logs

- Máquina.
- Contenedor.
- Fecha.
- Últimas líneas.
- Resultado.

Uso orientado a diagnóstico rápido (no observabilidad avanzada).

### 6.6 Auditoría

- Usuario.
- Acción.
- Recurso.
- Fecha/hora.
- Resultado.
- Observaciones.

---

## 7. Funciones operativas

### 7.1 Estado de infraestructura

- Estado de instancia Jenkins.
- Estado de instancia Docker/App.
- Último reporte activo.
- Estado general del entorno.

### 7.2 Estado de contenedores

- Lista por instancia.
- Estado.
- Imagen.
- Puerto.
- Último reinicio.

Estados esperados:

- `running`
- `stopped`
- `restarting`
- `unknown`
- `error`

### 7.3 Acciones operativas

Acciones permitidas:

- `refresh`
- `start`
- `stop`
- `restart`
- `logs`

No se permite ejecución de comandos arbitrarios.

### 7.4 Logs básicos

Consulta de últimas líneas de log.

Ejemplo:

```bash
docker logs --tail 80 securenet-api
```

---

## 8. Flujo de ejecución de acciones

1. Usuario entra en Power Apps.
2. Selecciona contenedor y acción.
3. Power Apps invoca Power Automate.
4. Power Automate registra acción `pending`.
5. Power Automate invoca Jenkins.
6. Jenkins valida parámetros.
7. Jenkins ejecuta operación Docker.
8. Power Automate registra resultado.
9. Power Apps muestra resultado.

Ejemplo de reinicio:

```text
Power Apps
    ↓ (restart, securenet-api, docker-aws)
Power Automate
    ↓
Jenkins: securenet-container-action
    ↓
docker restart securenet-api
    ↓
SharePoint: registro de resultado
```

---

## 9. Seguridad

### 9.1 Principios

- Power Apps no almacena secretos.
- Sin claves AWS en Power Apps.
- Sin tokens Jenkins visibles.
- Sin comandos libres desde UI.
- Power Automate como capa intermedia obligatoria.
- Jenkins valida toda acción recibida.
- Todas las acciones quedan auditadas.
- Acceso mediante identidad Microsoft 365/Azure AD.

### 9.2 Roles

| Rol | Permisos |
|---|---|
| Viewer | Consulta de estado, logs y auditoría |
| Operator | `refresh`, `logs`, `restart` |
| Admin | `start`, `stop`, `restart`, `refresh`, `logs` |

### 9.3 Matriz de permisos

| Acción | Viewer | Operator | Admin |
|---|---|---|---|
| Ver dashboard | Sí | Sí | Sí |
| Ver contenedores | Sí | Sí | Sí |
| Ver logs | Sí | Sí | Sí |
| Refresh estado | Sí | Sí | Sí |
| Restart contenedor | No | Sí | Sí |
| Start contenedor | No | No | Sí |
| Stop contenedor | No | No | Sí |
| Ver auditoría | Sí | Sí | Sí |

### 9.4 Restricciones

No permitido:

- Comandos libres desde Power Apps.
- Access keys AWS en Power Apps.
- Tokens visibles en fórmulas Power Fx.
- SSH `0.0.0.0/0`.
- Jenkins `:8080` expuesto a todo Internet.
- Acciones sin auditoría.

Sí permitido:

- Acciones cerradas y predefinidas.
- Auditoría en SharePoint.
- Validación en Power Automate y Jenkins.
- Uso de credenciales gestionadas.
- Acceso restringido a Jenkins.

---

## 10. Roadmap de implementación

### 10.1 Fase 1 - MVP

Objetivo: primera versión funcional.

Incluye:

1. Crear listas de SharePoint.
2. Crear app conectada a SharePoint.
3. Crear pantallas Dashboard y Contenedores.
4. Crear flujo básico en Power Automate.
5. Crear job parametrizado en Jenkins.
6. Ejecutar `restart` y registrar resultado.

Resultado: reinicio controlado desde Power Apps.

### 10.2 Fase 2 - Operación básica completa

Incluye acciones `refresh`, `start`, `stop`, `restart`, `logs`, más pantalla de logs y auditoría.

Resultado: operación básica completa con trazabilidad.

### 10.3 Fase 3 - Seguridad y mejora operativa

Incluye separación de roles, restricciones por rol, hardening de acceso a Jenkins, validación estricta de parámetros y alertas simples.

Resultado: capa operativa sencilla y controlada lista para uso continuo.

---

## 11. Validación técnica

### 11.1 Power Apps

- La app carga correctamente.
- Muestra listas de infraestructura y contenedores.
- Botones ejecutan flujos.
- Usuarios sin permisos no ejecutan acciones restringidas.
- No hay secretos visibles.

### 11.2 Power Automate

- Recibe parámetros desde Power Apps.
- Registra acción como `pending`.
- Invoca Jenkins correctamente.
- Actualiza resultado `ok/error`.
- Registra observaciones/salida.

### 11.3 Jenkins

- Recibe parámetros.
- Valida acción, contenedor y máquina.
- Rechaza acciones no permitidas.
- Ejecuta comandos Docker controlados.
- Devuelve salida útil de diagnóstico.

### 11.4 Auditoría

Cada acción debe registrar:

- Usuario
- Acción
- Recurso
- Fecha
- Resultado
- Observaciones

Ejemplo:

```text
Usuario: javier@dominio.com
Acción: restart
Recurso: securenet-api
Fecha: 13/05/2026 18:45
Resultado: ok
Observaciones: Contenedor reiniciado correctamente
```

---

## 12. Riesgos y medidas de control

| Riesgo | Medida de control |
|---|---|
| Ejecución de comandos no autorizados | Lista cerrada de acciones |
| Exposición de Jenkins | Restringir acceso por IP, VPN o túnel |
| Secretos en Power Apps | Guardarlos solo en Power Automate/Jenkins |
| Acciones sin trazabilidad | Registrar todo en SharePoint |
| Stop accidental de servicios críticos | Limitar `stop` a rol Admin |
| Manipulación de parámetros | Validar también en Jenkins |
| Dependencia de usuario manual | Registrar usuario con `User().Email` |

---

## 13. Criterio de finalización

La parte de Power Apps se considera finalizada cuando:

1. Existe la app **SecureNet Cloud Manager**.
2. Existen las listas Infraestructura, Contenedores, Acciones y Logs.
3. La app muestra estado básico de instancias y contenedores.
4. Permite ejecutar al menos `refresh`, `restart` y `logs`.
5. Power Automate registra acciones en SharePoint.
6. Jenkins recibe y ejecuta acciones por job parametrizado.
7. No hay comandos libres ni secretos visibles en Power Apps.
8. Las acciones quedan registradas con usuario, fecha, recurso y resultado.

---

## 14. Nota técnica

La decisión del proyecto es usar Microsoft Power Apps como capa de gestión operativa básica de SecureNet Cloud.

Esta solución no sustituye Jenkins, Terraform, AWS ni New Relic; ofrece una interfaz controlada para operación simple y reduce necesidad de acceso manual por consola, SSH o comandos Docker.

Cualquier evolución avanzada (API propia, control granular adicional, integración directa con AWS SDK o paneles personalizados) queda fuera de esta fase y se evaluará según necesidades reales del entorno.
