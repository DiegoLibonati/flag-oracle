from pydantic import BaseModel, ConfigDict, Field


class FlagModel(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    name: str = Field(..., min_length=1)
    image: str = Field(..., min_length=1)
