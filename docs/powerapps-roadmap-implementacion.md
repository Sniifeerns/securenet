# Roadmap de Implementación de Power Apps - SecureNet Cloud Manager

## 1. Objetivo del documento

Este documento define el roadmap completo para implementar la parte de Power Apps dentro de SecureNet Cloud.

La aplicación se denomina:

**SecureNet Cloud Manager**

Su función es actuar como una capa low-code de operación básica para consultar estado, ejecutar acciones controladas sobre contenedores, revisar logs y registrar auditoría sin acceder directamente por SSH, Jenkins o la consola de AWS.

La arquitectura prevista es:

```text
Power Apps
    ↓
Power Automate
    ↓
Jenkins
    ↓
EC2 docker-aws
    ↓
Docker / Docker Compose
    ↓
SharePoint Lists
```

Esta implementación sigue el objetivo definido para SecureNet Cloud: usar Power Apps como capa low-code de gestión operativa y Power Automate como puente hacia acciones controladas.

---

## 2. Fases del roadmap

El roadmap se divide en las siguientes fases:

```text
Fase 0 - Preparación
Fase 1 - Creación de listas SharePoint
Fase 2 - Creación de la aplicación Power Apps
Fase 3 - Diseño de pantallas
Fase 4 - Creación de flujos Power Automate
Fase 5 - Integración con Jenkins
Fase 6 - Integración con Docker
Fase 7 - Auditoría y logs
Fase 8 - Seguridad y roles
Fase 9 - Validación final
Fase 10 - Evidencias y cierre
```

---

# Fase 0 - Preparación

## 0.1 Objetivo

Preparar los elementos necesarios antes de crear la aplicación.

## 0.2 Requisitos previos

Antes de empezar deben estar disponibles:

- Cuenta Microsoft 365 con acceso a Power Apps.
- Acceso a Power Automate.
- Sitio de SharePoint disponible.
- Jenkins desplegado en `jenkins-aws`.
- Instancia Docker/App desplegada como `docker-aws`.
- Contenedores principales de SecureNet Cloud en Docker.
- Job de Jenkins o posibilidad de crear jobs parametrizados.
- Acceso controlado entre Jenkins y `docker-aws`.

## 0.3 Elementos que se van a crear

Durante la implementación se crearán:

- Aplicación Power Apps: `SecureNet Cloud Manager`.
- Listas SharePoint:
  - `Infraestructura`
  - `Contenedores`
  - `Acciones`
  - `Logs`
- Flujo Power Automate:
  - `SecureNet_Container_Action`
- Job Jenkins:
  - `securenet-container-action`

## Capturas recomendadas

Capturas a realizar en esta fase:

1. Pantalla inicial de Power Apps.
2. Pantalla inicial de Power Automate.
3. Sitio de SharePoint donde se crearán las listas.
4. Jenkins accesible en `jenkins-aws`.
5. Estado inicial de los contenedores con `docker ps`.

---

# Fase 1 - Creación de listas SharePoint

## 1.1 Objetivo

Crear las listas que actuarán como almacenamiento operativo de la aplicación.

SharePoint se usará para guardar:

- Estado de infraestructura.
- Estado de contenedores.
- Historial de acciones.
- Logs básicos consultados desde la aplicación.

---

## 1.2 Lista Infraestructura

Nombre de la lista:

```text
Infraestructura
```

Columnas:

| Campo               | Tipo                   | Descripción            |
| ------------------- | ---------------------- | ---------------------- |
| Title               | Texto                  | Nombre de la instancia |
| Tipo                | Texto                  | Tipo de recurso        |
| IP                  | Texto                  | IP pública o privada   |
| Estado              | Elección               | Estado actual          |
| Entorno             | Texto                  | Entorno cloud          |
| UltimaActualizacion | Fecha y hora           | Última comprobación    |
| Observaciones       | Varias líneas de texto | Información adicional  |

Valores recomendados para `Estado`:

```text
running
stopped
unknown
error
```

Registros iniciales:

```text
jenkins-aws
docker-aws
```

Ejemplo:

