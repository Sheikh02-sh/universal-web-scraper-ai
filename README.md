
# Universal Web Scraper AI

AI-powered Universal Web Scraper built with Flask. Extract website text, metadata, headings, links, images, HTML tables, and product data.

## Features

- Website content scraping
- Product data extraction
- Image and link collection
- HTML table extraction
- AI-powered content classification using OpenRouter
- CSV, Excel, and JSON exports

## Setup (Windows PowerShell)

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Open http://127.0.0.1:5000 in your browser.

## OpenRouter AI Configuration

Create a `.env` file in the project folder and add:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=openai/gpt-4o-mini
```

Replace the placeholder with your own API key.

Never upload your `.env` file or API key to GitHub.

## Export Options

Scraped data can be exported as:
- CSV
- Excel
- JSON

## Notes

- Only scrape websites you are authorized to access.
- Respect website terms, privacy policies, and rate limits.
- Some dynamic JavaScript-rendered websites may not be fully supported.
