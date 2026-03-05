#!/usr/bin/env bash
# ════════════════════════════════════════════════════════════════════════════
#  start-backend.sh  —  One-command backend launcher for OnlineShop
#
#  SETUP (one time only):
#    1. Add PAYARA_HOME to your .env file (see .env section below)
#    2. chmod +x start-backend.sh
#
#  DAILY USE:
#    ./start-backend.sh           — start DB + Payara + build + deploy
#    ./start-backend.sh --stop    — stop everything
#    ./start-backend.sh --redeploy — only rebuild WAR and redeploy (Payara stays up)
# ════════════════════════════════════════════════════════════════════════════

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# ── Load .env ─────────────────────────────────────────────────────────────────
if [ -f "$SCRIPT_DIR/.env" ]; then
    set -a
    source "$SCRIPT_DIR/.env"
    set +a
else
    echo "✖  .env file not found in $SCRIPT_DIR"
    exit 1
fi

# ── CONFIG — all values come from .env ───────────────────────────────────────
PAYARA_HOME="${PAYARA_HOME:?'PAYARA_HOME is not set in .env'}"
ASADMIN="$PAYARA_HOME/bin/asadmin"
BACKEND_DIR="$SCRIPT_DIR/backend"
APP_NAME="onlineShop"
DB_POOL="PostgresPool"
DB_RESOURCE="jdbc/postgres"
ADMIN_PORT="${PAYARA_ADMIN_PORT:-4848}"

# ── Helpers ───────────────────────────────────────────────────────────────────
log()  { echo -e "\033[0;36m▶  $*\033[0m"; }
ok()   { echo -e "\033[0;32m✔  $*\033[0m"; }
err()  { echo -e "\033[0;31m✖  $*\033[0m"; exit 1; }

check_payara() {
    [ -x "$ASADMIN" ] || err "asadmin not found at $ASADMIN — check PAYARA_HOME in .env"
}

# Wait until Payara's admin port 4848 is actually accepting connections.
# Without this, asadmin commands fire too early and get "server not listening".
wait_for_admin_port() {
    log "Waiting for Payara admin port $ADMIN_PORT to be ready..."
    local attempts=0
    local max=30   # 30 × 2s = 60s timeout
    while ! nc -z localhost "$ADMIN_PORT" 2>/dev/null; do
        attempts=$((attempts + 1))
        if [ $attempts -ge $max ]; then
            err "Payara admin port $ADMIN_PORT did not open after 60s. Check Payara logs."
        fi
        sleep 2
    done
    # Give it one extra second for the remote admin listener to fully initialize
    sleep 1
    ok "Payara admin port is ready"
}

domain_running() {
    # Use nc instead of asadmin to avoid chicken-and-egg problem
    nc -z localhost "$ADMIN_PORT" 2>/dev/null
}

# ── Start Docker database ─────────────────────────────────────────────────────
start_docker_db() {
    if docker ps 2>/dev/null | grep -q "postgres"; then
        ok "PostgreSQL already running"
    else
        log "Starting PostgreSQL via Docker Compose..."
        cd "$SCRIPT_DIR"
        docker-compose -f database/docker-compose.yaml up -d --build 2>/dev/null \
            || docker compose -f database/docker-compose.yaml up -d --build 2>/dev/null \
            || err "docker-compose failed — is Docker running?"
        log "Waiting for PostgreSQL to be ready..."
        sleep 4
        ok "PostgreSQL started"
    fi
}

