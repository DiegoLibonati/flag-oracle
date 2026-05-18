from pydantic import BaseModel, ConfigDict, Field


class UserModel(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    username: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)
    scores: dict[str, int]
    total_score: int
