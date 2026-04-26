from unittest.mock import MagicMock, patch

import pytest

from src.constants.defaults import DEFAULT_FLAGS
from src.startup.init_flags import add_default_flags


class TestAddDefaultFlags:
    @pytest.mark.unit
    def test_does_not_insert_when_flags_already_exist(self) -> None:
        with patch("src.startup.init_flags.FlagService") as mock_service:
            mock_service.get_all_flags.return_value = [{"name": "existing", "image": "http://img.test/ex.png", "_id": "1"}]
            add_default_flags()
        mock_service.add_flag.assert_not_called()

    @pytest.mark.unit
    def test_inserts_all_default_flags_when_none_exist(self) -> None:
        with patch("src.startup.init_flags.FlagService") as mock_service:
            mock_service.get_all_flags.return_value = []
            mock_service.add_flag.return_value = MagicMock()
            add_default_flags()
        assert mock_service.add_flag.call_count == len(DEFAULT_FLAGS)

    @pytest.mark.unit
    def test_inserts_flags_with_correct_names(self) -> None:
        expected_names: list[str] = [f["name"] for f in DEFAULT_FLAGS]
        with patch("src.startup.init_flags.FlagService") as mock_service:
            mock_service.get_all_flags.return_value = []
            mock_service.add_flag.return_value = MagicMock()
            add_default_flags()
        actual_names: list[str] = [c.args[0].name for c in mock_service.add_flag.call_args_list]
        assert actual_names == expected_names

    @pytest.mark.unit
    def test_checks_existing_flags_before_inserting(self) -> None:
        with patch("src.startup.init_flags.FlagService") as mock_service:
            mock_service.get_all_flags.return_value = []
            mock_service.add_flag.return_value = MagicMock()
            add_default_flags()
        mock_service.get_all_flags.assert_called_once()
