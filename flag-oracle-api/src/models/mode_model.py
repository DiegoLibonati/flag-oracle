from pydantic import BaseModel, ConfigDict, Field


class ModeModel(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    name: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)
    multiplier: int
    timeleft: int
