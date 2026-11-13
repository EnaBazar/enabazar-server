#!/bin/bash
set -Eeuo pipefail

APP_DIR="/root/enabazar-server"
BRANCH="main"
LOG_DIR="/var/log/inabazar"
LOG_FILE="$LOG_DIR/deploy.log"
LOCK_FILE="/tmp/inabazar-deploy.lock"

mkdir -p "$LOG_DIR"

exec 9>"$LOCK_FILE"
flock -n 9 || {
    echo "Another deployment is running."
    exit 1
}

exec > >(tee -a "$LOG_FILE") 2>&1

trap 'echo "DEPLOY FAILED at $(date)"' ERR

echo "================================"
echo "INABAZAR AUTO DEPLOY"
date
echo "================================"

cd "$APP_DIR"

# Load Node.js environment
export NVM_DIR="/root/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
    . "$NVM_DIR/nvm.sh"
    nvm use 22.23.4 >/dev/null
fi

# Verify required commands
for cmd in git node pnpm pm2 rsync; do
    command -v "$cmd" >/dev/null || {
        echo "Missing command: $cmd"
        exit 1
    }
done

# Update source code
echo "[1/6] Updating GitHub..."
git pull --ff-only origin "$BRANCH"

# Install dependencies
install_project() {
    echo "Installing $1..."
    cd "$APP_DIR/$1"
    pnpm install --no-frozen-lockfile
}

# Build frontend
build_project() {
    echo "Building $1..."
    cd "$APP_DIR/$1"
    pnpm run build

    if [ ! -f dist/index.html ]; then
        echo "Build output missing: $1/dist/index.html"
        exit 1
    fi
}

# Backend dependencies
echo "[2/6] Backend..."
install_project server

# Customer website
echo "[3/6] Client..."
install_project client
build_project client

# Admin panel
echo "[4/6] Admin..."
install_project admin
build_project admin

# Onion system
echo "[5/6] Onion..."
install_project onionSys
build_project onionSys

# Publish frontend files
echo "[6/6] Publishing websites..."

publish_project() {
    SOURCE="$1/dist/"
    DESTINATION="$2"

    mkdir -p "$DESTINATION"
    rsync -a --delete "$SOURCE" "$DESTINATION/"
    chown -R www-data:www-data "$DESTINATION"
}

publish_project "$APP_DIR/client" "/var/www/inabazar"
publish_project "$APP_DIR/admin" "/var/www/inabazar-admin"
publish_project "$APP_DIR/onionSys" "/var/www/inabazar-onion"

# Restart backend
echo "Restarting backend..."
pm2 restart inabazar_server --update-env
pm2 save

echo "================================"
echo "INABAZAR DEPLOY SUCCESSFUL"
date
echo "================================"
