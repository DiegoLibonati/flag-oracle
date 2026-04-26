from typing import Any
from unittest.mock import MagicMock, patch

import pytest

from src.models.flag_model import FlagModel
from src.services.flag_service import FlagService
from src.utils.exceptions import ConflictAPIError, NotFoundAPIError


class TestAddFlag:
    @pytest.mark.unit
    def test_adds_flag_when_not_duplicate(self) -> None:
        flag: FlagModel = FlagModel(name="Argentina", image="http://img.test/ar.png")
        with patch("src.services.flag_service.FlagDAO") as mock_dao:
            mock_dao.find_one_by_name.return_value = None
            mock_dao.insert_one.return_value = MagicMock()
            FlagService.add_flag(flag)
        mock_dao.insert_one.assert_called_once_with(flag.model_dump())

    @pytest.mark.unit
    def test_raises_conflict_when_flag_name_already_exists(self) -> None:
        flag: FlagModel = FlagModel(name="Argentina", image="http://img.test/ar.png")
        with patch("src.services.flag_service.FlagDAO") as mock_dao:
            mock_dao.find_one_by_name.return_value = {"name": "Argentina", "image": "http://img.test/ar.png", "_id": "123"}
            with pytest.raises(ConflictAPIError):
                FlagService.add_flag(flag)

    @pytest.mark.unit
    def test_checks_name_before_inserting(self) -> None:
        flag: FlagModel = FlagModel(name="Brasil", image="http://img.test/br.png")
        with patch("src.services.flag_service.FlagDAO") as mock_dao:
            mock_dao.find_one_by_name.return_value = None
            mock_dao.insert_one.return_value = MagicMock()
            FlagService.add_flag(flag)
        mock_dao.find_one_by_name.assert_called_once_with("Brasil")


class TestGetAllFlags:
    @pytest.mark.unit
    def test_returns_list_of_flags(self) -> None:
        expected: list[dict[str, str]] = [{"name": "Argentina", "image": "http://img.test/ar.png", "_id": "1"}]
        with patch("src.services.flag_service.FlagDAO") as mock_dao:
            mock_dao.find.return_value = expected
            result: list[dict[str, Any]] = FlagService.get_all_flags()
        assert result == expected

    @pytest.mark.unit
    def test_returns_empty_list_when_no_flags_exist(self) -> None:
        with patch("src.services.flag_service.FlagDAO") as mock_dao:
            mock_dao.find.return_value = []
            result: list[dict[str, Any]] = FlagService.get_all_flags()
        assert result == []


class TestGetRandomFlags:
    @pytest.mark.unit
    def test_delegates_to_dao_with_quantity(self) -> None:
        flags: list[dict[str, str]] = [
            {"name": "Argentina", "image": "http://img.test/ar.png", "_id": "1"},
            {"name": "Brasil", "image": "http://img.test/br.png", "_id": "2"},
        ]
        with patch("src.services.flag_service.FlagDAO") as mock_dao:
            mock_dao.find_random.return_value = flags
            result: list[dict[str, Any]] = FlagService.get_random_flags(2)
        mock_dao.find_random.assert_called_once_with(2)
        assert len(result) == 2

    @pytest.mark.unit
    def test_returns_empty_list_when_no_flags(self) -> None:
        with patch("src.services.flag_service.FlagDAO") as mock_dao:
            mock_dao.find_random.return_value = []
            result: list[dict[str, Any]] = FlagService.get_random_flags(5)
        assert result == []


class TestDeleteFlagById:
    @pytest.mark.unit
    def test_deletes_flag_when_it_exists(self) -> None:
        existing: dict[str, str] = {"name": "Argentina", "image": "http://img.test/ar.png", "_id": "abc123"}
        with patch("src.services.flag_service.FlagDAO") as mock_dao:
            mock_dao.find_one_by_id.return_value = existing
            mock_dao.delete_one_by_id.return_value = MagicMock()
            FlagService.delete_flag_by_id("abc123")
        mock_dao.delete_one_by_id.assert_called_once_with("abc123")

    @pytest.mark.unit
    def test_raises_not_found_when_flag_does_not_exist(self) -> None:
        with patch("src.services.flag_service.FlagDAO") as mock_dao:
            mock_dao.find_one_by_id.return_value = None
            with pytest.raises(NotFoundAPIError):
                FlagService.delete_flag_by_id("nonexistent_id")

    @pytest.mark.unit
    def test_does_not_call_delete_when_flag_not_found(self) -> None:
        with patch("src.services.flag_service.FlagDAO") as mock_dao:
            mock_dao.find_one_by_id.return_value = None
            with pytest.raises(NotFoundAPIError):
                FlagService.delete_flag_by_id("nonexistent_id")
        mock_dao.delete_one_by_id.assert_not_called()
