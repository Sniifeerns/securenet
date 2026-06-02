# SecureNet

SecureNet es un proyecto personal desarrollado y mantenido por **Javier Naranjo**.

El objetivo del proyecto es construir una plataforma web desplegable en cloud que combine frontend, API, gateway, automatizacion, CI/CD, observabilidad e infraestructura como codigo. El foco actual esta en tener un entorno reproducible, seguro y facil de reconstruir desde cero con Terraform, Docker, Jenkins, AWS y New Relic.

Este repositorio contiene codigo fuente, configuracion de despliegue y plantillas. No contiene credenciales reales, claves privadas, ficheros `.env`, `terraform.tfvars` ni estados de Terraform.

---

## Objetivos

- Crear una aplicacion web moderna con React y Vite.
- Exponer la aplicacion mediante un gateway Nginx como punto unico de entrada.
- Separar servicios en contenedores Docker: frontend, API, gateway y n8n.
- Automatizar builds y despliegues con Jenkins.
- Publicar imagenes Docker en AWS ECR.
- Provisionar infraestructura AWS con Terraform.
- Gestionar credenciales de New Relic con AWS Secrets Manager.
- Instalar y configurar New Relic Infrastructure Agent automaticamente en la maquina Docker.
- Mantener el repositorio limpio de secretos y estado local.
- Poder destruir y recrear la infraestructura completa con `terraform destroy` y `terraform apply`.

---

## Arquitectura Actual

```text
Usuario
  |
  v
Route 53 + ALB + HTTPS
  |
  v
EC2 docker-aws
  |
  +-- gateway  (Nginx reverse proxy)
  +-- frontend (React/Vite servido por Nginx)
  +-- api      (Node.js/Express)
  +-- n8n      (automatizacion)
  |
  +-- newrelic-infra agent en el host

EC2 jenkins-aws
  |
  +-- Jenkins
  +-- Build de imagenes
  +-- Push a AWS ECR
  +-- Deploy por SSH hacia docker-aws
```

La infraestructura AWS se define en `terraform/` y el despliegue de contenedores se define en:

- `docker-compose.yml`: entorno local.
- `docker-compose.ecr.yml`: entorno desplegado desde imagenes en ECR.

---

## Tecnologias

### Frontend

- React 18
- Vite
- Tailwind CSS
- Radix UI
- Framer Motion
- Recharts
- Lucide React

### Backend y API

- Node.js
- Express
- API de metricas y healthcheck
- Variables de entorno para integracion con New Relic

### Contenedores

- Docker
- Docker Compose
- Nginx como gateway
- Imagenes separadas para frontend, API y gateway
- n8n como servicio de automatizacion

### Cloud e infraestructura

- AWS EC2
- AWS ECR
- AWS IAM
- AWS ALB
- AWS ACM
- AWS Route 53
- AWS Secrets Manager
- Terraform

### CI/CD

- Jenkins en EC2
- Pipeline declarativo con `Jenkinsfile`
- Build y push de imagenes a ECR
- Deploy remoto sobre la EC2 Docker mediante SSH

### Observabilidad

- New Relic Infrastructure Agent
- New Relic API/NerdGraph para metricas
- Secrets Manager como fuente de credenciales
- Docker labels para identificar servicios monitorizados

---

## Estructura del Repositorio

```text
securenet/
  src/                         Frontend React
  server/                      API Node/Express
  docker/                      Dockerfiles y configuracion Nginx
  terraform/                   Infraestructura AWS como codigo
  public/                      Recursos estaticos
  scripts/                     Scripts auxiliares
  docs/                        Documentacion adicional
  docker-compose.yml           Compose local
  docker-compose.ecr.yml       Compose de produccion con imagenes ECR
  Jenkinsfile                  Pipeline CI/CD
  README.md                    Documentacion principal
```

---

## Infraestructura con Terraform

Terraform crea y gestiona:

- EC2 para Jenkins.
- EC2 para Docker/App.
- Security Groups.
- Key Pair SSH.
- IAM Roles e Instance Profiles.
- Repositorios ECR.
- ALB y Target Group.
- Certificado ACM validado por DNS.
- Registro Route 53.
- Secreto de New Relic en Secrets Manager.
- Version del secreto con el JSON real de credenciales.

Archivos principales:

- `terraform/providers.tf`
- `terraform/variables.tf`
- `terraform/aws_compute.tf`
- `terraform/aws_ecr.tf`
- `terraform/aws_iam.tf`
- `terraform/alb.tf`
- `terraform/newrelic.tf`
- `terraform/scripts/docker_app.sh`
- `terraform/scripts/jenkins_app.sh`

### Variables locales

Crear el archivo local:

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Rellenar `terraform.tfvars` con valores reales:

