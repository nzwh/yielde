# Yielde - Registration & Spin The Wheel Demo

## Local setup

Create a `.env.local` file with:

```env
DATABASE_URL=postgres://...
SUPABASE_CA_CERT=...
JWT_SECRET=use-a-long-random-value
```

The database must contain `users`, `spin_locks`, and `spins` tables with the
columns referenced by the API routes. The app can then be run with:

```bash
pnpm install
pnpm dev
```

Run `pnpm lint` and `pnpm build` before presenting or deploying the demo.

## Scope decisions

- The server decides every prize result. The wheel animation is presentation
  only, and the database transaction plus row lock protects the daily limit.
- Client validation improves feedback, but the API repeats the important
  validation and enforces terms acceptance.
- No global state library or schema framework is used because the demo has a
  small number of local flows and a single API boundary.
- Distributed rate limiting, monitoring, alerting, migrations, email
  verification, password reset, and session revocation are intentionally not
  implemented. These are deployment and product requirements to add before a
  public launch, rather than useful complexity for this take-home demo.
- The Terms and Privacy links are placeholders for product-owned legal copy;
  they must be replaced with approved content before production launch.
