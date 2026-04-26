from typing import Annotated

from pydantic import BaseModel, StringConstraints

ConstrainedStr = Annotated[str, StringConstraints(min_length=1, strip_whitespace=True)]


class ModeModel(BaseModel):
    name: ConstrainedStr
    description: ConstrainedStr
    multiplier: int
    timeleft: int
