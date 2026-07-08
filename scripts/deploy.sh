set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> git pull"
git pull

echo "==> npm install"
npm install

echo "==> npm run build"
npm run build

echo "==> pm2 restart floppyy"
pm2 restart floppyy

echo "==> purge Cloudflare cache"
./scripts/cf-purge.sh

echo "Deploy complete"
