import os
import httpx
from pydantic import BaseModel
from typing import List, Optional

class TinyFishSearchResult(BaseModel):
    position: int
    site_name: Optional[str] = None
    title: str
    snippet: str
    url: str

class TinyFishSearchResponse(BaseModel):
    query: str
    results: List[TinyFishSearchResult]
    total_results: int

class TinyFishClient:
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("TINYFISH_API_KEY", "")
        self.search_url = "https://api.search.tinyfish.ai"
        self.fetch_url = "https://api.fetch.tinyfish.ai"
    
    async def search_threat_intel(self, query: str) -> Optional[TinyFishSearchResponse]:
        """
        Uses TinyFish Search API to gather threat intelligence on a given query (e.g. an IP or email).
        """
        if not self.api_key:
            return None
        
        async with httpx.AsyncClient() as client:
            headers = {"X-API-Key": self.api_key}
            params = {"query": query}
            try:
                response = await client.get(self.search_url, headers=headers, params=params)
                response.raise_for_status()
                data = response.json()
                return TinyFishSearchResponse(**data)
            except Exception as e:
                print(f"Error fetching from TinyFish Search API: {e}")
                return None

    async def fetch_page_content(self, url: str) -> Optional[str]:
        """
        Uses TinyFish Fetch API to extract content from a given URL.
        """
        if not self.api_key:
            return None
        
        async with httpx.AsyncClient() as client:
            headers = {"X-API-Key": self.api_key, "Content-Type": "application/json"}
            payload = {"urls": [url]}
            try:
                response = await client.post(self.fetch_url, headers=headers, json=payload)
                response.raise_for_status()
                data = response.json()
                if "results" in data and len(data["results"]) > 0:
                    return data["results"][0].get("text")
                return None
            except Exception as e:
                print(f"Error fetching from TinyFish Fetch API: {e}")
                return None

tinyfish_client = TinyFishClient()
