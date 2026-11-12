#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/../.."

image="adventure-files-api:smoke-$$"
container=""
tmp="$(mktemp -d)"
cleanup() {
  if [[ -n "$container" ]]; then
    docker rm -f "$container" >/dev/null 2>&1 || true
  fi
  docker image rm "$image" >/dev/null 2>&1 || true
  rm -rf "$tmp"
}
trap cleanup EXIT

# Build and run only this API image; do not pass any Supabase credentials.
docker build --tag "$image" api
container="$(docker run -d --publish 127.0.0.1::3000 --env PORT=3000 "$image")"
address="$(docker port "$container" 3000/tcp)"
[[ "$address" == 127.0.0.1:* ]]
base="http://$address"

# Wait for Docker's actual HEALTHCHECK, not just an open TCP port.
healthy=false
for ((attempt=1; attempt<=35; attempt++)); do
  status="$(docker inspect --format '{{.State.Health.Status}}' "$container")"
  if [[ "$status" == healthy ]]; then
    healthy=true
    break
  fi
  if [[ "$status" == unhealthy ]]; then break; fi
  sleep 2
done
if [[ "$healthy" != true ]]; then
  echo "Container did not become healthy" >&2
  docker logs "$container" >&2
  exit 1
fi

uid="$(docker exec "$container" id -u)"
[[ "$uid" != 0 ]]
docker exec "$container" node -e 'if (process.versions.node.split(".")[0] !== "24") process.exit(1)'
docker exec "$container" sh -ec 'test -f /app/dist/server.js && test ! -e /app/.env && test ! -e /app/src && test ! -e /app/node_modules/vitest && test ! -e /app/node_modules/typescript'
echo "Runtime: Node 24, UID $uid, compiled output only, no dev tools or .env"

status="$(curl --silent --show-error --max-time 5 --output "$tmp/health.json" --write-out '%{http_code}' "$base/api/health")"
[[ "$status" == 200 ]]
grep -q '"status":"ok"' "$tmp/health.json"
grep -q '"service":"rpg-character-creator-api"' "$tmp/health.json"
echo "Health: HTTP 200"

status="$(curl --silent --show-error --max-time 5 --dump-header "$tmp/private.headers" --output "$tmp/private.json" --write-out '%{http_code}' "$base/api/characters/me")"
[[ "$status" == 401 ]]
grep -q '"error":"Unauthorized"' "$tmp/private.json"
grep -iq '^cache-control:[[:space:]]*no-store[[:space:]]*$' "$tmp/private.headers"
echo "Private GET without credentials: HTTP 401; Cache-Control: no-store"
docker image inspect --format 'Image size (bytes): {{.Size}}' "$image"
echo "Docker smoke passed; cleanup will remove only this test container and tag."
