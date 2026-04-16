from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Fortress X"
    API_V1_STR: str = "/api/v1"
    
    # DATABASE
    SQLITE_URL: str = "sqlite+aiosqlite:///./fortressx.db"
    POSTGRES_URL: str = "postgresql+asyncpg://user:pass@localhost/fortressx"
    DATABASE_URL: str = SQLITE_URL
    
    # SECURITY
    API_KEY: str = "fortress-secret"  # In prod, get from env
    CORS_ORIGINS: List[AnyHttpUrl] = []

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

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