| Title       | Tipo           | IP        | Estado  | Entorno | Observaciones                         |
| ----------- | -------------- | --------- | ------- | ------- | ------------------------------------- |
| jenkins-aws | EC2 Jenkins    | pendiente | unknown | cloud   | Instancia Jenkins CI/CD               |
| docker-aws  | EC2 Docker/App | pendiente | unknown | cloud   | Instancia Docker para SecureNet Cloud |

## Capturas recomendadas

1. Creación de la lista `Infraestructura`.
2. Vista de columnas creadas.
3. Registros iniciales `jenkins-aws` y `docker-aws`.

---

## 1.3 Lista Contenedores

Nombre de la lista:

```text
Contenedores
```

Columnas:

| Campo          | Tipo                   | Descripción                |
| -------------- | ---------------------- | -------------------------- |
| Title          | Texto                  | Nombre del contenedor      |
| Maquina        | Texto                  | Instancia donde se ejecuta |
| Imagen         | Texto                  | Imagen Docker utilizada    |
| Estado         | Elección               | Estado actual              |
| Puerto         | Texto                  | Puerto asociado            |
| UltimoReinicio | Fecha y hora           | Última acción de reinicio  |
| Observaciones  | Varias líneas de texto | Información adicional      |

Valores recomendados para `Estado`:

```text
running
stopped
restarting
unknown
error
```

Registros iniciales:

```text
jenkins
securenet-api
securenet-frontend
securenet-gateway
```

Ejemplo:

| Title              | Maquina     | Imagen                 | Estado  | Puerto  | Observaciones                  |
| ------------------ | ----------- | ---------------------- | ------- | ------- | ------------------------------ |
| jenkins            | jenkins-aws | jenkins/jenkins:lts    | unknown | 8080    | Jenkins en contenedor          |
| securenet-api      | docker-aws  | ECR/securenet-api      | unknown | interno | API SecureNet                  |
| securenet-frontend | docker-aws  | ECR/securenet-frontend | unknown | interno | Frontend SecureNet             |
| securenet-gateway  | docker-aws  | ECR/securenet-gateway  | unknown | 80      | Gateway público detrás del ALB |

## Capturas recomendadas

1. Creación de la lista `Contenedores`.
2. Vista de columnas creadas.
3. Registros iniciales de los cuatro contenedores.
4. Vista general de la lista con los estados en `unknown`.

---

## 1.4 Lista Acciones

Nombre de la lista:

```text
Acciones
```

Columnas:

| Campo         | Tipo                   | Descripción                   |
| ------------- | ---------------------- | ----------------------------- |
| Title         | Texto                  | Nombre resumido de la acción  |
| Usuario       | Texto                  | Usuario que ejecuta la acción |
| Accion        | Elección               | Acción solicitada             |
| Recurso       | Texto                  | Contenedor o recurso afectado |
| Fecha         | Fecha y hora           | Fecha de ejecución            |
| Resultado     | Elección               | Resultado de la acción        |
| Observaciones | Varias líneas de texto | Salida o detalle              |

Valores recomendados para `Accion`:

```text
refresh
start
stop
restart
logs
```

Valores recomendados para `Resultado`:

```text
pending
ok
error
blocked
```

## Capturas recomendadas

1. Creación de la lista `Acciones`.
2. Vista de columnas.
3. Valores de elección para `Accion`.
4. Valores de elección para `Resultado`.

---

## 1.5 Lista Logs

Nombre de la lista:

```text
Logs
```

Columnas:

| Campo      | Tipo                   | Descripción           |
| ---------- | ---------------------- | --------------------- |
| Title      | Texto                  | Nombre de la consulta |
| Contenedor | Texto                  | Contenedor consultado |
| Maquina    | Texto                  | Máquina asociada      |
| Fecha      | Fecha y hora           | Fecha de consulta     |
| Contenido  | Varias líneas de texto | Últimas líneas de log |

## Capturas recomendadas

1. Creación de la lista `Logs`.
2. Vista de columnas.
3. Lista vacía preparada para recibir registros.

---

# Fase 2 - Creación de la aplicación Power Apps

## 2.1 Objetivo

Crear la aplicación inicial a partir de datos existentes en SharePoint.

## 2.2 Creación de la app

Pasos:

