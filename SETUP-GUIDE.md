# 🚀 Guía de Configuración - SecureNet

## Objetivo

Configurar dos repositorios:
- **`securenet`** (este) → Público para portfolio
- **`securenet-dev`** (nuevo) → Privado para desarrollo con secretos

---

## ✅ Pasos a seguir

### 1. Crear repo privado en GitHub

1. Ve a: https://github.com/new
2. Configuración:
   - **Repository name**: `securenet-dev`
   - **Description**: SecureNet - Repositorio privado de desarrollo
   - **Visibility**: 🔒 **Private**
   - ❌ **NO marques** "Add a README file"
3. Clic en **"Create repository"**

### 2. Ejecutar script de configuración automática

Desde la carpeta actual (repo público `securenet`):

```bash
bash scripts/setup-private-repo.sh
```

Este script:
- Clona el repo público como base
- Lo vincula al repo privado en GitHub
- Hace push inicial al privado
- Copia plantillas `.env.example` y `terraform.tfvars.example`
- Genera certificados SSL locales

### 3. Configurar archivos con credenciales reales (en el repo privado)

```bash
cd ../securenet-dev

# Editar variables de entorno
code .env

# Editar configuración de Terraform
code terraform/terraform.tfvars

# Verificar que los certificados se generaron
ls -la docker/gateway/certs/
```

### 4. Commitear configuración real (solo en privado)

```bash
git add .env terraform/terraform.tfvars docker/gateway/certs/
git commit -m "Add real development configuration"
git push
```

✅ **Listo**: Ahora tienes configuración real en el repo privado.

---

## 💼 Flujo de trabajo diario

### Desarrollo (repo privado)

```bash
cd ~/securenet-dev

# Trabajar normalmente
git add .
git commit -m "feat: nueva funcionalidad"
git push
```

### Sincronizar código al público

Cuando termines una feature y quieras mostrarla en tu portfolio:

```bash
cd ~/securenet-dev

# Ver commits recientes
git log --oneline -10

# Sincronizar un commit específico
bash scripts/sync-to-public.sh <commit-id>
```

El script:
- Verifica que no haya secretos
- Hace cherry-pick del commit al repo público
- Push automático (opcional)

---

## 📁 Estructura de carpetas

```
~/
├── securenet/           ← Repo PÚBLICO (portfolio)
│   ├── .env.example
│   ├── terraform.tfvars.example
│   └── scripts/
└── securenet-dev/       ← Repo PRIVADO (development)
    ├── .env             ← Credenciales reales
    ├── terraform.tfvars ← IDs reales de OCI
    └── docker/gateway/certs/*.key  ← Claves privadas
```

---

## 🔒 Verificación de seguridad

### En el repo público

```bash
cd ~/securenet

# No debe devolver resultados:
git ls-files | grep -E '\.(pem|key|p12|pfx)$|\.env$|tfstate|terraform\.tfvars$'
```

### En el repo privado

```bash
cd ~/securenet-dev

# Debe mostrar tus archivos de config:
git ls-files | grep -E '\.env$|terraform\.tfvars$'
```

---

## CI/CD con GitHub Secrets

Para que el CI/CD funcione en el repo **público** sin exponer secretos:

1. Ve a: `https://github.com/Sniifeerns/securenet/settings/secrets/actions`
2. Añade estos secrets:
   - `DEPLOY_SSH_KEY` - Clave SSH para deploy
   - `DEPLOY_HOST` - IP del servidor
   - `DEPLOY_USER` - Usuario SSH
   - (Otros según necesites: AWS keys, OCI keys, etc.)

3. En `.github/workflows/deploy.yml`, úsalos así:

```yaml
- name: Deploy to server
  env:
    SSH_KEY: ${{ secrets.DEPLOY_SSH_KEY }}
    HOST: ${{ secrets.DEPLOY_HOST }}
  run: |
    # Tu lógica de deploy
```

---

## 📖 Documentación completa

- [SECURITY.md](SECURITY.md) - Seguridad y archivos sensibles
- [REPO-STRATEGY.md](REPO-STRATEGY.md) - Estrategia detallada de dos repos
- [README.md](README.md) - Documentación del proyecto

---

## ❓ FAQ

**¿Puedo trabajar directamente en el repo público?**  
Sí, pero tendrías que configurar `.env` y certificados localmente cada vez (sin commitear). El privado es más cómodo.

**¿Qué pasa si commiteo un secreto por error en el privado?**  
No pasa nada, el privado es tuyo. Solo asegúrate de NO sincronizar ese commit al público.

**¿Qué archivos NUNCA deben ir al público?**  
`.env`, `*.pem`, `*.key`, `*.p12`, `*.pfx`, `terraform.tfvars`, `terraform.tfstate*`, configuraciones con credenciales.

**¿Puedo hacer PR desde el privado al público?**  
Sí, pero GitHub mostrará el link del privado. Mejor usa el script `sync-to-public.sh` que hace cherry-pick limpio.

---

## 🎯 Resumen

| Tarea | Repo |
|-------|------|
| Desarrollo diario | 🔒 Privado (`securenet-dev`) |
| Mostrar en portfolio | 📘 Público (`securenet`) |
| CI/CD con secretos | 🔒 Privado (o público con GitHub Secrets) |
| Commits con `.env` real | 🔒 Solo privado |
| Commits de código limpio | Ambos |

**Mantén el privado para trabajar cómodo, sincroniza al público solo lo que quieras mostrar.**
