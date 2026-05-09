#!/bin/bash
set -e

echo "Verifying WorkOS integration..."

if ! grep -q "\"@workos-inc/authkit-nextjs\":" package.json; then
  echo "❌ Missing: @workos-inc/authkit-nextjs dependency"
  exit 1
fi
echo "✅ Found: @workos-inc/authkit-nextjs"

REQUIRED_FILES=(
  "src/proxy.ts"
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
  echo "Validation failed: WorkOS files are missing."
  exit 1
else
  echo "Validation successful: WorkOS is integrated."
  exit 0
fi
