# New Relic Setup (Host Agent + AWS Secrets Manager)

Este proyecto ya no usa `newrelic-infra` en Docker.

Ahora el agente de infraestructura de New Relic se instala directamente en la instancia EC2 `docker-aws` y las credenciales se obtienen de forma segura desde AWS Secrets Manager.

## Arquitectura de credenciales

1. Terraform crea el secreto en AWS Secrets Manager (solo metadata).
2. El valor del secreto se guarda en AWS (CLI o consola), no en Git ni en `tfstate`.
3. La EC2 de app (`docker-aws`) lee ese secreto con su rol IAM.
4. Un script local (`/usr/local/bin/securenet-sync-newrelic.sh`) actualiza:
   - `/etc/newrelic-infra.yml` (agente host)
   - `/opt/app/.env` (variables para `docker compose`)

## 1) Aplicar Terraform

Desde `terraform/`:

```bash
terraform init
terraform apply
```

Terraform creará:

- `aws_secretsmanager_secret.securenet_newrelic`
- política IAM de lectura del secreto
- attachment al rol de EC2 usado por Jenkins/App

## 2) Guardar el valor del secreto en AWS

Formato JSON requerido:

```json
{
  "NEW_RELIC_LICENSE_KEY": "eu01x...NRAL",
  "NEW_RELIC_ACCOUNT_ID": "1234567",
  "NEW_RELIC_API_KEY": "NRAK-XXXXXXXXXXXXXXXXXXXX",
  "NEW_RELIC_REGION": "eu",
  "METRICS_LOOKBACK_MINUTES": "5"
}
```

Ejemplo por CLI:

```bash
aws secretsmanager put-secret-value \
  --region eu-west-3 \
  --secret-id securenet/newrelic \
  --secret-string file://newrelic-secret.json
```

## 3) Sincronizar secretos en la EC2 de App

La pipeline de Jenkins ya llama automáticamente:

```bash
sudo /usr/local/bin/securenet-sync-newrelic.sh
```

Si quieres lanzarlo manualmente en la instancia `docker-aws`:

```bash
sudo /usr/local/bin/securenet-sync-newrelic.sh
sudo systemctl status newrelic-infra
```

## 4) Verificar métricas

```bash
curl -k https://<host>/api/health
curl -k https://<host>/api/metrics
```

## Comprobaciones útiles

```bash
# Agente host
sudo systemctl status newrelic-infra
sudo journalctl -u newrelic-infra -n 100 --no-pager

# Variables de runtime en la app host
sudo ls -l /opt/app/.env
sudo head -n 5 /opt/app/.env
```

## Notas de seguridad

- No guardar claves reales en `.env` del repositorio.
- No guardar claves de New Relic en Jenkins Credentials para este flujo.
- Rotación recomendada: actualizar el secreto en AWS y re-ejecutar `securenet-sync-newrelic.sh`.
