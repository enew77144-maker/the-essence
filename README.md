# The Essence

> Science-Led Skincare. Honest Pricing.

A full-stack luxury cosmetics e-commerce platform inspired by The Ordinary's minimalist, ingredient-forward aesthetic.

## Stack

- **Frontend:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · Zustand · TanStack Query · shadcn/ui
- **Backend:** Django 5 + Django REST Framework · SimpleJWT · django-filter · drf-spectacular
- **Database:** PostgreSQL (Neon serverless) — falls back to SQLite for local development
- **Payments:** Stripe (checkout + webhooks)
- **Media:** Cloudinary (with Unsplash fallback)

## Quick Start

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py seed
python manage.py runserver 0.0.0.0:8000
```

API docs: http://localhost:8000/api/schema/swagger-ui/

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Site: http://localhost:3000

## Project Layout

```
the-essence/
├── backend/        # Django REST API
│   ├── config/     # Project settings + root URLs
│   └── apps/       # users, products, reviews, cart, orders, payments, cms
└── frontend/       # Next.js application
    ├── app/        # Routes (App Router)
    ├── components/ # UI / layout / page sections
    ├── hooks/      # React Query + Zustand consumers
    ├── store/      # Zustand stores (cart, wishlist)
    └── lib/        # API client, utils, stripe
```

## Seed Data

Running `python manage.py seed` populates:

- 8 categories (Serums, Moisturizers, Cleansers, Eye Care, Sun Care, Hair Care, Body Care, Tools)
- 40+ products with realistic copy, INCI lists and Unsplash imagery
- 200+ reviews across products
- 3 admin + 10 customer accounts (passwords in seed output)
- 5 banner slides
- 3 discount codes (`WELCOME10`, `FREESHIP`, `BUNDLE20`)

## Environment Variables

See `backend/.env.example` and `frontend/.env.example` for required keys.

## License

Proprietary — © The Essence.