```text
Power Apps
    ↓
Create
    ↓
Start with data
    ↓
SharePoint
    ↓
Seleccionar sitio de SharePoint
    ↓
Seleccionar lista Contenedores
    ↓
Create app
```

La aplicación se generará inicialmente tomando como base la lista `Contenedores`.

Nombre de la aplicación:

```text
SecureNet Cloud Manager
```

## 2.3 Añadir orígenes de datos

Después de crear la app, se deben añadir las demás listas:

```text
Infraestructura
Acciones
Logs
```

Ruta aproximada:

```text
Power Apps Studio
    ↓
Data
    ↓
Add data
    ↓
SharePoint
    ↓
Seleccionar listas
```

## Capturas recomendadas

1. Pantalla de creación de app desde Power Apps.
2. Selección del conector SharePoint.
3. Selección de la lista `Contenedores`.
4. App creada automáticamente.
5. Panel `Data` mostrando las cuatro listas conectadas.

---

# Fase 3 - Diseño de pantallas

## 3.1 Objetivo

Crear las pantallas principales de la aplicación.

Pantallas mínimas:

```text
DashboardScreen
InstanciasScreen
ContenedoresScreen
AccionesScreen
LogsScreen
AuditoriaScreen
```

---

## 3.2 DashboardScreen

### Objetivo

Mostrar una visión general del estado del entorno.

Elementos recomendados:

- Título de la aplicación.
- Estado general.
- Estado de `jenkins-aws`.
- Estado de `docker-aws`.
- Número de contenedores activos.
- Número de contenedores detenidos.
- Última actualización.
- Botón `Refresh`.

Fórmula para contenedores activos:

```powerfx
"Running: " & CountRows(Filter(Contenedores, Estado = "running"))
```

Fórmula para contenedores detenidos:

```powerfx
"Stopped: " & CountRows(Filter(Contenedores, Estado = "stopped"))
```

Fórmula de estado general:

```powerfx
"Estado general: " &
If(
    CountRows(Filter(Contenedores, Estado = "error")) > 0,
    "ERROR",
    If(
        CountRows(Filter(Contenedores, Estado = "unknown")) > 0,
        "PENDIENTE",
        "OK"
    )
)
```

Botón temporal de refresh:

```powerfx
Refresh(Infraestructura);
Refresh(Contenedores);
Notify("Estado actualizado", NotificationType.Success)
```

## Capturas recomendadas

1. Dashboard vacío en edición.
2. Dashboard con tarjetas de estado.
3. Fórmula del contador de contenedores running.
4. Fórmula del estado general.
5. Botón `Refresh` creado.

---

## 3.3 InstanciasScreen

### Objetivo

Mostrar el estado de las instancias EC2 principales.

Origen de datos:

```text
Infraestructura
```

Campos visibles:

```text
Title
Tipo
IP
Estado
UltimaActualizacion
Observaciones
```

Instancias esperadas:

```text
jenkins-aws
docker-aws
```

## Capturas recomendadas

1. Pantalla `InstanciasScreen`.
2. Galería conectada a la lista `Infraestructura`.
3. Visualización de `jenkins-aws`.
4. Visualización de `docker-aws`.

---

## 3.4 ContenedoresScreen

### Objetivo

Mostrar los contenedores y permitir acciones controladas.

Origen de datos:

```text
Contenedores
```

Campos visibles:

```text
Title
Maquina
Imagen
Estado
Puerto
UltimoReinicio
Observaciones
```

Contenedores esperados:

```text
jenkins
securenet-api
securenet-frontend
securenet-gateway
```

Botones por contenedor:

```text
Refresh
Start
Stop
Restart
Logs
```

## Capturas recomendadas

1. Pantalla `ContenedoresScreen`.
2. Galería conectada a `Contenedores`.
3. Contenedor `securenet-api`.
4. Contenedor `securenet-frontend`.
5. Contenedor `securenet-gateway`.
6. Botones de acción por contenedor.

---

## 3.5 AccionesScreen

### Objetivo

Permitir ejecutar acciones de forma controlada.

Campos recomendados:

```text
Máquina
Contenedor
Acción
Confirmación
Resultado
```

Acciones permitidas:

```text
refresh
start
stop
restart
logs
```

