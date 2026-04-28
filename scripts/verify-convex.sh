#!/bin/bash
set -e

echo "Verifying Convex initialization..."

if ! grep -q "\"convex\":" package.json; then
  echo "❌ Missing: convex dependency in package.json"
  exit 1
fi
echo "✅ Found: convex dependency"

REQUIRED_FILES=(
  "convex/schema.ts"
  "convex/functions.ts"
)

MISSING=0
for FILE in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$FILE" ]; then
    echo "❌ Missing: $FILE"
    MISSING=1
  else
    echo "✅ Found: $FILE"
  fi
done

if [ $MISSING -eq 1 ]; then
  echo "Validation failed: Convex files are missing."
  exit 1
else
  echo "Validation successful: Convex is initialized."
  exit 0
fi
