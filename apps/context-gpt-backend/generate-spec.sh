#!/bin/bash
API_PREFIX='' PORT=8001 nx serve context-gpt-backend &
server_pid=$!

node ./apps/context-gpt-backend/scripts/generate-open-api-spec.js

kill $server_pid