Restricción importante:

```text
No se permite introducir comandos libres.
```

La acción se enviará siempre a Power Automate.

## Capturas recomendadas

1. Pantalla `AccionesScreen`.
2. Selector de máquina.
3. Selector de contenedor.
4. Selector de acción.
5. Botón de confirmación.
6. Mensaje de resultado.

---

## 3.6 LogsScreen

### Objetivo

Consultar logs básicos de contenedores.

Origen de datos:

```text
Logs
```

Campos visibles:

```text
Title
Contenedor
Maquina
Fecha
Contenido
```

Esta pantalla se usa para diagnóstico rápido.

La observabilidad avanzada queda fuera de esta pantalla y se gestiona con New Relic.

## Capturas recomendadas

1. Pantalla `LogsScreen`.
2. Galería conectada a `Logs`.
3. Ejemplo de log registrado.
4. Visualización del contenido del log.

---

## 3.7 AuditoriaScreen

### Objetivo

Mostrar el historial de acciones ejecutadas desde Power Apps.

Origen de datos:

```text
Acciones
```

Campos visibles:

```text
Usuario
Accion
Recurso
Fecha
Resultado
Observaciones
```

## Capturas recomendadas

1. Pantalla `AuditoriaScreen`.
2. Galería conectada a `Acciones`.
3. Acción registrada como `pending`.
4. Acción registrada como `ok`.
5. Acción registrada como `error`.

---

# Fase 4 - Creación de flujos Power Automate

## 4.1 Objetivo

Crear el flujo que recibirá las acciones desde Power Apps y llamará a Jenkins.

Flujo principal:

```text
SecureNet_Container_Action
```

Tipo:

```text
Instant cloud flow
```

Trigger:

```text
Power Apps
```

---

## 4.2 Parámetros recibidos desde Power Apps

El flujo recibirá:

```text
accion
contenedor
maquina
usuario
```

Ejemplo:

```text
accion = restart
contenedor = securenet-api
maquina = docker-aws
usuario = usuario@dominio.com
```

---

## 4.3 Estructura del flujo

Estructura completa:

```text
[Power Apps trigger]
    ↓
[Initialize variable accion]
    ↓
[Initialize variable contenedor]
    ↓
[Initialize variable maquina]
    ↓
[Initialize variable usuario]
    ↓
[Create item en Acciones: pending]
    ↓
[Condition: acción permitida]
    ↓
[Condition: contenedor permitido]
    ↓
[Condition: máquina permitida]
    ↓
[HTTP request a Jenkins]
    ↓
[Update item en Acciones: ok/error]
    ↓
[Si acción = logs, crear item en Logs]
    ↓
[Respond to Power Apps]
```

---

## 4.4 Validaciones

Power Automate debe validar que la acción esté dentro de la lista permitida:

```text
refresh
start
stop
restart
logs
```

Debe validar que el contenedor esté dentro de la lista permitida:

```text
jenkins
securenet-api
securenet-frontend
securenet-gateway
```

Debe validar que la máquina esté dentro de la lista permitida:

```text
jenkins-aws
docker-aws
```

Si algún valor no es válido, el resultado debe quedar como:

```text
blocked
```

## Capturas recomendadas

1. Creación del flujo `SecureNet_Container_Action`.
2. Trigger de Power Apps.
3. Variables inicializadas.
4. Acción `Create item` en lista `Acciones`.
5. Condición de acción permitida.
6. Condición de contenedor permitido.
7. Acción HTTP hacia Jenkins.
8. Acción `Update item` con resultado.
9. Acción `Respond to Power Apps`.

---

# Fase 5 - Integración con Jenkins

## 5.1 Objetivo

Permitir que Power Automate lance un job parametrizado en Jenkins.

Job propuesto:

```text
securenet-container-action
```

Tipo:

```text
Freestyle project
```

Parámetros:

```text
ACTION
CONTAINER
MACHINE
USER_EMAIL
```

---

## 5.2 Acciones permitidas en Jenkins

Jenkins validará de nuevo los parámetros recibidos.

Acciones permitidas:

```text
refresh
start
stop
restart
logs
```

Contenedores permitidos:

