from typing import Any
from unittest.mock import MagicMock, patch

import pytest
from bson import ObjectId

from src.data_access.mode_dao import ModeDAO


class TestParseModeMethod:
    @pytest.mark.unit
    def test_returns_none_when_input_is_none(self) -> None:
        result: dict[str, Any] | None = ModeDAO.parse_mode(None)
        assert result is None

    @pytest.mark.unit
    def test_converts_objectid_to_string(self) -> None:
        oid: ObjectId = ObjectId()
        mode: dict[str, Any] = {"_id": oid, "name": "Normal", "multiplier": 10, "timeleft": 90}
        result: dict[str, Any] = ModeDAO.parse_mode(mode)
        assert result["_id"] == str(oid)
        assert isinstance(result["_id"], str)

    @pytest.mark.unit
    def test_preserves_mode_fields(self) -> None:
        oid: ObjectId = ObjectId()
        mode: dict[str, Any] = {"_id": oid, "name": "Normal", "multiplier": 10, "timeleft": 90}
        result: dict[str, Any] = ModeDAO.parse_mode(mode)
        assert result["name"] == "Normal"
        assert result["multiplier"] == 10
        assert result["timeleft"] == 90


class TestInsertOne:
    @pytest.mark.unit
    def test_calls_insert_one_on_modes_collection(self) -> None:
        mode_data: dict[str, Any] = {"name": "Normal", "description": "desc", "multiplier": 10, "timeleft": 90}
        mock_result: MagicMock = MagicMock()
        with patch("src.data_access.mode_dao.mongo") as mock_mongo:
            mock_mongo.db.modes.insert_one.return_value = mock_result
            result = ModeDAO.insert_one(mode_data)
        mock_mongo.db.modes.insert_one.assert_called_once_with(mode_data)
        assert result == mock_result


class TestFind:
    @pytest.mark.unit
    def test_returns_parsed_list_of_modes(self) -> None:
        oid: ObjectId = ObjectId()
        raw: list[dict[str, Any]] = [{"_id": oid, "name": "Normal", "multiplier": 10, "timeleft": 90}]
        with patch("src.data_access.mode_dao.mongo") as mock_mongo:
            mock_mongo.db.modes.find.return_value = raw
            result: list[dict[str, Any]] = ModeDAO.find()
        assert len(result) == 1
        assert result[0]["_id"] == str(oid)

    @pytest.mark.unit
    def test_returns_empty_list_when_collection_is_empty(self) -> None:
        with patch("src.data_access.mode_dao.mongo") as mock_mongo:
            mock_mongo.db.modes.find.return_value = []
            result: list[dict[str, Any]] = ModeDAO.find()
        assert result == []


class TestFindOneById:
    @pytest.mark.unit
    def test_returns_parsed_mode_when_found(self) -> None:
        oid: ObjectId = ObjectId()
        raw: dict[str, Any] = {"_id": oid, "name": "Hard", "multiplier": 100, "timeleft": 60}
        with patch("src.data_access.mode_dao.mongo") as mock_mongo:
            mock_mongo.db.modes.find_one.return_value = raw
            result: dict[str, Any] | None = ModeDAO.find_one_by_id(oid)
        assert result is not None
        assert result["_id"] == str(oid)

    @pytest.mark.unit
    def test_returns_none_when_not_found(self) -> None:
        with patch("src.data_access.mode_dao.mongo") as mock_mongo:
            mock_mongo.db.modes.find_one.return_value = None
            result: dict[str, Any] | None = ModeDAO.find_one_by_id(ObjectId())
        assert result is None


class TestFindOneByName:
    @pytest.mark.unit
    def test_uses_case_insensitive_regex(self) -> None:
        oid: ObjectId = ObjectId()
        raw: dict[str, Any] = {"_id": oid, "name": "Normal"}
        with patch("src.data_access.mode_dao.mongo") as mock_mongo:
            mock_mongo.db.modes.find_one.return_value = raw
            ModeDAO.find_one_by_name("normal")
        call_args: dict[str, Any] = mock_mongo.db.modes.find_one.call_args[0][0]
        assert "$regex" in call_args["name"]
        assert call_args["name"]["$options"] == "i"


class TestDeleteOneById:
    @pytest.mark.unit
    def test_calls_delete_one_on_modes_collection(self) -> None:
        oid: ObjectId = ObjectId()
        mock_result: MagicMock = MagicMock()
        with patch("src.data_access.mode_dao.mongo") as mock_mongo:
            mock_mongo.db.modes.delete_one.return_value = mock_result
            result = ModeDAO.delete_one_by_id(oid)
        mock_mongo.db.modes.delete_one.assert_called_once()
        assert result == mock_result
