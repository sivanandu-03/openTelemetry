#!/bin/bash
THRESHOLD=$1
SERVICE_NAME="api-gateway"
JAEGER_URL="http://localhost:16686/api/traces?service=$SERVICE_NAME"

# Fetch traces and extract TraceIDs using grep/sed instead of jq
curl -s "$JAEGER_URL" | grep -oP '"traceID":"\K[^"]+' | uniq