```text
jenkins
securenet-api
securenet-frontend
securenet-gateway
```

Máquinas permitidas:

```text
jenkins-aws
docker-aws
```

---

## 5.3 Script base del job

```bash
#!/bin/bash
set -euo pipefail

ACTION="${ACTION}"
CONTAINER="${CONTAINER}"
MACHINE="${MACHINE}"
USER_EMAIL="${USER_EMAIL}"

echo "SecureNet Cloud Manager action"
echo "ACTION=${ACTION}"
echo "CONTAINER=${CONTAINER}"
echo "MACHINE=${MACHINE}"
echo "USER_EMAIL=${USER_EMAIL}"

ALLOWED_ACTIONS="refresh start stop restart logs"
ALLOWED_CONTAINERS="jenkins securenet-api securenet-frontend securenet-gateway"
ALLOWED_MACHINES="jenkins-aws docker-aws"

if ! echo "$ALLOWED_ACTIONS" | grep -qw "$ACTION"; then
  echo "ERROR: Acción no permitida: $ACTION"
  exit 1
fi

if ! echo "$ALLOWED_CONTAINERS" | grep -qw "$CONTAINER"; then
  echo "ERROR: Contenedor no permitido: $CONTAINER"
  exit 1
fi

if ! echo "$ALLOWED_MACHINES" | grep -qw "$MACHINE"; then
  echo "ERROR: Máquina no permitida: $MACHINE"
  exit 1
fi

if [ "$MACHINE" = "docker-aws" ]; then
  TARGET_HOST="${DOCKER_AWS_PRIVATE_IP}"
elif [ "$MACHINE" = "jenkins-aws" ]; then
  TARGET_HOST="127.0.0.1"
else
  echo "ERROR: Máquina desconocida"
  exit 1
fi

case "$ACTION" in
  refresh)
    ssh ec2-user@"$TARGET_HOST" "docker ps -a --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'"
    ;;

  start)
    ssh ec2-user@"$TARGET_HOST" "docker start '$CONTAINER'"
    ;;

  stop)
    ssh ec2-user@"$TARGET_HOST" "docker stop '$CONTAINER'"
    ;;

  restart)
    ssh ec2-user@"$TARGET_HOST" "docker restart '$CONTAINER'"
    ;;

  logs)
    ssh ec2-user@"$TARGET_HOST" "docker logs --tail 80 '$CONTAINER'"
    ;;

  *)
    echo "ERROR: Acción no reconocida"
    exit 1
    ;;
esac
```

---

## 5.4 Llamada HTTP desde Power Automate

Método:

```text
POST
```

URL:

```text
https://JENKINS_URL/job/securenet-container-action/buildWithParameters
```

Body:

```text
ACTION=<accion>&CONTAINER=<contenedor>&MACHINE=<maquina>&USER_EMAIL=<usuario>
```

Cabeceras:

```text
Authorization: Basic <credential>
Content-Type: application/x-www-form-urlencoded
```

La credencial debe estar guardada en Power Automate, no en Power Apps.

## Capturas recomendadas

1. Job `securenet-container-action` creado.
2. Parámetros del job.
3. Script del job.
4. Prueba manual del job con `restart`.
5. Consola de Jenkins mostrando ejecución correcta.
6. Configuración HTTP en Power Automate.
7. Credencial protegida en Power Automate.

---

# Fase 6 - Integración con Docker

## 6.1 Objetivo

Validar que Jenkins puede ejecutar acciones Docker en la instancia correspondiente.

## 6.2 Comandos de prueba en EC2 docker-aws

Conectarse a `docker-aws` y comprobar:

```bash
docker ps
docker ps -a
docker compose ps
docker logs --tail 80 securenet-api
```

## 6.3 Pruebas desde Jenkins

Probar desde el job:

```text
ACTION=refresh
CONTAINER=securenet-api
MACHINE=docker-aws
```

Después:

```text
ACTION=logs
CONTAINER=securenet-api
MACHINE=docker-aws
```

Después:

```text
ACTION=restart
CONTAINER=securenet-api
MACHINE=docker-aws
```

## Capturas recomendadas

