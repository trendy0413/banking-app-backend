# Backend Service

A TypeScript-based backend service using Express.js and Prisma ORM.

## Quick Start

1. **Setup**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   npm install
   ```

2. **Configure Environment**
   ```plaintext
   # .env file
   DATABASE_URL="postgresql://username:password@localhost:5432/dbname"
   PORT=5000
   ```

3. **Database Setup**
   ```bash
   npm run db:migrate:dev  # Run migrations
   npm run seed           # Optional: Seed initial data
   ```

4. **Run Application**
   ```bash
   npm run dev  # Development
   npm start    # Production
   ```

## Development Guide

### Prerequisites
- Node.js (Latest LTS)
- PostgreSQL
- npm or yarn

### Project Structure
```
backend/
├── src/
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Express middleware
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── types/         # TypeScript types
│   ├── utils/         # Utilities
│   └── server.ts      # Entry point
├── prisma/
│   ├── migrations/    # DB migrations
│   ├── schema.prisma  # DB schema
│   └── seed.ts       # DB seeder
```

### Available Scripts
| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start dev server with hot-reload |
| `npm run test` | Run test suite |
| `npm run db:migrate:dev` | Create/apply migrations |
| `npm run db:migrate:deploy` | Deploy migrations (prod) |
| `npm run seed` | Seed database |

## API Reference

Base URL: `http://localhost:5000/api`

### Error Codes
- `2xx` - Success
- `4xx` - Client errors
- `5xx` - Server errors

## Dependencies

### Core
- `express` - Web framework
- `@prisma/client` - Database ORM
- `typescript` - Language
- `cors` - CORS middleware
- `body-parser` - Request parsing

### Development
- `ts-node-dev` - Dev runtime
- `jest` - Testing
- `ts-jest` - TS testing support

## Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License
ISC License