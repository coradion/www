#!/bin/bash
set -e

echo "Verifying Next.js 16 + Tailwind 4 scaffold..."

REQUIRED_FILES=(
  "src/app/layout.tsx"
  "src/app/page.tsx"
  "next.config.ts"
  "postcss.config.mjs"
  "src/app/globals.css"
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
  echo "Validation failed: Some required files are missing."
  exit 1
else
  echo "Validation successful: All required files are present."
  exit 0
fi
