from typing import Annotated

from pydantic import BaseModel, StringConstraints

ConstrainedStr = Annotated[str, StringConstraints(min_length=1, strip_whitespace=True)]


class UserModel(BaseModel):
    username: ConstrainedStr
    password: ConstrainedStr
    scores: dict[str, int]
    total_score: int
