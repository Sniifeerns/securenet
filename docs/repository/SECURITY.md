# Configuración de Seguridad - SecureNet

## ¿Qué archivos NUNCA deben subirse al repositorio?

| Archivo / Patrón | Motivo |
|---|---|
| `*.pem`, `*.key`, `*.p12`, `*.pfx` | Claves privadas |
| `docker/gateway/certs/` | Certificados SSL locales |
| `.env`, `.env.production`, `.env.*` | Variables de entorno con secretos |
| `terraform/*.tfstate*` | Estado de infraestructura (contiene IDs y datos sensibles) |
| `terraform/*.tfvars` | Variables de Terraform con IDs reales de cloud |
| `node_modules/` | Dependencias (se instalan con `npm install`) |
| `privkey.pem` | Clave privada RSA |

## Configuración inicial tras clonar

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Edita .env con tus valores
```

### 3. Generar certificados SSL para desarrollo
```bash
chmod +x scripts/generate-certs.sh
./scripts/generate-certs.sh
```

### 4. Configurar Terraform (si aplica)
```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edita terraform.tfvars con tus IDs reales de OCI/AWS
```

### 5. Instalar hook de pre-commit (protección contra secretos)
```bash
cp scripts/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

## Verificar que no hay secretos trackeados
```bash
git ls-files | grep -E '\.(pem|key|p12|pfx)$|tfstate|tfvars$|\.env$'
```
Si este comando devuelve resultados, hay archivos sensibles trackeados.

## ¿Qué hacer si commiteaste un secreto por error?

1. Elimínalo del tracking: `git rm --cached <archivo>`
2. Asegúrate de que está en `.gitignore`
3. Haz commit del cambio
4. **ROTA EL SECRETO** - si se subió a GitHub, considéralo comprometido
