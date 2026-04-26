from typing import Any
from unittest.mock import MagicMock, patch

import pytest
from bson import ObjectId

from src.data_access.flag_dao import FlagDAO


class TestParseFlagMethod:
    @pytest.mark.unit
    def test_returns_none_when_input_is_none(self) -> None:
        result: dict[str, Any] | None = FlagDAO.parse_flag(None)
        assert result is None

    @pytest.mark.unit
    def test_converts_objectid_to_string(self) -> None:
        oid: ObjectId = ObjectId()
        flag: dict[str, Any] = {"_id": oid, "name": "Argentina", "image": "http://img.test/ar.png"}
        result: dict[str, Any] = FlagDAO.parse_flag(flag)
        assert result["_id"] == str(oid)
        assert isinstance(result["_id"], str)

    @pytest.mark.unit
    def test_preserves_name_and_image_fields(self) -> None:
        oid: ObjectId = ObjectId()
        flag: dict[str, Any] = {"_id": oid, "name": "Argentina", "image": "http://img.test/ar.png"}
        result: dict[str, Any] = FlagDAO.parse_flag(flag)
        assert result["name"] == "Argentina"
        assert result["image"] == "http://img.test/ar.png"


class TestInsertOne:
    @pytest.mark.unit
    def test_calls_insert_one_on_flags_collection(self) -> None:
        flag_data: dict[str, str] = {"name": "Argentina", "image": "http://img.test/ar.png"}
        mock_result: MagicMock = MagicMock()
        with patch("src.data_access.flag_dao.mongo") as mock_mongo:
            mock_mongo.db.flags.insert_one.return_value = mock_result
            result = FlagDAO.insert_one(flag_data)
        mock_mongo.db.flags.insert_one.assert_called_once_with(flag_data)
        assert result == mock_result


class TestFind:
    @pytest.mark.unit
    def test_returns_parsed_list_of_flags(self) -> None:
        oid: ObjectId = ObjectId()
        raw: list[dict[str, Any]] = [{"_id": oid, "name": "Argentina", "image": "http://img.test/ar.png"}]
        with patch("src.data_access.flag_dao.mongo") as mock_mongo:
            mock_mongo.db.flags.find.return_value = raw
            result: list[dict[str, Any]] = FlagDAO.find()
        assert len(result) == 1
        assert result[0]["_id"] == str(oid)

    @pytest.mark.unit
    def test_returns_empty_list_when_collection_is_empty(self) -> None:
        with patch("src.data_access.flag_dao.mongo") as mock_mongo:
            mock_mongo.db.flags.find.return_value = []
            result: list[dict[str, Any]] = FlagDAO.find()
        assert result == []


class TestFindRandom:
    @pytest.mark.unit
    def test_calls_aggregate_with_sample_stage(self) -> None:
        oid: ObjectId = ObjectId()
        raw: list[dict[str, Any]] = [{"_id": oid, "name": "Argentina", "image": "http://img.test/ar.png"}]
        with patch("src.data_access.flag_dao.mongo") as mock_mongo:
            mock_mongo.db.flags.aggregate.return_value = raw
            result: list[dict[str, Any]] = FlagDAO.find_random(1)
        mock_mongo.db.flags.aggregate.assert_called_once_with([{"$sample": {"size": 1}}])
        assert len(result) == 1


class TestFindOneById:
    @pytest.mark.unit
    def test_returns_parsed_flag_when_found(self) -> None:
        oid: ObjectId = ObjectId()
        raw: dict[str, Any] = {"_id": oid, "name": "Argentina", "image": "http://img.test/ar.png"}
        with patch("src.data_access.flag_dao.mongo") as mock_mongo:
            mock_mongo.db.flags.find_one.return_value = raw
            result: dict[str, Any] | None = FlagDAO.find_one_by_id(oid)
        assert result is not None
        assert result["_id"] == str(oid)

    @pytest.mark.unit
    def test_returns_none_when_not_found(self) -> None:
        with patch("src.data_access.flag_dao.mongo") as mock_mongo:
            mock_mongo.db.flags.find_one.return_value = None
            result: dict[str, Any] | None = FlagDAO.find_one_by_id(ObjectId())
        assert result is None


class TestFindOneByName:
    @pytest.mark.unit
    def test_uses_case_insensitive_regex(self) -> None:
        oid: ObjectId = ObjectId()
        raw: dict[str, Any] = {"_id": oid, "name": "Argentina", "image": "http://img.test/ar.png"}
        with patch("src.data_access.flag_dao.mongo") as mock_mongo:
            mock_mongo.db.flags.find_one.return_value = raw
            FlagDAO.find_one_by_name("argentina")
        call_args: dict[str, Any] = mock_mongo.db.flags.find_one.call_args[0][0]
        assert "$regex" in call_args["name"]
        assert call_args["name"]["$options"] == "i"


class TestDeleteOneById:
    @pytest.mark.unit
    def test_calls_delete_one_on_flags_collection(self) -> None:
        oid: ObjectId = ObjectId()
        mock_result: MagicMock = MagicMock()
        with patch("src.data_access.flag_dao.mongo") as mock_mongo:
            mock_mongo.db.flags.delete_one.return_value = mock_result
            result = FlagDAO.delete_one_by_id(oid)
        mock_mongo.db.flags.delete_one.assert_called_once()
        assert result == mock_result
