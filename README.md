# Career141 Chatbot 🤖

This is my submission for the Career141 "AI-Powered Full-Stack Developer" technical assessment. It's a simple chatbot app — you type a message, it goes to my backend, my backend asks Google's Gemini AI for a reply, and the answer shows up in the chat.

I built this to show I can put together a working full-stack app: a frontend people can actually use, a backend that talks to it safely, and a real AI integration — not just a UI mockup.

**Live app:** `<add your Vercel link here once deployed>`
**Backend API:** `<add your Render/Railway link here once deployed>`

---

## What this app does

You open the app, type something in the chat box, hit send (or press Enter), and a few seconds later the AI replies. That's it — that's the whole app. But I tried to make the experience feel polished, not just functional:

- Clean, mobile-friendly chat layout
- Your messages and the AI's replies show up in different colored bubbles, like a real chat app
- A little "AI is thinking…" animation while you wait for a reply
- Chat auto-scrolls down as new messages come in
- Dark mode toggle, if you're not a fan of white backgrounds
- The Send button disables itself while waiting for a reply, so you can't accidentally spam it
- Press Enter to send, Shift+Enter if you want a new line instead
- A "Clear chat" button to start over
- A few suggested prompts shown when you first open the app, in case you don't know what to type
- Friendly error messages if something breaks — no scary red stack traces on screen

## How it's built (and why)

I split this into two separate apps that talk to each other over an API, instead of one big app, because that's how real production apps are usually structured — and honestly, it also makes it way easier to debug when something goes wrong, since I can test each half on its own.

**Frontend (`Frontend/`)** — this is what the user sees. Built with React (using Vite, which is just a faster way to spin up a React project) and styled with Tailwind CSS, which lets me style things with utility classes instead of writing separate CSS files for everything.

**Backend (`Backend/`)** — this is the part nobody sees. It's a small Node.js server using Express. Its whole job is: receive a message from the frontend, forward it to Gemini, and send the reply back. I kept the logic here on purpose — more on why below.

**AI — Google Gemini** — I picked Gemini because it has a genuinely free tier to build and test with, and Google's official SDK (`@google/genai`) is straightforward to use.

## The most important design decision: the frontend never touches the AI directly

This tripped me up at first, so I want to explain it clearly, because it's the part of the assessment I think matters most.

If I called Gemini's API straight from the React app, my API key would have to live in the frontend code — and **anything in frontend code is visible to anyone who opens the browser's dev tools.** That means my key (and my usage quota, and potentially my billing) would be exposed to the entire internet the moment I deployed the site.

So instead, the flow looks like this:

```
Your browser (React)
        │
        │  "hey, here's what the user typed"
        ▼
My backend server (Express)
        │
        │  backend adds the API key here, where nobody can see it
        ▼
Google Gemini API
        │
        ▼
Backend sends just the reply text back to your browser
```

The key only ever exists on the server, inside an `.env` file that's never uploaded to GitHub. The browser never sees it, and neither does anyone inspecting the network requests in dev tools — they'll only see a request going to *my own backend*, not to Google.

## Project structure

```
career141-chatbot/
│
├── Frontend/                  # everything the user sees, in the browser
│   ├── src/
│   │   ├── components/        # small reusable pieces (chat bubble, input box, etc.)
│   │   ├── App.jsx            # main component that ties everything together
│   │   └── api.js             # the one place that calls my backend
│   ├── .env.example
│   └── package.json
│
├── Backend/                   # my Express server
│   ├── routes/
│   │   └── chat.js            # handles POST /api/chat — talks to Gemini
│   ├── index.js               # starts the server, sets up middleware
│   ├── .env.example
│   └── package.json
│
├── README.md                  # you're reading it
└── .gitignore
```

## Running it on your own machine

You'll need Node.js installed (version 18 or newer), and a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

```bash
# 1. Clone the repo
git clone https://github.com/Seneshperera/Career141-chatbot-assesment.git
cd Career141-chatbot-assesment

# 2. Set up the backend
cd Backend
cp .env.example .env
# open .env and paste in your own Gemini API key
npm install
npm run dev
# backend is now running on http://localhost:5000

# 3. In a NEW terminal window, set up the frontend
cd Frontend
cp .env.example .env
npm install
npm run dev
# frontend is now running on http://localhost:5173
```

Open `http://localhost:5173` in your browser and start chatting.

## Environment variables

### Backend (`Backend/.env`)

```
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-flash-latest
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

A quick note on `GEMINI_MODEL`: I set it to `gemini-flash-latest` instead of a specific version number like `gemini-2.5-flash`. Google updates and retires their models pretty often, and this "latest" alias always points at whatever their current recommended model is — so the app doesn't randomly break a few months from now when a specific model version gets deprecated.

### Frontend (`Frontend/.env`)

```
VITE_API_URL=http://localhost:5000
```

This just tells the frontend where to find my backend. Locally it's `localhost:5000`; once deployed, it'll point to the real backend URL instead.

## About the API key — how I kept it secure

Since this was an explicit requirement, here's exactly what I did:

- The key lives only in `Backend/.env`, and only backend code (`Backend/routes/chat.js`) ever reads it.
- `.env` is listed in `.gitignore`, so Git ignores it completely — it's never uploaded to GitHub. Only `.env.example` (which has placeholder text, not a real key) is committed, so anyone cloning the repo knows what variables they need to set up themselves.
- For the deployed version, I don't put the key in any file at all — I set it directly as an environment variable in Render/Railway's dashboard, so it only exists on Google's/the hosting provider's servers, never in my codebase.
- The frontend calls my backend, never Gemini directly, so the key is never sent to (or visible in) the browser.

## Deployment

**Backend → Render (or Railway)**
1. Push the repo to GitHub.
2. Create a new Web Service, point it at the `Backend/` folder.
3. Build command: `npm install`. Start command: `npm start`.
4. Add `GEMINI_API_KEY`, `GEMINI_MODEL`, and `CLIENT_ORIGIN` as environment variables in the dashboard (not in code).

**Frontend → Vercel**
1. Import the repo, set the project root to `Frontend/`.
2. Framework preset: Vite.
3. Add `VITE_API_URL` as an environment variable, set to my deployed backend URL.

After both are live, I go back and update `CLIENT_ORIGIN` on the backend to match the real Vercel URL exactly, then redeploy the backend — otherwise the browser blocks the requests due to CORS.

## API reference

**`POST /api/chat`**

Send this:
```json
{ "message": "Hello!" }
```

Get this back:
```json
{ "reply": "Hi there! How can I help you today?" }
```

If something goes wrong on the backend or with Gemini, you'll get a plain error message instead, like:
```json
{ "error": "Something went wrong. Please try again." }
```

## What I'd add if I had more time

- Streaming replies word-by-word instead of waiting for the whole response
- Saving chat history so it survives a page refresh
- Basic automated tests for the backend route
- User accounts, so conversations aren't lost between sessions