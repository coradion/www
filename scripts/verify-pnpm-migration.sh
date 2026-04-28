#!/bin/bash
set -e

echo "Verifying pnpm migration..."

if [ -f "package-lock.json" ]; then
  echo "❌ Error: package-lock.json still exists."
  exit 1
fi
echo "✅ package-lock.json is removed."

if [ ! -f "pnpm-lock.yaml" ]; then
  echo "❌ Error: pnpm-lock.yaml is missing."
  exit 1
fi
echo "✅ pnpm-lock.yaml is present."

echo "Validation successful: Migration to pnpm is complete."
exit 0
