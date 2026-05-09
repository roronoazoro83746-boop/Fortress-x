import asyncio
import os

os.environ["TINYFISH_API_KEY"] = "sk-tinyfish-jzySeq4rYc-xM81NPfxtovHgzKdcsOM2"

from app.services.tinyfish_client import tinyfish_client

async def main():
    print("Testing TinyFish Search API...")
    search_result = await tinyfish_client.search_threat_intel("cybersecurity threat landscape 2026")
    if search_result:
        print(f"Found {search_result.total_results} results!")
        if search_result.results:
            first = search_result.results[0]
            print(f"Top result: {first.title} ({first.url})")
            print(f"Snippet: {first.snippet}")
    else:
        print("Search failed.")

if __name__ == "__main__":
    asyncio.run(main())
