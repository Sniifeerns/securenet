# Limpieza y resync de New Relic (modo host)

Este proyecto ya no usa `newrelic-infra` en Docker.

Si las métricas muestran datos antiguos o incompletos, usa este procedimiento en la EC2 `docker-aws`.

## 1) Regenerar variables y configuración desde Secrets Manager

```bash
sudo /usr/local/bin/securenet-sync-newrelic.sh
```

## 2) Reiniciar el agente host

```bash
sudo systemctl restart newrelic-infra
sudo systemctl status newrelic-infra
```

## 3) Limpiar y relanzar contenedores de la app

```bash
cd /opt/app
docker compose down
docker compose pull
docker compose up -d --remove-orphans
```

## 4) Verificar logs

```bash
sudo journalctl -u newrelic-infra -n 100 --no-pager
docker compose logs -f api
```

## 5) Verificar endpoints

```bash
curl -k https://localhost/api/health
curl -k https://localhost/api/metrics
```

## Notas

- Si has rotado la API key/license key en New Relic, primero actualiza el secreto en AWS y luego ejecuta el paso 1.
- En New Relic puede tardar unos minutos en reflejar entidades nuevas o limpiezas.
