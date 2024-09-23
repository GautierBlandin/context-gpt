#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
    CREATE DATABASE $POSTGRES_DB_AUTH;
    CREATE DATABASE $POSTGRES_DB_THREADS;
EOSQL
