#!/usr/bin/env bash
# Purge Cloudflare cache

set -euo pipefail

if [[ -f "$(dirname "$0")/../.env.local" ]]; then
  set -a
  source "$(dirname "$0")/../.env.local"
  set +a
fi

: "${CLOUDFLARE_ZONE_ID:?CLOUDFLARE_ZONE_ID is not set}"
: "${CLOUDFLARE_API_TOKEN:?CLOUDFLARE_API_TOKEN is not set}"

echo "Purging Cloudflare cache for zone ${CLOUDFLARE_ZONE_ID}..."

response=$(curl -s -X POST \
  "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache" \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}')

if echo "$response" | grep -q '"success":true'; then
  echo "Cache purged."
else
  echo "Purge failed:"
  echo "$response"
  exit 1
fi