```hcl
environment = "dev"

aws_region       = "eu-west-3"
ssh_allowed_cidr = "TU_IP_PUBLICA/32"
ssh_public_key   = "ssh-ed25519 TU_CLAVE_PUBLICA"

new_relic_secret_name    = "securenet/newrelic"
new_relic_license_key    = "TU_NEW_RELIC_LICENSE_KEY"
new_relic_account_id     = "TU_NEW_RELIC_ACCOUNT_ID"
new_relic_api_key        = "TU_NEW_RELIC_API_KEY"
new_relic_region         = "EU"
metrics_lookback_minutes = 30
```

`terraform.tfvars` no debe subirse al repositorio.

### Comandos

```bash
cd terraform
terraform fmt
terraform validate
terraform plan
terraform apply
```

Para reconstruir todo desde cero:

```bash
terraform destroy
terraform apply
```

---

## New Relic

New Relic no se configura manualmente en Jenkins.

El flujo actual es:

1. Terraform crea el secreto `securenet/newrelic`.
2. Terraform crea una version del secreto con las claves reales.
3. La EC2 `docker-aws` arranca con `docker_app.sh`.
4. El script instala Docker, AWS CLI, `jq`, Docker Compose y New Relic Infrastructure Agent.
5. El script crea `/usr/local/bin/securenet-sync-newrelic.sh`.
6. Ese script lee Secrets Manager.
7. Genera `/etc/newrelic-infra.yml`.
8. Genera `/opt/app/.env`.
9. Reinicia `newrelic-infra`.

Validaciones utiles en `docker-aws`:

```bash
sudo systemctl status newrelic-infra --no-pager
sudo journalctl -u newrelic-infra -n 80 --no-pager
sudo cat /etc/newrelic-infra.yml
sudo grep -E '^(NEW_RELIC_ACCOUNT_ID|NEW_RELIC_REGION|METRICS_LOOKBACK_MINUTES)=' /opt/app/.env
```

En los logs, una conexion correcta muestra mensajes como:

```text
New Relic infrastructure agent is running.
connect got id
Integration health check finished with success
```

---

## Jenkins

Jenkins usa el IAM Role de la EC2 para trabajar con AWS y ECR. No necesita claves de New Relic.

La unica credencial manual necesaria en Jenkins para el pipeline actual es:

```text
ID: id_jenkins
Tipo: SSH Username with private key
Username: ec2-user
Private key: clave privada que corresponde a ssh_public_key
```

El `Jenkinsfile` utiliza:

```groovy
sshagent(credentials: ['id_jenkins'])
```

Flujo del pipeline:

1. Login en AWS ECR.
2. Build de imagenes:
   - `securenet-api`
   - `securenet-frontend`
   - `securenet-gateway`
3. Push a ECR.
4. Localiza la EC2 `docker-aws`.
5. Copia `docker-compose.ecr.yml` a `/opt/app/docker-compose.yml`.
6. Ejecuta `securenet-sync-newrelic.sh` en la EC2 Docker.
7. Hace login en ECR desde la EC2 Docker.
8. Ejecuta `docker compose pull`.
9. Ejecuta `docker compose up -d --remove-orphans`.

---

## Desarrollo Local

Instalar dependencias:

```bash
npm install
```

Arrancar frontend:

```bash
npm run dev
```

Arrancar API de metricas:

```bash
npm run dev:metrics
```

Arrancar frontend y API juntos:

```bash
npm run dev:all
```

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

---

## Docker Local

Levantar servicios locales:

```bash
docker compose up -d --build
```

Ver estado:

```bash
docker compose ps
```

Ver logs:

```bash
docker compose logs --tail=100
```

Parar:

```bash
docker compose down
```

---

## Seguridad

Este repositorio esta pensado para poder ser publico sin exponer informacion privada.

No se deben subir:

- `.env`
- `terraform.tfvars`
- `*.tfstate`
- `*.tfstate.backup`
- claves privadas `.pem`
- certificados privados reales
- bases de datos locales de n8n
- secretos de New Relic
- credenciales AWS

Archivos seguros para versionar:

- `terraform.tfvars.example`
- codigo fuente
- Dockerfiles
- scripts sin credenciales
- configuraciones con placeholders

Antes de subir cambios, revisar:

```bash
git status --short --ignored
git diff --cached
```

---

## Estado Actual

- Infraestructura AWS reproducible con Terraform.
- Despliegue Docker preparado para ECR.
- Jenkins integrado con ECR y despliegue remoto.
- New Relic configurado desde Secrets Manager.
- EC2 Docker capaz de autoconfigurarse tras `terraform apply`.
- `terraform destroy` + `terraform apply` probado correctamente.
- `terraform plan` final sin cambios tras la reconstruccion.

---

## Autor

**Javier Naranjo**

Proyecto personal de infraestructura, cloud, CI/CD, observabilidad y desarrollo web.