1. `docker ps` en `docker-aws`.
2. `docker compose ps`.
3. Prueba `refresh` desde Jenkins.
4. Prueba `logs` desde Jenkins.
5. Prueba `restart` desde Jenkins.
6. Contenedor reiniciado correctamente.

---

# Fase 7 - Conexión de botones en Power Apps

## 7.1 Objetivo

Conectar los botones de Power Apps con el flujo de Power Automate.

## 7.2 Añadir flujo a Power Apps

Pasos:

```text
Power Apps Studio
    ↓
Action
    ↓
Power Automate
    ↓
Add flow
    ↓
SecureNet_Container_Action
```

---

## 7.3 Botón Restart

Fórmula:

```powerfx
Set(
    varResultado,
    SecureNet_Container_Action.Run(
        "restart",
        ThisItem.Title,
        ThisItem.Maquina,
        User().Email
    )
);
Notify("Acción enviada: restart " & ThisItem.Title, NotificationType.Success);
Refresh(Acciones)
```

---

## 7.4 Botón Start

Fórmula:

```powerfx
Set(
    varResultado,
    SecureNet_Container_Action.Run(
        "start",
        ThisItem.Title,
        ThisItem.Maquina,
        User().Email
    )
);
Notify("Acción enviada: start " & ThisItem.Title, NotificationType.Success);
Refresh(Acciones)
```

---

## 7.5 Botón Stop

Fórmula:

```powerfx
Set(
    varResultado,
    SecureNet_Container_Action.Run(
        "stop",
        ThisItem.Title,
        ThisItem.Maquina,
        User().Email
    )
);
Notify("Acción enviada: stop " & ThisItem.Title, NotificationType.Success);
Refresh(Acciones)
```

---

## 7.6 Botón Logs

Fórmula:

```powerfx
Set(
    varResultado,
    SecureNet_Container_Action.Run(
        "logs",
        ThisItem.Title,
        ThisItem.Maquina,
        User().Email
    )
);
Notify("Consulta de logs enviada: " & ThisItem.Title, NotificationType.Information);
Navigate(LogsScreen);
Refresh(Logs)
```

---

## 7.7 Botón Refresh

Fórmula:

```powerfx
Set(
    varResultado,
    SecureNet_Container_Action.Run(
        "refresh",
        ThisItem.Title,
        ThisItem.Maquina,
        User().Email
    )
);
Notify("Refresh enviado: " & ThisItem.Title, NotificationType.Information);
Refresh(Contenedores);
Refresh(Acciones)
```

## Capturas recomendadas

1. Flujo añadido a Power Apps.
2. Fórmula del botón `Restart`.
3. Fórmula del botón `Logs`.
4. Ejecución desde la app.
5. Notificación de acción enviada.
6. Registro creado en `Acciones`.

---

# Fase 8 - Auditoría y logs

## 8.1 Objetivo

Comprobar que las acciones quedan registradas correctamente.

## 8.2 Registro de acciones

Cada acción debe crear un registro con:

```text
Usuario
Accion
Recurso
Fecha
Resultado
Observaciones
```

Ejemplo:

```text
Usuario: usuario@dominio.com
Accion: restart
Recurso: securenet-api
Fecha: 13/05/2026 18:45
Resultado: ok
Observaciones: Contenedor reiniciado correctamente
```

---

## 8.3 Registro de logs

Cuando la acción sea `logs`, se debe crear un registro en la lista `Logs`.

Datos mínimos:

```text
Contenedor
Maquina
Fecha
Contenido
```

## Capturas recomendadas

1. Lista `Acciones` antes de ejecutar acción.
2. Lista `Acciones` después de ejecutar `restart`.
3. Registro con resultado `pending`.
4. Registro actualizado a `ok`.
5. Lista `Logs` después de ejecutar `logs`.
6. Contenido del log almacenado.

---

# Fase 9 - Seguridad y roles

## 9.1 Objetivo

Aplicar controles mínimos de seguridad.

## 9.2 Roles definidos

| Rol      | Permisos                                                      |
| -------- | ------------------------------------------------------------- |
| Viewer   | Consulta de dashboard, contenedores, logs y auditoría         |
| Operator | Puede ejecutar `refresh`, `logs` y `restart`                  |
| Admin    | Puede ejecutar `refresh`, `logs`, `restart`, `start` y `stop` |

