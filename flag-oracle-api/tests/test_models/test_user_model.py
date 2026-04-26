from typing import Any

import pytest
from pydantic import ValidationError

from src.models.user_model import UserModel


class TestUserModel:
    @pytest.mark.unit
    def test_valid_user_is_created(self) -> None:
        user: UserModel = UserModel(
            username="player1",
            password="secret",
            scores={"General": 100, "Normal": 100},
            total_score=100,
        )
        assert user.username == "player1"
        assert user.total_score == 100
        assert user.scores == {"General": 100, "Normal": 100}

    @pytest.mark.unit
    def test_empty_username_raises_validation_error(self) -> None:
        with pytest.raises(ValidationError):
            UserModel(username="", password="secret", scores={}, total_score=0)

    @pytest.mark.unit
    def test_empty_password_raises_validation_error(self) -> None:
        with pytest.raises(ValidationError):
            UserModel(username="player1", password="", scores={}, total_score=0)

    @pytest.mark.unit
    def test_whitespace_only_username_raises_validation_error(self) -> None:
        with pytest.raises(ValidationError):
            UserModel(username="   ", password="secret", scores={}, total_score=0)

    @pytest.mark.unit
    def test_username_is_stripped_of_whitespace(self) -> None:
        user: UserModel = UserModel(username="  player1  ", password="secret", scores={}, total_score=0)
        assert user.username == "player1"

    @pytest.mark.unit
    def test_missing_scores_raises_validation_error(self) -> None:
        with pytest.raises(ValidationError):
            UserModel(username="player1", password="secret", total_score=0)

    @pytest.mark.unit
    def test_missing_total_score_raises_validation_error(self) -> None:
        with pytest.raises(ValidationError):
            UserModel(username="player1", password="secret", scores={})

    @pytest.mark.unit
    def test_model_dump_returns_correct_fields(self) -> None:
        user: UserModel = UserModel(
            username="player1",
            password="hashed_pass",
            scores={"General": 50, "Normal": 50},
            total_score=50,
        )
        data: dict[str, Any] = user.model_dump()
        assert data["username"] == "player1"
        assert data["password"] == "hashed_pass"
        assert data["scores"] == {"General": 50, "Normal": 50}
        assert data["total_score"] == 50

    @pytest.mark.unit
    def test_scores_with_zero_total_is_valid(self) -> None:
        user: UserModel = UserModel(username="newplayer", password="pass", scores={"General": 0}, total_score=0)
        assert user.total_score == 0
