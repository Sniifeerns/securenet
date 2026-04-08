# 🔧 Configuración de New Relic

## Obtener credenciales de New Relic

### 1. License Key (NRIA_LICENSE_KEY)

Esta clave se usa para el agente de infraestructura que monitorea el host.

1. Ve a https://one.newrelic.com/
2. Click en tu nombre (esquina superior derecha) → **Administration**
3. En el menú lateral: **API Keys**
4. Busca la sección **Ingest - License**
5. Copia la clave (comienza con algo como `eu01xx...` para Europa)

```bash
# En tu .env
NEW_RELIC_LICENSE_KEY=eu01xf1515937b5bd9bf63c6448fc57191c7NRAL
```

### 2. Account ID (NEW_RELIC_ACCOUNT_ID)

Este ID identifica tu cuenta en New Relic.

1. Estando en https://one.newrelic.com/
2. Mira la URL: `https://one.newrelic.com/accounts/{ACCOUNT_ID}/...`
3. El número después de `/accounts/` es tu Account ID

```bash
# En tu .env
NEW_RELIC_ACCOUNT_ID=7875275
```

### 3. API Key (NEW_RELIC_API_KEY) - **NUEVO**

Esta clave se usa para hacer queries a la API de New Relic (NerdGraph/GraphQL).

1. Ve a https://one.newrelic.com/
2. Click en tu nombre (esquina superior derecha) → **Administration** → **API Keys**
3. Click en **Create a key** (botón arriba a la derecha)
4. Configuración:
   - **Key type**: User
   - **Name**: `securenet-metrics-api` (o el nombre que prefieras)
   - **Description**: API key for SecureNet metrics dashboard
5. Click en **Create a key**
6. **¡IMPORTANTE!** Copia la clave inmediatamente (solo se muestra una vez)
   - Formato: `NRAK-XXXXXXXXXXXXXXXXXXXXX`

```bash
# En tu .env
NEW_RELIC_API_KEY=NRAK-XXXXXXXXXXXXXXXXXXXXX
```

## Archivo .env completo

Tu archivo `.env` debe verse así:

```bash
VITE_METRICS_API=/api

NEW_RELIC_LICENSE_KEY=eu01xf1515937b5bd9bf63c6448fc57191c7NRAL
NEW_RELIC_ACCOUNT_ID=7875275
NEW_RELIC_API_KEY=NRAK-XXXXXXXXXXXXXXXXXXXXX
```

## Verificar que funciona

### 1. Reiniciar el contenedor de New Relic Infra

```bash
docker compose restart newrelic-infra
docker compose logs newrelic-infra
```

Deberías ver:
```
time="..." level=info msg="New Relic infrastructure agent initialized"
```

### 2. Reiniciar el contenedor de la API

```bash
docker compose restart api
docker compose logs api
```

### 3. Probar el endpoint de métricas

```bash
curl -k https://localhost/api/metrics
```

Deberías recibir JSON con esta estructura:

```json
{
  "ok": true,
  "host": {
    "cpu": "4.2",
    "memory": "45.6",
    "disk": "23.1",
    "netInBps": 12345,
    "netOutBps": 6789,
    "load1": "1.5",
    "load5": "1.2"
  },
  "containers": [
    {
      "name": "securenet-gateway-1",
      "cpu": "2.1",
      "memory": "128"
    },
    {
      "name": "securenet-frontend-1",
      "cpu": "0.5",
      "memory": "64"
    }
  ],
  "threats": 0,
  "updatedAt": "2026-04-01T15:45:00.000Z"
}
```

## Troubleshooting

### Error: "Missing NEW_RELIC_API_KEY"

- Asegúrate de que el archivo `.env` existe en la raíz del proyecto
- Verifica que la variable `NEW_RELIC_API_KEY` está definida
- Reinicia el contenedor de API: `docker compose restart api`

### Error: "New Relic API error: 403"

- La API Key es inválida o ha expirado
- Crea una nueva API Key siguiendo los pasos anteriores
- Verifica que la key tiene permisos de NerdGraph

### No se ven métricas del host

- Verifica que el contenedor `newrelic-infra` está corriendo: `docker compose ps`
- Revisa los logs: `docker compose logs newrelic-infra`
- Espera 1-2 minutos para que New Relic empiece a recibir datos
- Verifica en New Relic: https://one.newrelic.com/infrastructure

### No se ven contenedores

- Asegúrate de que Docker está corriendo
- Verifica que `/var/run/docker.sock` está montado en el contenedor de New Relic
- Los contenedores pueden tardar unos minutos en aparecer en New Relic

## Permisos de la API Key

La API Key debe tener acceso a:
- ✅ **NerdGraph** - Para hacer queries GraphQL
- ✅ **Read access** - Para leer métricas

Si creaste la key como "User Key", ya tiene estos permisos por defecto.

## Referencias

- [New Relic API Keys Documentation](https://docs.newrelic.com/docs/apis/intro-apis/new-relic-api-keys/)
- [New Relic Infrastructure Agent](https://docs.newrelic.com/docs/infrastructure/install-infrastructure-agent/get-started/install-infrastructure-agent/)
- [NerdGraph API Explorer](https://api.newrelic.com/graphiql)
