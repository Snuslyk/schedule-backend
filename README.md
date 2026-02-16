# Schedule Backend

Backend for an educational scheduling system built with NestJS and Bun.

Frontend repository:  
https://github.com/Eltarchik/schedule

---

## Tech Stack

- NestJS
- Bun
- Prisma
- PostgreSQL
- JWT (access & refresh)
- S3 (Yandex Cloud Object Storage via AWS SDK)

---

## Installation

```bash
bun install
```

---

## Environment

Create a `.env` file in the project root:

```env
NODE_ENV=development

COOKIE_DOMAIN=localhost

S3_BUCKET=schedule-test-bucket

AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_REGION=ru-central1-a

JWT_SECRET=your_jwt_secret
JWT_ACCESS_TOKEN_TTL=2h
JWT_REFRESH_TOKEN_TTL=7d

PORT=4242
DATABASE_URL=postgresql://postgres:password@localhost:5432/schedule?schema=public
```

Do not commit real credentials.

---

## Run (development)

```bash
bun dev
```

Server runs on:

```
http://localhost:4242
```

---

## API Documentation

Scalar API documentation is available at: 
```
http://localhost:4242/docs
```

---

## Build / Production

```bash
bun run build
bun start
```

---

## Features

- Authentication & authorization (JWT)
- Access / Refresh tokens
- Cookie-based auth
- S3 avatar storage
- Modular architecture with interconnected entities
