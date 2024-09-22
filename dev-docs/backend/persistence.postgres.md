# Persistence

We are using Postgres as our database with Prisma as our ORM.
In order to enable a modular monolith approach, we use the following approach:
- Single database server and single database for the entire application
- One database schema per bounded context
- One Prisma client per bounded context
