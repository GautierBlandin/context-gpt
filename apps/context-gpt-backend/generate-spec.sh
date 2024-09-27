#!/bin/bash
API_PREFIX='' PORT=8002 nx serve context-gpt-backend --skip-nx-cache &
server_pid=$!

node ./apps/context-gpt-backend/scripts/generate-open-api-spec.js

kill $server_pid
