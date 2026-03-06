# Scalability Notes

## Microservices

The codebase is already split into services (auth, tasks). To move to microservices:
- Extract each service into its own Express app
- Use an API gateway (Nginx, Kong) to route requests
- JWT is stateless so all services can verify tokens independently

## Caching (Redis)

Where Redis would help:
- Cache `GET /tasks` responses with TTL
- Rate limiting per IP/user
- Token blacklist for logout

## Load Balancing

- Use PM2 cluster mode for multiple Node processes
- Put Nginx or a cloud load balancer in front
- Add read replicas for PostgreSQL

## Adding New Modules

The structure makes it easy to add new features:

1. Create service in `src/services/`
2. Create controller in `src/controllers/`
3. Create route in `src/routes/v1/`
4. Register route in `src/routes/v1/index.js`
5. Add Prisma model and run migration

Existing routes and modules stay untouched. API versioning (`/api/v2/`) allows breaking changes without affecting v1.
