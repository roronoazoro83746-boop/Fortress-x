---
name: tinyfish
description: "Use when doing ANY task involving web search, headless browser interaction, or data extraction using TinyFish. Triggers: web scraping, searching for threat intel, fetching URLs, interacting with dynamic pages."
---

# TinyFish Agent Skill

This skill provides instructions for the agent on how to use the TinyFish API and tools to interact with the web.

## Capabilities

TinyFish provides three core APIs that you can leverage:
1. **Search API**: Use `TinyFishClient.search_threat_intel(query)` in the backend to perform intelligent web searches.
2. **Fetch API**: Use `TinyFishClient.fetch_page_content(url)` to retrieve raw, clean text from websites without dealing with HTML parsing.
3. **Browser API**: For more complex interactions (clicking, scrolling), leverage the TinyFish MCP integration if available.

## Usage Guidelines

- **Search first, Fetch second**: If you don't know the exact URL, use the Search API to find it. Once you have the URL, use the Fetch API to extract the content.
- **Threat Intelligence**: For cybersecurity workflows (like in Fortress X), use the Search API to look up IPs, domains, or suspicious emails against known public databases.
- **Data Scraping**: Use the Fetch API for lightweight scraping instead of building custom BeautifulSoup/Puppeteer scripts.

## Environment Variables
Ensure `TINYFISH_API_KEY` is set in the `.env` file before calling any TinyFish endpoints.

## Example Backend Usage (Python/FastAPI)
```python
from app.services.tinyfish_client import tinyfish_client

# Search for threat intel
results = await tinyfish_client.search_threat_intel("192.168.1.1 abuse report")

# Fetch content from a specific threat advisory
content = await tinyfish_client.fetch_page_content("https://example.com/threat-advisory/123")
```
