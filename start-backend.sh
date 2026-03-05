#!/usr/bin/env bash
# ════════════════════════════════════════════════════════════════════════════
#  start-backend.sh  —  One-command backend launcher for OnlineShop
#
#  SETUP (one time only):
#    1. Edit the three variables in the CONFIG section below.
#    2. chmod +x start-backend.sh
#
#  DAILY USE:
#    ./start-backend.sh          — build + deploy
#    ./start-backend.sh --stop   — stop Payara
#    ./start-backend.sh --redeploy  — rebuild WAR and redeploy without restart
# ════════════════════════════════════════════════════════════════════════════

set -e  # exit on error

# ── CONFIG — edit these three lines ──────────────────────────────────────────
PAYARA_HOME="$HOME/payara6"          # path to your Payara installation folder
BACKEND_DIR="$(cd "$(dirname "$0")" && pwd)"   # folder containing this script + pom.xml
APP_NAME="onlineShop"                # context root, must match Payara deployment name
# ─────────────────────────────────────────────────────────────────────────────

ASADMIN="$PAYARA_HOME/bin/asadmin"
DB_POOL="PostgresPool"
DB_RESOURCE="jdbc/postgres"

# ── Helpers ───────────────────────────────────────────────────────────────────
log()  { echo -e "\033[0;36m▶  $*\033[0m"; }
ok()   { echo -e "\033[0;32m✔  $*\033[0m"; }
err()  { echo -e "\033[0;31m✖  $*\033[0m"; exit 1; }

check_payara() {
    [ -x "$ASADMIN" ] || err "asadmin not found at $ASADMIN — set PAYARA_HOME correctly"
}

domain_running() {
    "$ASADMIN" list-domains 2>/dev/null | grep -q "domain1.*running"
}

# ── Stop ──────────────────────────────────────────────────────────────────────
if [ "$1" = "--stop" ]; then
    check_payara
    log "Stopping Payara..."
    "$ASADMIN" stop-domain domain1
    ok "Payara stopped"
    exit 0
fi

check_payara

# ── Start domain if not running ───────────────────────────────────────────────
if domain_running; then
    ok "Payara already running"
else
    log "Starting Payara domain..."
    "$ASADMIN" start-domain domain1
    ok "Payara started"
    sleep 3
fi

# ── Create JDBC connection pool (idempotent — skips if already exists) ────────
if "$ASADMIN" list-jdbc-connection-pools 2>/dev/null | grep -q "$DB_POOL"; then
    ok "Connection pool '$DB_POOL' already exists — skipping"
else
    log "Creating JDBC connection pool..."
    "$ASADMIN" create-jdbc-connection-pool \
        --datasourceclassname org.postgresql.ds.PGSimpleDataSource \
        --restype javax.sql.DataSource \
        --property "user=ander:password=ander123:serverName=localhost:portNumber=5432:databaseName=pscShop" \
        "$DB_POOL"
    ok "Connection pool created"
fi

# ── Create JDBC resource (idempotent) ─────────────────────────────────────────
if "$ASADMIN" list-jdbc-resources 2>/dev/null | grep -q "$DB_RESOURCE"; then
    ok "JDBC resource '$DB_RESOURCE' already exists — skipping"
else
    log "Creating JDBC resource..."
    "$ASADMIN" create-jdbc-resource \
        --connectionpoolid "$DB_POOL" \
        "$DB_RESOURCE"
    ok "JDBC resource created"
fi

# ── Build WAR ─────────────────────────────────────────────────────────────────
log "Building WAR with Maven..."
cd "$BACKEND_DIR"
mvn clean package -q -DskipTests
WAR_FILE=$(find target -name "*.war" | head -1)
[ -n "$WAR_FILE" ] || err "No .war file found in target/ — check your Maven build"
ok "Built: $WAR_FILE"

# ── Deploy (or redeploy if app already exists) ────────────────────────────────
if "$ASADMIN" list-applications 2>/dev/null | grep -q "$APP_NAME"; then
    log "Redeploying '$APP_NAME'..."
    "$ASADMIN" redeploy --name "$APP_NAME" --contextroot "$APP_NAME" "$WAR_FILE"
else
    log "Deploying '$APP_NAME'..."
    "$ASADMIN" deploy --name "$APP_NAME" --contextroot "$APP_NAME" "$WAR_FILE"
fi

ok "Backend running at http://localhost:8080/$APP_NAME"
echo ""
echo "  API base URL : http://localhost:8080/$APP_NAME/api"
echo "  Payara admin : http://localhost:4848"
echo "  Stop server  : ./start-backend.sh --stop"
