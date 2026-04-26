from unittest.mock import MagicMock, patch

import pytest

from src.constants.defaults import DEFAULT_MODES
from src.startup.init_modes import add_default_modes


class TestAddDefaultModes:
    @pytest.mark.unit
    def test_does_not_insert_when_modes_already_exist(self) -> None:
        with patch("src.startup.init_modes.ModeService") as mock_service:
            mock_service.get_all_modes.return_value = [{"name": "Normal", "_id": "1"}]
            add_default_modes()
        mock_service.add_mode.assert_not_called()

    @pytest.mark.unit
    def test_inserts_all_default_modes_when_none_exist(self) -> None:
        with patch("src.startup.init_modes.ModeService") as mock_service:
            mock_service.get_all_modes.return_value = []
            mock_service.add_mode.return_value = MagicMock()
            add_default_modes()
        assert mock_service.add_mode.call_count == len(DEFAULT_MODES)

    @pytest.mark.unit
    def test_inserts_modes_with_correct_names(self) -> None:
        expected_names: list[str] = [m["name"] for m in DEFAULT_MODES]
        with patch("src.startup.init_modes.ModeService") as mock_service:
            mock_service.get_all_modes.return_value = []
            mock_service.add_mode.return_value = MagicMock()
            add_default_modes()
        actual_names: list[str] = [c.args[0].name for c in mock_service.add_mode.call_args_list]
        assert actual_names == expected_names

    @pytest.mark.unit
    def test_checks_existing_modes_before_inserting(self) -> None:
        with patch("src.startup.init_modes.ModeService") as mock_service:
            mock_service.get_all_modes.return_value = []
            mock_service.add_mode.return_value = MagicMock()
            add_default_modes()
        mock_service.get_all_modes.assert_called_once()