# ── Start frontend ────────────────────────────────────────────────────────────
start_frontend() {
    if lsof -i :${FRONTEND_PORT:-80} >/dev/null 2>&1; then
        ok "Frontend already running on port ${FRONTEND_PORT:-80}"
    else
        log "Starting frontend on port ${FRONTEND_PORT:-80}..."
        cd "$SCRIPT_DIR/frontend"
        if [ ! -d "node_modules" ]; then
            log "Installing npm dependencies..."
            npm install >/dev/null 2>&1
        fi
        # Start in background with environment variables
        (export FRONTEND_PORT=${FRONTEND_PORT:-80} VITE_API_URL=${VITE_API_URL:-http://localhost:8080} && npm run dev) >/dev/null 2>&1 &
        sleep 3
        ok "Frontend started on port ${FRONTEND_PORT:-80}"
    fi
}

# ── Stop everything ───────────────────────────────────────────────────────────
if [ "$1" = "--stop" ]; then
    check_payara
    log "Stopping Payara..."
    "$ASADMIN" stop-domain domain1 || true
    log "Stopping PostgreSQL..."
    cd "$SCRIPT_DIR"
    docker-compose -f database/docker-compose.yaml down 2>/dev/null \
        || docker compose -f database/docker-compose.yaml down 2>/dev/null \
        || true
    log "Stopping frontend..."
    pkill -f "npm run dev" || true
    ok "All services stopped"
    exit 0
fi

check_payara

# ── Start database ────────────────────────────────────────────────────────────
start_docker_db

# ── Start Payara if not running ───────────────────────────────────────────────
if domain_running; then
    ok "Payara already running"
else
    log "Starting Payara domain..."
    "$ASADMIN" start-domain domain1
    # Now wait until the admin listener is actually ready before any remote commands
    wait_for_admin_port
fi

# ── Skip pool/resource creation on --redeploy ────────────────────────────────
if [ "$1" != "--redeploy" ]; then

    # ── JDBC connection pool ──────────────────────────────────────────────────
    if "$ASADMIN" list-jdbc-connection-pools 2>/dev/null | grep -q "$DB_POOL"; then
        ok "Connection pool '$DB_POOL' already exists — skipping"
    else
        log "Creating JDBC connection pool..."
        "$ASADMIN" create-jdbc-connection-pool \
            --datasourceclassname org.postgresql.ds.PGSimpleDataSource \
            --restype javax.sql.DataSource \
            --property "user=${POSTGRES_USER}:password=${POSTGRES_PASSWORD}:serverName=${POSTGRES_HOST}:portNumber=${POSTGRES_PORT}:databaseName=${POSTGRES_DB}" \
            "$DB_POOL"
        ok "Connection pool created"
    fi

    # ── JDBC resource ─────────────────────────────────────────────────────────
    if "$ASADMIN" list-jdbc-resources 2>/dev/null | grep -q "$DB_RESOURCE"; then
        ok "JDBC resource '$DB_RESOURCE' already exists — skipping"
    else
        log "Creating JDBC resource..."
        "$ASADMIN" create-jdbc-resource \
            --connectionpoolid "$DB_POOL" \
            "$DB_RESOURCE"
        ok "JDBC resource created"
    fi

fi

# ── Build WAR ─────────────────────────────────────────────────────────────────
log "Building WAR with Maven..."
cd "$BACKEND_DIR"
mvn clean package -q -DskipTests
WAR_FILE=$(find target -name "*.war" | head -1)
[ -n "$WAR_FILE" ] || err "No .war found in target/ — check Maven build output"
ok "Built: $WAR_FILE"

# ── Deploy ────────────────────────────────────────────────────────────────────
if "$ASADMIN" list-applications 2>/dev/null | grep -q "$APP_NAME"; then
    log "Redeploying '$APP_NAME'..."
    "$ASADMIN" redeploy --name "$APP_NAME" --contextroot "$APP_NAME" "$WAR_FILE"
else
    log "Deploying '$APP_NAME' for the first time..."
    "$ASADMIN" deploy --name "$APP_NAME" --contextroot "$APP_NAME" "$WAR_FILE"
fi

# ── Start frontend ────────────────────────────────────────────────────────────
start_frontend

echo ""
ok "All services running!"
echo ""
echo "  Frontend       :  http://localhost:${FRONTEND_PORT:-80}"
echo "  Backend        :  http://localhost:${BACKEND_PORT:-8080}/$APP_NAME"
echo "  API base URL   :  http://localhost:${BACKEND_PORT:-8080}/$APP_NAME/api"
echo "  Payara console :  http://localhost:$ADMIN_PORT"
echo "  Database       :  localhost:${POSTGRES_PORT:-5432}/$POSTGRES_DB"
echo ""
echo "  Stop services  :  ./start-backend.sh --stop"
echo "  Quick rebuild  :  ./start-backend.sh --redeploy"
echo ""
