from typing import Any
from unittest.mock import MagicMock, patch

import pytest
from bson import ObjectId

from src.data_access.user_dao import UserDAO


class TestParseUserMethod:
    @pytest.mark.unit
    def test_returns_none_when_input_is_none(self) -> None:
        result: dict[str, Any] | None = UserDAO.parse_user(None)
        assert result is None

    @pytest.mark.unit
    def test_converts_objectid_to_string(self) -> None:
        oid: ObjectId = ObjectId()
        user: dict[str, Any] = {"_id": oid, "username": "player1", "password": "hashed", "scores": {}, "total_score": 0}
        result: dict[str, Any] = UserDAO.parse_user(user)
        assert result["_id"] == str(oid)
        assert isinstance(result["_id"], str)

    @pytest.mark.unit
    def test_preserves_user_fields(self) -> None:
        oid: ObjectId = ObjectId()
        user: dict[str, Any] = {
            "_id": oid,
            "username": "player1",
            "password": "hashed",
            "scores": {"General": 100},
            "total_score": 100,
        }
        result: dict[str, Any] = UserDAO.parse_user(user)
        assert result["username"] == "player1"
        assert result["scores"] == {"General": 100}
        assert result["total_score"] == 100


class TestInsertOne:
    @pytest.mark.unit
    def test_calls_insert_one_on_users_collection(self) -> None:
        user_data: dict[str, Any] = {"username": "player1", "password": "hashed", "scores": {}, "total_score": 0}
        mock_result: MagicMock = MagicMock()
        with patch("src.data_access.user_dao.mongo") as mock_mongo:
            mock_mongo.db.users.insert_one.return_value = mock_result
            result = UserDAO.insert_one(user_data)
        mock_mongo.db.users.insert_one.assert_called_once_with(user_data)
        assert result == mock_result


class TestFind:
    @pytest.mark.unit
    def test_returns_parsed_list_of_users(self) -> None:
        oid: ObjectId = ObjectId()
        raw: list[dict[str, Any]] = [{"_id": oid, "username": "player1", "password": "h", "scores": {}, "total_score": 0}]
        with patch("src.data_access.user_dao.mongo") as mock_mongo:
            mock_mongo.db.users.find.return_value = raw
            result: list[dict[str, Any]] = UserDAO.find()
        assert len(result) == 1
        assert result[0]["_id"] == str(oid)

    @pytest.mark.unit
    def test_returns_empty_list_when_collection_is_empty(self) -> None:
        with patch("src.data_access.user_dao.mongo") as mock_mongo:
            mock_mongo.db.users.find.return_value = []
            result: list[dict[str, Any]] = UserDAO.find()
        assert result == []


class TestFindOneById:
    @pytest.mark.unit
    def test_returns_parsed_user_when_found(self) -> None:
        oid: ObjectId = ObjectId()
        raw: dict[str, Any] = {"_id": oid, "username": "player1", "password": "h", "scores": {}, "total_score": 0}
        with patch("src.data_access.user_dao.mongo") as mock_mongo:
            mock_mongo.db.users.find_one.return_value = raw
            result: dict[str, Any] | None = UserDAO.find_one_by_id(oid)
        assert result is not None
        assert result["_id"] == str(oid)

    @pytest.mark.unit
    def test_returns_none_when_not_found(self) -> None:
        with patch("src.data_access.user_dao.mongo") as mock_mongo:
            mock_mongo.db.users.find_one.return_value = None
            result: dict[str, Any] | None = UserDAO.find_one_by_id(ObjectId())
        assert result is None


class TestFindOneByUsername:
    @pytest.mark.unit
    def test_returns_user_when_username_matches(self) -> None:
        oid: ObjectId = ObjectId()
        raw: dict[str, Any] = {"_id": oid, "username": "player1", "password": "h", "scores": {}, "total_score": 0}
        with patch("src.data_access.user_dao.mongo") as mock_mongo:
            mock_mongo.db.users.find_one.return_value = raw
            result: dict[str, Any] | None = UserDAO.find_one_by_username("player1")
        assert result is not None
        assert result["username"] == "player1"

    @pytest.mark.unit
    def test_queries_by_exact_username(self) -> None:
        with patch("src.data_access.user_dao.mongo") as mock_mongo:
            mock_mongo.db.users.find_one.return_value = None
            UserDAO.find_one_by_username("player1")
        call_args: dict[str, str] = mock_mongo.db.users.find_one.call_args[0][0]
        assert call_args == {"username": "player1"}


class TestUpdateOneByUsername:
    @pytest.mark.unit
    def test_calls_update_one_with_set_operator(self) -> None:
        values: dict[str, Any] = {"scores": {"General": 200}, "total_score": 200}
        mock_result: MagicMock = MagicMock()
        with patch("src.data_access.user_dao.mongo") as mock_mongo:
            mock_mongo.db.users.update_one.return_value = mock_result
            result = UserDAO.update_one_by_username("player1", values)
        mock_mongo.db.users.update_one.assert_called_once_with(
            {"username": "player1"},
            {"$set": values},
        )
        assert result == mock_result


class TestDeleteOneById:
    @pytest.mark.unit
    def test_calls_delete_one_on_users_collection(self) -> None:
        oid: ObjectId = ObjectId()
        mock_result: MagicMock = MagicMock()
        with patch("src.data_access.user_dao.mongo") as mock_mongo:
            mock_mongo.db.users.delete_one.return_value = mock_result
            result = UserDAO.delete_one_by_id(oid)
        mock_mongo.db.users.delete_one.assert_called_once()
        assert result == mock_result
