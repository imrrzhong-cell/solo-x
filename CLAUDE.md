# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (localhost:3000)
npm run build     # Production build (verify changes pass)
npm run lint      # ESLint
```

No test runner is configured. Verify changes with `npm run build`.

## Architecture

SOLO.X is a one-person company content platform built with Next.js 16 + App Router + pure custom CSS + MDX.

### Route Groups

- **`app/(site)/`** — Public-facing pages. Wrapped by `(site)/layout.tsx` which includes Nav + Footer.
- **`app/admin/`** — Local-only admin dashboard with sidebar layout. Protected by middleware (password auth). Not deployed to production.
- **`app/api/`** — Route handlers for auth and Claude Code CLI proxying.

### Content Pipeline

Articles are MDX files in `content/articles/`. The pipeline:
1. `gray-matter` parses frontmatter
2. `lib/articles.ts` reads/sorts/filters articles via filesystem
3. `next-mdx-remote/rsc` compiles MDX at build time using component mappings in `lib/mdx.tsx`
4. Article pages use `generateStaticParams` for SSG

### Feature Flags

`lib/features.ts` defines 9 modules (ARTICLES, MUSIC, COURSES, etc.). Each controlled by `NEXT_PUBLIC_FEATURE_*` env vars. Only ARTICLES is enabled in MVP. The homepage content grid and nav bar dynamically show/hide based on these flags.

### Admin Dashboard

The admin at `/admin` is a local-only tool that spawns `claude` CLI via `lib/admin/claude.ts` to execute management commands. Authentication is cookie-based via `middleware.ts` with password from `ADMIN_PASSWORD` env var.

### Design System

All styles are in `app/globals.css` using CSS custom properties. The admin has its own `app/admin/globals.css`. Both share the same variable system (`--sage`, `--char`, `--white`, etc.).

## Critical Constraints

- **NO Tailwind CSS, NO shadcn/ui** — All styling is pure custom CSS
- **Follow `demo-6-zen.html`** — This file is the visual reference. Do not design independently.
- **Font stack**: Noto Serif SC (headings), Noto Sans SC (body), Shippori Mincho (numbers)
- **Responsive breakpoints**: 900px (tablet), 550px (mobile)
- **Chinese-primary** — All UI text is in Chinese. `lang="zh-CN"` on `<html>`.
- **MVP scope** — Article system only. Other modules (music, courses, etc.) show as placeholders. Login/payment/membership are not implemented or visible.

## Environment Variables

See `.env.example` for full list. Key variables:
- `RESEND_API_KEY` / `RESEND_AUDIENCE_ID` — Email subscription via Resend
- `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_SITE_NAME` — Site metadata
- `NEXT_PUBLIC_FEATURE_*` — Feature toggles (9 modules)
- `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET` — Admin auth (local only)

## Deployment

Deployed on Vercel. Pushing to `main` triggers automatic deployment. Admin dashboard (`/admin`) only runs locally via `npm run dev` — it is not intended for production use.
