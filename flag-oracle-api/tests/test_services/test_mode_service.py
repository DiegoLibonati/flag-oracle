from typing import Any
from unittest.mock import MagicMock, patch

import pytest

from src.models.mode_model import ModeModel
from src.services.mode_service import ModeService
from src.utils.exceptions import ConflictAPIError, NotFoundAPIError


class TestAddMode:
    @pytest.mark.unit
    def test_adds_mode_when_not_duplicate(self) -> None:
        mode: ModeModel = ModeModel(name="Normal", description="Normal mode", multiplier=10, timeleft=90)
        with patch("src.services.mode_service.ModeDAO") as mock_dao:
            mock_dao.find_one_by_name.return_value = None
            mock_dao.insert_one.return_value = MagicMock()
            ModeService.add_mode(mode)
        mock_dao.insert_one.assert_called_once_with(mode.model_dump())

    @pytest.mark.unit
    def test_raises_conflict_when_mode_name_already_exists(self) -> None:
        mode: ModeModel = ModeModel(name="Normal", description="desc", multiplier=10, timeleft=90)
        with patch("src.services.mode_service.ModeDAO") as mock_dao:
            mock_dao.find_one_by_name.return_value = {"name": "Normal", "_id": "1"}
            with pytest.raises(ConflictAPIError):
                ModeService.add_mode(mode)

    @pytest.mark.unit
    def test_does_not_insert_when_duplicate_found(self) -> None:
        mode: ModeModel = ModeModel(name="Hard", description="desc", multiplier=100, timeleft=60)
        with patch("src.services.mode_service.ModeDAO") as mock_dao:
            mock_dao.find_one_by_name.return_value = {"name": "Hard", "_id": "2"}
            with pytest.raises(ConflictAPIError):
                ModeService.add_mode(mode)
        mock_dao.insert_one.assert_not_called()


class TestGetAllModes:
    @pytest.mark.unit
    def test_returns_list_of_modes(self) -> None:
        expected: list[dict[str, Any]] = [{"name": "Normal", "_id": "1"}, {"name": "Hard", "_id": "2"}]
        with patch("src.services.mode_service.ModeDAO") as mock_dao:
            mock_dao.find.return_value = expected
            result: list[dict[str, Any]] = ModeService.get_all_modes()
        assert result == expected

    @pytest.mark.unit
    def test_returns_empty_list_when_no_modes(self) -> None:
        with patch("src.services.mode_service.ModeDAO") as mock_dao:
            mock_dao.find.return_value = []
            result: list[dict[str, Any]] = ModeService.get_all_modes()
        assert result == []


class TestGetModeById:
    @pytest.mark.unit
    def test_returns_mode_when_found(self) -> None:
        expected: dict[str, Any] = {"name": "Normal", "multiplier": 10, "timeleft": 90, "_id": "abc"}
        with patch("src.services.mode_service.ModeDAO") as mock_dao:
            mock_dao.find_one_by_id.return_value = expected
            result: dict[str, Any] | None = ModeService.get_mode_by_id("abc")
        assert result == expected

    @pytest.mark.unit
    def test_returns_none_when_not_found(self) -> None:
        with patch("src.services.mode_service.ModeDAO") as mock_dao:
            mock_dao.find_one_by_id.return_value = None
            result: dict[str, Any] | None = ModeService.get_mode_by_id("nonexistent")
        assert result is None


class TestGetModeByName:
    @pytest.mark.unit
    def test_returns_mode_when_name_matches(self) -> None:
        expected: dict[str, Any] = {"name": "Normal", "_id": "abc"}
        with patch("src.services.mode_service.ModeDAO") as mock_dao:
            mock_dao.find_one_by_name.return_value = expected
            result: dict[str, Any] | None = ModeService.get_mode_by_name("Normal")
        assert result == expected

    @pytest.mark.unit
    def test_returns_none_when_name_not_found(self) -> None:
        with patch("src.services.mode_service.ModeDAO") as mock_dao:
            mock_dao.find_one_by_name.return_value = None
            result: dict[str, Any] | None = ModeService.get_mode_by_name("Unknown")
        assert result is None


class TestDeleteModeById:
    @pytest.mark.unit
    def test_deletes_mode_when_it_exists(self) -> None:
        existing: dict[str, Any] = {"name": "Normal", "_id": "abc"}
        with patch("src.services.mode_service.ModeDAO") as mock_dao:
            mock_dao.find_one_by_id.return_value = existing
            mock_dao.delete_one_by_id.return_value = MagicMock()
            ModeService.delete_mode_by_id("abc")
        mock_dao.delete_one_by_id.assert_called_once_with("abc")

    @pytest.mark.unit
    def test_raises_not_found_when_mode_does_not_exist(self) -> None:
        with patch("src.services.mode_service.ModeDAO") as mock_dao:
            mock_dao.find_one_by_id.return_value = None
            with pytest.raises(NotFoundAPIError):
                ModeService.delete_mode_by_id("nonexistent")

    @pytest.mark.unit
    def test_does_not_call_delete_when_mode_not_found(self) -> None:
        with patch("src.services.mode_service.ModeDAO") as mock_dao:
            mock_dao.find_one_by_id.return_value = None
            with pytest.raises(NotFoundAPIError):
                ModeService.delete_mode_by_id("nonexistent")
        mock_dao.delete_one_by_id.assert_not_called()
