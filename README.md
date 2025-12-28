# Voice-RAG Assistant (MVP)

A voice-enabled (browser STT + TTS) AI concierge grounded in *your* documents via simple local RAG.

## What you change (quick checklist)
1. **API Key**: copy `.env.local.example` -> `.env.local` and set `OPENAI_API_KEY=...`
2. **Knowledge Base**: put your `.txt` files into `/kb/` (replace `sample_kb.txt`)
3. **Rebuild index**: run `npm run ingest`
4. **Branding & behavior**:
   - UI title/text in `src/app/page.tsx`
   - Assistant rules in `src/app/api/chat/route.ts` (system prompt)
   - Language for speech recognition in `src/app/page.tsx` (`r.lang = "en-US"` or `"de-DE"`)

## Run locally
```bash
npm install
cp .env.local.example .env.local
# edit .env.local
npm run ingest
npm run dev
```

Open http://localhost:3000

## Deploy (Vercel)
- Push to GitHub
- Import into Vercel
- Add env var `OPENAI_API_KEY`
- Deploy

## Embed on GoDaddy Website Builder
Add an **HTML / Custom Code** section and paste:

```html
<iframe
  src="https://YOUR-DEPLOYED-APP.vercel.app"
  style="width:100%;max-width:420px;height:650px;border:0;border-radius:16px;overflow:hidden;"
  loading="lazy"
  allow="microphone"
></iframe>
```

## Notes
- Voice input uses Web Speech API (best in Chrome/Edge). Text input always works.
- This MVP uses a local JSON vector index (`kb_index.json`) for speed and simplicity.
