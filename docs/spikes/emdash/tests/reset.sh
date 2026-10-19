#!/bin/sh
# Spike only: wipe the LOCAL emulated D1/R2 state and start a fresh dev server.
set -e
cd "$(dirname "$0")/.."
npx astro dev stop >/dev/null 2>&1 || true
rm -rf .wrangler/state
npx astro dev --port 4400 --host 127.0.0.1 >/dev/null 2>&1
curl -sS --retry 60 --retry-delay 2 --retry-all-errors -o /dev/null http://127.0.0.1:4400/tw/products/
curl -sS -X POST -H 'content-type: application/json' -d '{}' http://127.0.0.1:4400/_emdash/api/setup/dev-bypass >/dev/null
echo "reset done"
