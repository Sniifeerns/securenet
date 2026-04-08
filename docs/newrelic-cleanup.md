# Script para limpiar contenedores duplicados en New Relic

## Pasos para limpiar contenedores fantasma:

1. **Detener todos los contenedores actuales:**
   ```bash
   docker-compose down -v
   ```

2. **Limpiar todos los contenedores e imágenes huérfanas:**
   ```bash
   docker system prune -a --volumes
   ```

3. **Verificar que no queden contenedores:**
   ```bash
   docker ps -a
   ```

4. **Levantar los contenedores con la nueva configuración:**
   ```bash
   docker-compose up -d
   ```

5. **Verificar logs del agente de New Relic:**
   ```bash
   docker-compose logs -f newrelic-infra
   ```

## Esperar que New Relic actualice (5-10 minutos)

Los contenedores antiguos deberían marcarse automáticamente como "stopped" después de unos minutos.
Si persisten, puedes ocultarlos en la UI de New Relic.

## Verificar métricas

Las métricas de contenedores deberían aparecer en:
- Infrastructure > Containers
- Dashboards > Infrastructure > Containers

## Troubleshooting

Si las métricas no aparecen después de 10 minutos:

1. Verificar que el agente tiene permisos al socket Docker:
   ```bash
   docker-compose exec newrelic-infra ls -la /var/run/docker.sock
   ```

2. Verificar configuración de integración:
   ```bash
   docker-compose exec newrelic-infra cat /etc/newrelic-infra/integrations.d/docker-config.yml
   ```

3. Habilitar logs verbose temporalmente editando docker-compose.yml:
   ```yaml
   - NRIA_VERBOSE=1
   ```
