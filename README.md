# Universal Web Scraper AI

A local Flask starter app for analyzing public websites and extracting page text, metadata, headings, links, images, HTML tables and some product data.

## Setup (Windows PowerShell)

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Open http://127.0.0.1:5000 in your browser.

## Optional AI classification

Copy `.env.example` to `.env`, add your own `OPENAI_API_KEY`, and restart Flask. The key stays server-side and `.env` is ignored by Git. API usage may incur separate charges. Without a key, the app uses a simple rule-based category estimate.

## Scope and safety

- The starter scans up to 15 same-domain HTML pages per scan.
- It does not guarantee extraction of every item or every page. Website layouts vary.
- It does not bypass logins, CAPTCHAs, paywalls, bot controls or access restrictions.
- Use only on sites you are authorized to inspect; follow site terms, robots guidance, privacy laws and rate limits.
- Public URL validation blocks common private/local network targets, but this development starter is not a substitute for a hardened production crawler.
- Dynamic JavaScript-rendered pages may require a Playwright extension; the current version uses HTTP HTML responses.
- Scan results are held in memory and are cleared when the Flask app restarts.
- Run locally for learning. Before public deployment, add authentication, rate limiting, persistent storage, background jobs, stricter network egress controls and production server configuration.

## AI

The optional classifier uses the OpenAI Python SDK and Responses API. Configure `OPENAI_API_KEY` on the backend only; never place it in browser JavaScript.
