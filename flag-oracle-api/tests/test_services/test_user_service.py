from typing import Any
from unittest.mock import MagicMock, patch

import pytest

from src.models.user_model import UserModel
from src.services.user_service import UserService
from src.utils.exceptions import ConflictAPIError, NotFoundAPIError


class TestAddUser:
    @pytest.mark.unit
    def test_adds_user_when_not_duplicate(self) -> None:
        user: UserModel = UserModel(username="player1", password="hashed", scores={"General": 100}, total_score=100)
        with patch("src.services.user_service.UserDAO") as mock_dao:
            mock_dao.find_one_by_username.return_value = None
            mock_dao.insert_one.return_value = MagicMock()
            UserService.add_user(user)
        mock_dao.insert_one.assert_called_once_with(user.model_dump())

    @pytest.mark.unit
    def test_raises_conflict_when_username_already_exists(self) -> None:
        user: UserModel = UserModel(username="player1", password="hashed", scores={"General": 0}, total_score=0)
        with patch("src.services.user_service.UserDAO") as mock_dao:
            mock_dao.find_one_by_username.return_value = {"username": "player1", "_id": "1"}
            with pytest.raises(ConflictAPIError):
                UserService.add_user(user)

    @pytest.mark.unit
    def test_does_not_insert_when_user_already_exists(self) -> None:
        user: UserModel = UserModel(username="existing", password="hashed", scores={}, total_score=0)
        with patch("src.services.user_service.UserDAO") as mock_dao:
            mock_dao.find_one_by_username.return_value = {"username": "existing", "_id": "2"}
            with pytest.raises(ConflictAPIError):
                UserService.add_user(user)
        mock_dao.insert_one.assert_not_called()


class TestGetTopUsers:
    @pytest.mark.unit
    def test_returns_users_sorted_by_total_score_for_general(self) -> None:
        users: list[dict[str, Any]] = [
            {"_id": "1", "username": "alice", "total_score": 200, "scores": {"General": 200, "Normal": 200}},
            {"_id": "2", "username": "bob", "total_score": 100, "scores": {"General": 100, "Normal": 100}},
        ]
        with patch.object(UserService, "get_all_users", return_value=users):
            result: list[dict[str, Any]] = UserService.get_top_users("General")
        assert result[0]["username"] == "alice"
        assert result[1]["username"] == "bob"

    @pytest.mark.unit
    def test_returns_users_sorted_by_mode_score_for_specific_mode(self) -> None:
        users: list[dict[str, Any]] = [
            {"_id": "1", "username": "alice", "total_score": 100, "scores": {"General": 100, "Normal": 50}},
            {"_id": "2", "username": "bob", "total_score": 200, "scores": {"General": 200, "Normal": 300}},
        ]
        with patch.object(UserService, "get_all_users", return_value=users):
            result: list[dict[str, Any]] = UserService.get_top_users("Normal")
        assert result[0]["username"] == "bob"
        assert result[0]["score"] == 300

    @pytest.mark.unit
    def test_returns_empty_list_when_no_users(self) -> None:
        with patch.object(UserService, "get_all_users", return_value=[]):
            result: list[dict[str, Any]] = UserService.get_top_users("General")
        assert result == []

    @pytest.mark.unit
    def test_returns_zero_score_when_mode_not_in_user_scores(self) -> None:
        users: list[dict[str, Any]] = [
            {"_id": "1", "username": "alice", "total_score": 50, "scores": {"General": 50, "Normal": 50}},
        ]
        with patch.object(UserService, "get_all_users", return_value=users):
            result: list[dict[str, Any]] = UserService.get_top_users("Hardcore")
        assert result[0]["score"] == 0

    @pytest.mark.unit
    def test_returns_at_most_ten_users(self) -> None:
        users: list[dict[str, Any]] = [{"_id": str(i), "username": f"user{i}", "total_score": i, "scores": {"General": i}} for i in range(15)]
        with patch.object(UserService, "get_all_users", return_value=users):
            result: list[dict[str, Any]] = UserService.get_top_users("General")
        assert len(result) == 10

    @pytest.mark.unit
    def test_top_users_score_field_uses_total_score_for_general(self) -> None:
        users: list[dict[str, Any]] = [
            {"_id": "1", "username": "alice", "total_score": 999, "scores": {"General": 999}},
        ]
        with patch.object(UserService, "get_all_users", return_value=users):
            result: list[dict[str, Any]] = UserService.get_top_users("General")
        assert result[0]["score"] == 999


class TestGetUserByUsername:
    @pytest.mark.unit
    def test_delegates_to_dao(self) -> None:
        expected: dict[str, Any] = {"username": "player1", "_id": "abc"}
        with patch("src.services.user_service.UserDAO") as mock_dao:
            mock_dao.find_one_by_username.return_value = expected
            result = UserService.get_user_by_username("player1")
        assert result == expected


class TestUpdateUserScoresByUsername:
    @pytest.mark.unit
    def test_delegates_to_dao(self) -> None:
        values: dict[str, Any] = {"scores": {"General": 200}, "total_score": 200}
        with patch("src.services.user_service.UserDAO") as mock_dao:
            mock_dao.update_one_by_username.return_value = MagicMock()
            UserService.update_user_scores_by_username("player1", values)
        mock_dao.update_one_by_username.assert_called_once_with("player1", values)


class TestDeleteUserById:
    @pytest.mark.unit
    def test_deletes_user_when_it_exists(self) -> None:
        existing: dict[str, Any] = {"username": "player1", "_id": "abc"}
        with patch("src.services.user_service.UserDAO") as mock_dao:
            mock_dao.find_one_by_id.return_value = existing
            mock_dao.delete_one_by_id.return_value = MagicMock()
            UserService.delete_user_by_id("abc")
        mock_dao.delete_one_by_id.assert_called_once_with("abc")

    @pytest.mark.unit
    def test_raises_not_found_when_user_does_not_exist(self) -> None:
        with patch("src.services.user_service.UserDAO") as mock_dao:
            mock_dao.find_one_by_id.return_value = None
            with pytest.raises(NotFoundAPIError):
                UserService.delete_user_by_id("nonexistent")

    @pytest.mark.unit
    def test_does_not_call_delete_when_user_not_found(self) -> None:
        with patch("src.services.user_service.UserDAO") as mock_dao:
            mock_dao.find_one_by_id.return_value = None
            with pytest.raises(NotFoundAPIError):
                UserService.delete_user_by_id("nonexistent")
        mock_dao.delete_one_by_id.assert_not_called()
