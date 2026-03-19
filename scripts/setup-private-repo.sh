#!/bin/bash
# ========================
# Script para crear el repo privado de desarrollo
# ========================
# Uso: ./scripts/setup-private-repo.sh

set -e

PRIVATE_REPO_NAME="securenet-dev"
GITHUB_USER="Sniifeerns"

echo "==========================================
Configuración de Repo Privado para Desarrollo
=========================================="

# Verificar que estamos en el repo público
if [ ! -f "docs/repository/REPO-STRATEGY.md" ]; then
    echo "❌ Error: Ejecuta este script desde el directorio del repo público"
    exit 1
fi

echo ""
echo "📋 PASO 1: Crear repo privado en GitHub"
echo "----------------------------------------"
echo "1. Ve a: https://github.com/new"
echo "2. Repository name: $PRIVATE_REPO_NAME"
echo "3. Description: SecureNet - Repositorio privado de desarrollo"
echo "4. Visibility: 🔒 Private"
echo "5. NO marques 'Add a README file'"
echo "6. Clic en 'Create repository'"
echo ""
read -p "¿Has creado el repo privado en GitHub? (s/n): " created

if [ "$created" != "s" ] && [ "$created" != "S" ]; then
    echo "Crea primero el repo y vuelve a ejecutar este script."
    exit 0
fi

echo ""
echo "📦 PASO 2: Clonar repo público como base"
echo "----------------------------------------"
cd ..
if [ -d "$PRIVATE_REPO_NAME" ]; then
    echo "⚠️  La carpeta $PRIVATE_REPO_NAME ya existe."
    read -p "¿Eliminar y recrear? (s/n): " delete
    if [ "$delete" = "s" ] || [ "$delete" = "S" ]; then
        rm -rf "$PRIVATE_REPO_NAME"
    else
        echo "Abortado."
        exit 0
    fi
fi

git clone "https://github.com/$GITHUB_USER/securenet.git" "$PRIVATE_REPO_NAME"
cd "$PRIVATE_REPO_NAME"

echo ""
echo "🔗 PASO 3: Cambiar remote al repo privado"
echo "----------------------------------------"
git remote set-url origin "https://github.com/$GITHUB_USER/$PRIVATE_REPO_NAME.git"
git remote -v

echo ""
echo "☁️  PASO 4: Push al repo privado"
echo "----------------------------------------"
git push -u origin main

echo ""
echo "📝 PASO 5: Configurar archivos con secretos reales"
echo "----------------------------------------"

# Copiar plantillas
cp .env.example .env
cp terraform/terraform.tfvars.example terraform/terraform.tfvars

echo "✅ Archivos creados:"
echo "   - .env (edita con valores reales)"
echo "   - terraform/terraform.tfvars (edita con IDs reales)"

# Generar certificados
echo ""
echo "🔐 Generando certificados SSL..."
bash scripts/generate-certs.sh

echo ""
echo "✅ CONFIGURACIÓN COMPLETADA"
echo "=========================================="
echo ""
echo "📂 Tienes ahora dos repos:"
echo ""
echo "   📘 PÚBLICO (portfolio):"
echo "      $HOME/securenet/"
echo "      https://github.com/$GITHUB_USER/securenet"
echo ""
echo "   🔒 PRIVADO (desarrollo):"
echo "      $HOME/$PRIVATE_REPO_NAME/"
echo "      https://github.com/$GITHUB_USER/$PRIVATE_REPO_NAME"
echo ""
echo "🎯 SIGUIENTES PASOS:"
echo ""
echo "1. Edita archivos de configuración en el repo PRIVADO:"
echo "   cd ../$PRIVATE_REPO_NAME"
echo "   code .env"
echo "   code terraform/terraform.tfvars"
echo ""
echo "2. Commitea la configuración real (solo en privado):"
echo "   git add .env terraform/terraform.tfvars docker/gateway/certs/"
echo "   git commit -m 'Add real development configuration'"
echo "   git push"
echo ""
echo "3. Trabaja en el repo PRIVADO día a día"
echo "4. Sincroniza solo código limpio al PÚBLICO cuando termines features"
echo ""
echo "Lee docs/repository/REPO-STRATEGY.md para más detalles."