---

## 9.3 Restricción de acciones

Acciones por rol:

| Acción           | Viewer | Operator | Admin |
| ---------------- | -----: | -------: | ----: |
| Ver dashboard    |     Sí |       Sí |    Sí |
| Ver contenedores |     Sí |       Sí |    Sí |
| Ver logs         |     Sí |       Sí |    Sí |
| Ver auditoría    |     Sí |       Sí |    Sí |
| Refresh          |     Sí |       Sí |    Sí |
| Logs             |     Sí |       Sí |    Sí |
| Restart          |     No |       Sí |    Sí |
| Start            |     No |       No |    Sí |
| Stop             |     No |       No |    Sí |

---

## 9.4 Controles obligatorios

No debe existir:

```text
Comando libre desde Power Apps
AWS access keys en Power Apps
Token de Jenkins visible en Power Fx
SSH abierto a todo Internet
Jenkins abierto públicamente sin protección
Acciones sin auditoría
```

Debe existir:

```text
Validación en Power Automate
Validación en Jenkins
Registro de usuario
Registro de fecha
Registro de recurso afectado
Registro de resultado
Credenciales fuera de Power Apps
```

## Capturas recomendadas

1. Configuración de permisos de la app.
2. Fórmula o lógica de visibilidad de botones según rol.
3. Ejemplo de usuario sin permiso para `stop`.
4. Jenkins validando parámetros.
5. Power Automate bloqueando acción no permitida.
6. Registro `blocked` en `Acciones`.

---

# Fase 10 - Validación final

## 10.1 Objetivo

Comprobar que la solución funciona de extremo a extremo.

## 10.2 Prueba 1 - Visualización de estado

Pasos:

```text
1. Abrir Power Apps.
2. Entrar en Dashboard.
3. Ver estado de instancias.
4. Ver estado de contenedores.
```

Resultado esperado:

```text
La aplicación muestra la información almacenada en SharePoint.
```

Capturas:

1. Dashboard completo.
2. Pantalla de instancias.
3. Pantalla de contenedores.

---

## 10.3 Prueba 2 - Refresh

Pasos:

```text
1. Seleccionar contenedor.
2. Pulsar Refresh.
3. Ejecutar flujo Power Automate.
4. Lanzar job Jenkins.
5. Actualizar registro en SharePoint.
```

Resultado esperado:

```text
La acción se registra y el estado se actualiza.
```

Capturas:

1. Botón `Refresh` en Power Apps.
2. Ejecución del flujo en Power Automate.
3. Ejecución del job en Jenkins.
4. Lista `Acciones` con resultado `ok`.

---

## 10.4 Prueba 3 - Logs

Pasos:

```text
1. Seleccionar `securenet-api`.
2. Pulsar Logs.
3. Power Automate llama a Jenkins.
4. Jenkins ejecuta docker logs.
5. El resultado se almacena en SharePoint.
6. Power Apps muestra los logs.
```

Resultado esperado:

```text
Las últimas líneas de log aparecen en la pantalla Logs.
```

Capturas:

1. Botón `Logs`.
2. Ejecución de Jenkins.
3. Salida del comando `docker logs`.
4. Registro creado en lista `Logs`.
5. Pantalla `LogsScreen`.

---

## 10.5 Prueba 4 - Restart

Pasos:

```text
1. Seleccionar `securenet-api`.
2. Pulsar Restart.
3. Confirmar acción.
4. Power Automate registra acción.
5. Jenkins ejecuta docker restart.
6. Power Automate actualiza resultado.
```

Resultado esperado:

```text
El contenedor se reinicia correctamente y la acción queda auditada.
```

Capturas:

1. Botón `Restart`.
2. Confirmación en Power Apps.
3. Flujo Power Automate ejecutado.
4. Job Jenkins ejecutado.
5. Docker mostrando contenedor activo.
6. Registro en `Acciones` con resultado `ok`.

---

## 10.6 Prueba 5 - Acción bloqueada

Pasos:

```text
1. Enviar una acción no permitida.
2. Power Automate o Jenkins la rechaza.
3. Se registra como blocked o error.
```

Resultado esperado:

