from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Fortress X"
    API_V1_STR: str = "/api/v1"
    
    # DATABASE
    SQLITE_URL: str = "sqlite+aiosqlite:///./fortressx.db"
    DATABASE_URL: str = SQLITE_URL

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_url(cls, v: str) -> str:
        if v and v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql+asyncpg://", 1)
        if v and v.startswith("postgresql://"):
            return v.replace("postgresql://", "postgresql+asyncpg://", 1)
        return v
    
    # SECURITY
    API_KEY: str = "fortress-secret"  # In prod, get from env
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    CORS_ORIGINS: List[str] = []

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        import json
        if isinstance(v, str):
            try:
                parsed = json.loads(v)
                if isinstance(parsed, list):
                    return [str(i) for i in parsed]
            except json.JSONDecodeError:
                pass
            return [i.strip() for i in v.split(",") if i.strip()]
        if isinstance(v, list):
            return [str(i) for i in v]
        return []

    # RISK ENGINE WEIGHTS
    ML_WEIGHT: float = 0.5
    IP_WEIGHT: float = 0.3
    BEHAVIOR_WEIGHT: float = 0.2

    # OBSERVABILITY
    LOG_LEVEL: str = "INFO"
    ENVIRONMENT: str = "development"

    model_config = SettingsConfigDict(
        env_file=".env", case_sensitive=True, env_file_encoding="utf-8"
    )

settings = Settings()
