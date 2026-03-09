#!/bin/bash
# ========================
# Sincroniza código limpio del repo privado al público
# ========================
# Uso: ./scripts/sync-to-public.sh [commit-id]
# Ejecutar desde el repo PRIVADO (securenet-dev)

set -e

PUBLIC_REMOTE="public"
PUBLIC_REPO="https://github.com/Sniifeerns/securenet.git"

# Verificar que estamos en el repo privado
if git remote -v | grep -q "securenet-dev"; then
    echo "✅ Repo privado detectado"
else
    echo "⚠️  Advertencia: No parece ser el repo privado (securenet-dev)"
    read -p "¿Continuar? (s/n): " continue
    if [ "$continue" != "s" ]; then
        exit 0
    fi
fi

# Verificar que el remote público existe
if ! git remote | grep -q "^$PUBLIC_REMOTE$"; then
    echo "📌 Añadiendo remote '$PUBLIC_REMOTE'..."
    git remote add "$PUBLIC_REMOTE" "$PUBLIC_REPO"
fi

# Verificar archivos sensibles antes de sincronizar
echo ""
echo "🔍 Verificando que no hay secretos en el stage..."

FORBIDDEN_FILES=$(git diff --cached --name-only | grep -E '\.(pem|key|p12|pfx|jks)$|\.env$|terraform\.tfvars$|terraform\.tfstate' || true)

if [ -n "$FORBIDDEN_FILES" ]; then
    echo "❌ ERROR: Archivos sensibles detectados en stage:"
    echo "$FORBIDDEN_FILES"
    echo ""
    echo "Elimínalos del stage antes de sincronizar:"
    echo "  git reset HEAD <archivo>"
    exit 1
fi

echo "✅ Sin archivos sensibles en stage"

# Obtener el commit a sincronizar
COMMIT_ID="$1"
if [ -z "$COMMIT_ID" ]; then
    echo ""
    echo "📋 Últimos commits:"
    git log --oneline -10
    echo ""
    read -p "ID del commit a sincronizar (o 'HEAD' para el último): " COMMIT_ID
    
    if [ -z "$COMMIT_ID" ]; then
        echo "❌ Debes especificar un commit"
        exit 1
    fi
fi

# Confirmar
echo ""
echo "🎯 Operación:"
echo "   - Commit: $COMMIT_ID"
echo "   - Destino: $PUBLIC_REMOTE/main (repo público)"
echo ""
git show --stat "$COMMIT_ID"
echo ""
read -p "¿Sincronizar este commit al repo público? (s/n): " confirm

if [ "$confirm" != "s" ] && [ "$confirm" != "S" ]; then
    echo "Cancelado."
    exit 0
fi

# Hacer cherry-pick del commit al branch main del público
echo ""
echo "🔄 Sincronizando..."

# Fetch del público
git fetch "$PUBLIC_REMOTE"

# Crear branch temporal
TEMP_BRANCH="sync-to-public-$(date +%s)"
git checkout -b "$TEMP_BRANCH" "$PUBLIC_REMOTE/main"

# Cherry-pick
if git cherry-pick "$COMMIT_ID"; then
    echo "✅ Cherry-pick exitoso"
else
    echo "❌ Conflictos detectados. Resuélvelos y ejecuta:"
    echo "   git cherry-pick --continue"
    echo "   git push $PUBLIC_REMOTE $TEMP_BRANCH:main"
    echo "   git checkout main"
    echo "   git branch -D $TEMP_BRANCH"
    exit 1
fi

# Push al público
echo ""
read -p "¿Push al repo público ahora? (s/n): " push_confirm

if [ "$push_confirm" = "s" ] || [ "$push_confirm" = "S" ]; then
    git push "$PUBLIC_REMOTE" "$TEMP_BRANCH":main
    echo "✅ Sincronizado al repo público"
else
    echo "⏸️  Push cancelado. Puedes hacerlo manualmente:"
    echo "   git push $PUBLIC_REMOTE $TEMP_BRANCH:main"
fi

# Volver al branch original
git checkout main
git branch -D "$TEMP_BRANCH"

echo ""
echo "✅ SINCRONIZACIÓN COMPLETADA"
echo ""
echo "📘 Repo público actualizado:"
echo "   https://github.com/Sniifeerns/securenet"