```text
La acción no se ejecuta y queda registrada.
```

Capturas:

1. Acción no permitida.
2. Condición de bloqueo en Power Automate.
3. Validación fallida en Jenkins.
4. Registro `blocked` en SharePoint.

---

# Fase 11 - Evidencias finales

## 11.1 Capturas mínimas obligatorias

Para documentar correctamente la implementación, se recomienda guardar al menos estas capturas:

## SharePoint

```text
01_sharepoint_infraestructura.png
02_sharepoint_contenedores.png
03_sharepoint_acciones.png
04_sharepoint_logs.png
```

## Power Apps

```text
05_powerapps_app_creada.png
06_powerapps_datasources.png
07_powerapps_dashboard.png
08_powerapps_instancias.png
09_powerapps_contenedores.png
10_powerapps_acciones.png
11_powerapps_logs.png
12_powerapps_auditoria.png
```

## Power Automate

```text
13_powerautomate_flujo_general.png
14_powerautomate_trigger.png
15_powerautomate_validaciones.png
16_powerautomate_http_jenkins.png
17_powerautomate_update_sharepoint.png
18_powerautomate_run_ok.png
```

## Jenkins

```text
19_jenkins_job_parametrizado.png
20_jenkins_parametros.png
21_jenkins_script.png
22_jenkins_build_ok.png
23_jenkins_console_output.png
```

## Docker / AWS

```text
24_docker_ps_before.png
25_docker_logs.png
26_docker_restart.png
27_docker_ps_after.png
```

## Validación final

```text
28_accion_restart_powerapps.png
29_accion_registrada_sharepoint.png
30_logs_mostrados_powerapps.png
31_auditoria_final.png
32_validacion_seguridad.png
```

---

# Fase 12 - Criterio de finalización

La implementación de Power Apps se considera finalizada cuando se cumplen los siguientes puntos:

1. Existe la app `SecureNet Cloud Manager`.
2. Existen las listas `Infraestructura`, `Contenedores`, `Acciones` y `Logs`.
3. Power Apps está conectada a todas las listas SharePoint.
4. El Dashboard muestra información básica del entorno.
5. La pantalla de contenedores muestra los servicios principales.
6. Power Automate recibe acciones desde Power Apps.
7. Jenkins recibe acciones mediante job parametrizado.
8. Jenkins puede ejecutar acciones Docker controladas.
9. Las acciones `refresh`, `logs` y `restart` funcionan correctamente.
10. Las acciones quedan registradas en la lista `Acciones`.
11. Los logs quedan registrados en la lista `Logs`.
12. No existen secretos visibles en Power Apps.
13. No existe campo de comandos libres.
14. Las acciones están limitadas por rol.
15. Existe evidencia mediante capturas de todo el proceso.

---

# Fase 13 - Orden recomendado de ejecución

El orden práctico para implementar todo es:

```text
1. Crear listas SharePoint.
2. Añadir registros iniciales.
3. Crear app desde la lista Contenedores.
4. Añadir las demás listas como orígenes de datos.
5. Crear Dashboard.
6. Crear pantalla Contenedores.
7. Crear pantalla Logs.
8. Crear pantalla Auditoría.
9. Crear flujo Power Automate.
10. Crear job Jenkins parametrizado.
11. Probar Jenkins manualmente.
12. Conectar botones de Power Apps con Power Automate.
13. Probar acción logs.
14. Probar acción restart.
15. Probar acción refresh.
16. Añadir roles básicos.
17. Validar auditoría.
18. Guardar capturas finales.
19. Revisar que no haya secretos visibles.
20. Cerrar documentación.
```

---

# 14. Resultado esperado

Al finalizar este roadmap, SecureNet Cloud contará con una aplicación low-code operativa para tareas básicas de administración.

La solución permitirá:

- Consultar estado de infraestructura.
- Consultar estado de contenedores.
- Ejecutar acciones básicas controladas.
- Consultar logs.
- Registrar auditoría.
- Evitar accesos manuales innecesarios por SSH.
- Mantener separadas las operaciones simples de la infraestructura crítica.

El resultado final será una capa de operación sencilla, segura y trazable integrada con el entorno cloud existente.
