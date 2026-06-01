# IELTS BandBoost Starter

A fast MVP for an IELTS learning + practice + progress tracking app.

## Features included

- Next.js App Router
- Tailwind UI
- Learn IELTS page with embedded YouTube lessons
- Practice Zone with answer checking
- Local progress saving
- Band Tracker
- Vocabulary Bank
- OpenAI feedback API route
- Supabase starter schema

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000

## Environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4.1-mini
```

## Supabase

1. Create a Supabase project.
2. Open SQL Editor.
3. Paste and run `supabase/schema.sql`.
4. Copy the Project URL and anon key into `.env.local`.

The first MVP currently saves practice progress in localStorage. The schema is prepared so you can move progress saving into Supabase next.

## YouTube videos

Replace the placeholder `videoId` values in `data/lessons.ts` with real YouTube video IDs.

Example: for `https://www.youtube.com/watch?v=abc123`, the video ID is `abc123`.

## AI feedback

The API route is here:

`app/api/ai-feedback/route.ts`

POST body example:

```json
{
  "task": "IELTS Writing Task 2 essay",
  "answer": "Your student answer here..."
}
```

Never put `OPENAI_API_KEY` in client-side code.
