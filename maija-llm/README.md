# ✦ MaijaLLM

A personal AI chatbot for Maija Boelkins, powered by Claude.

## Setup

### 1. Get an Anthropic API Key
Go to [console.anthropic.com](https://console.anthropic.com/) and create an API key.

### 2. Deploy to Vercel (recommended)

**Option A — One-click deploy:**
1. Push this project to a GitHub repo
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repo
4. Add environment variable: `ANTHROPIC_API_KEY` = your key
5. Deploy!

**Option B — Vercel CLI:**
```bash
npm i -g vercel
vercel
# When prompted, add ANTHROPIC_API_KEY as an environment variable
```

### 3. Add custom font (optional)
Place `IvyOra_Text_Light.ttf` in the `/public` folder for the custom branding font.

### 4. Add favicon
Place `fav-32x.png` as `favicon.png` in the `/public` folder.

## Local Development

```bash
npm install
cp .env.local.example .env.local
# Edit .env.local with your Anthropic API key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── app/
│   ├── api/chat/route.js   # Serverless API (proxies to Anthropic)
│   ├── globals.css          # Fonts & resets
│   ├── layout.js            # HTML layout & metadata
│   └── page.js              # Chat UI
├── public/
│   ├── favicon.png          # Your sparkle favicon
│   └── IvyOra_Text_Light.ttf # Custom font
├── .env.local.example
├── next.config.js
└── package.json
```
