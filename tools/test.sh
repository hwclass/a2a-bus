#!/bin/bash

# Default values
INTENT=${1:-"summarize.article"}
MESSAGE=${2:-"This is a test message for the simulator"}

echo "🧪 Testing with intent: $INTENT"
echo "📝 Message: $MESSAGE"
echo "🚀 Running simulator..."

docker compose run --rm simulator "$INTENT" "$MESSAGE" 