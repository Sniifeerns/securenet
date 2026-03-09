# Estrategia de Repositorios - SecureNet

## Configuración de dos repos

### 📘 Repo PÚBLICO (`Sniifeerns/securenet`) - PORTFOLIO
- **Propósito**: Mostrar tu trabajo, código limpio, documentación
- **Contenido**: Todo lo que está en este repo actualmente
- **Prohibido**: Claves privadas, certificados, `.env` reales, `terraform.tfvars` reales, credenciales
- **CI/CD**: Usa GitHub Secrets para deploy

### 🔒 Repo PRIVADO (`Sniifeerns/securenet-dev`) - DESARROLLO
- **Propósito**: Trabajo diario con secretos, pruebas, configuraciones reales
- **Contenido**: Código + archivos `.env`, `terraform.tfvars`, certificados, claves privadas
- **Ventaja**: Puedes commitear configuraciones reales sin miedo
- **CI/CD**: Pipelines completos con acceso a secretos

---

## Flujo de trabajo

```
┌─────────────────────────────┐
│  securenet-dev (PRIVADO)    │
│  - Desarrollo diario        │
│  - Config real (.env, keys) │
│  - Commits frecuentes       │
└──────────────┬──────────────┘
               │
               │ Solo código limpio →
               ↓
┌─────────────────────────────┐
│  securenet (PÚBLICO)        │
│  - Sin secretos             │
│  - Portfolio                │
│  - .example files           │
└─────────────────────────────┘
```

---

## Configuración inicial

### Paso 1: Crear repo privado en GitHub
```bash
# En GitHub: New Repository
# - Nombre: securenet-dev
# - Visibilidad: Private
# - No inicializar (sin README)
```

### Paso 2: Clonar este repo público como base para el privado
```bash
cd ..
git clone https://github.com/Sniifeerns/securenet.git securenet-dev
cd securenet-dev
```

### Paso 3: Cambiar el remote al repo privado
```bash
git remote set-url origin https://github.com/Sniifeerns/securenet-dev.git
git push -u origin main
```

### Paso 4: Configurar archivos reales en el privado
```bash
# Crear archivos con credenciales reales
cp .env.example .env
# Edita .env con valores reales

cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edita terraform.tfvars con IDs reales de OCI

# Generar certificados
cd ..
bash scripts/generate-certs.sh

# Ahora puedes commitear en el privado sin miedo
git add .env terraform/terraform.tfvars docker/gateway/certs/
git commit -m "Add real config for development"
git push
```

---

## Sincronización: Privado → Público

Cuando termines features en el privado y quieras mostrarlas en el público:

```bash
# En securenet-dev (privado)
git log --oneline -5  # Ver commits

# Añadir el público como remote adicional
git remote add public https://github.com/Sniifeerns/securenet.git

# Cherry-pick solo commits de código (sin secretos)
git checkout main
git cherry-pick ABC123  # ID del commit con código limpio

# Push al público
git push public main
```

O más simple: copiar archivos manualmente entre carpetas.

---

## Checklist antes de push al público

- [ ] No hay archivos `.env` (solo `.env.example`)
- [ ] No hay `*.pem`, `*.key`, `*.p12`, `*.pfx`
- [ ] No hay `terraform.tfvars` (solo `.example`)
- [ ] No hay `terraform.tfstate*`
- [ ] No hay `docker/gateway/certs/` con claves reales
- [ ] `node_modules/` no está commiteado
- [ ] GitHub Actions usa `secrets.*` para credenciales
- [ ] Ejecutar: `git ls-files | grep -E '\.(pem|key|env|tfvars)$'` → debe dar 0 resultados (excepto .example)

---

## GitHub Secrets para CI/CD (repo público)

Configura en `Settings → Secrets and variables → Actions`:

```
SECRETS NECESARIOS:
- DEPLOY_SSH_KEY: Clave SSH para conectar al servidor
- DEPLOY_HOST: IP del servidor
- DEPLOY_USER: Usuario SSH
- AWS_ACCESS_KEY_ID: (si usas AWS)
- AWS_SECRET_ACCESS_KEY: (si usas AWS)
- OCI_PRIVATE_KEY: (si despliegas en OCI)
```

En `.github/workflows/deploy.yml`:
```yaml
- name: Deploy
  env:
    SSH_KEY: ${{ secrets.DEPLOY_SSH_KEY }}
    HOST: ${{ secrets.DEPLOY_HOST }}
  run: |
    # Usa las variables de secrets
```

---

## Ventajas de esta estrategia

✅ Portfolio público sin exponer secretos  
✅ Desarrollo cómodo en privado con config real  
✅ CI/CD funciona en ambos (con GitHub Secrets en público)  
✅ Control total sobre qué expones  
✅ No necesitas limpiar historial constantemente  

---

## Archivos por repo

| Archivo | Público | Privado |
|---------|---------|---------|
| Código fuente (`src/`, `components/`) | ✅ | ✅ |
| `package.json`, `docker-compose.yml` | ✅ | ✅ |
| `.env.example` | ✅ | ✅ |
| `.env` | ❌ | ✅ |
| `terraform/main.tf` | ✅ | ✅ |
| `terraform.tfvars.example` | ✅ | ✅ |
| `terraform.tfvars` | ❌ | ✅ |
| `privkey.pem`, `*.key` | ❌ | ✅ |
| `docker/gateway/certs/*.key` | ❌ | ✅ |
| `.gitignore` | ✅ | ✅ (mismo) |
| `README.md`, `SECURITY.md` | ✅ | ✅ |
