from unittest.mock import MagicMock, patch

import pytest
from pymongo.errors import ServerSelectionTimeoutError

from app import create_app
from src.startup.check_connections import (
    CONNECT_TIMEOUT_MS,
    MAX_CONNECTION_ATTEMPTS,
    RETRY_DELAY_SECONDS,
    check_connections,
    check_mongo_connection,
)

MONGO_URI: str = "mongodb://admin:pass@localhost:27017/testdb"


class TestCheckMongoConnection:
    @pytest.mark.unit
    def test_success_on_first_attempt_does_not_retry_or_warn(self) -> None:
        mock_client = MagicMock()
        with (
            patch("src.startup.check_connections.MongoClient", return_value=mock_client) as mock_client_class,
            patch("src.startup.check_connections.time.sleep") as mock_sleep,
            patch("src.startup.check_connections.logger") as mock_logger,
        ):
            result: bool = check_mongo_connection(MONGO_URI)
        assert result is True
        mock_client_class.assert_called_once_with(MONGO_URI, serverSelectionTimeoutMS=CONNECT_TIMEOUT_MS)
        mock_client.admin.command.assert_called_once_with("ping")
        mock_sleep.assert_not_called()
        mock_logger.warning.assert_not_called()
        mock_logger.info.assert_called_once()

    @pytest.mark.unit
    def test_success_on_third_attempt_stops_retrying(self) -> None:
        mock_client = MagicMock()
        mock_client.admin.command.side_effect = [
            ServerSelectionTimeoutError("down"),
            ServerSelectionTimeoutError("down"),
            {"ok": 1},
        ]
        with (
            patch("src.startup.check_connections.MongoClient", return_value=mock_client) as mock_client_class,
            patch("src.startup.check_connections.time.sleep") as mock_sleep,
            patch("src.startup.check_connections.logger") as mock_logger,
        ):
            result: bool = check_mongo_connection(MONGO_URI)
        assert result is True
        assert mock_client_class.call_count == 3
        assert mock_logger.warning.call_count == 2
        mock_logger.info.assert_called_once()
        assert mock_sleep.call_count == 2

    @pytest.mark.unit
    def test_five_failures_warn_and_return_without_raising(self) -> None:
        mock_client = MagicMock()
        mock_client.admin.command.side_effect = ServerSelectionTimeoutError("down")
        with (
            patch("src.startup.check_connections.MongoClient", return_value=mock_client) as mock_client_class,
            patch("src.startup.check_connections.time.sleep") as mock_sleep,
            patch("src.startup.check_connections.logger") as mock_logger,
        ):
            result: bool = check_mongo_connection(MONGO_URI)
        assert result is False
        assert mock_client_class.call_count == MAX_CONNECTION_ATTEMPTS
        assert mock_sleep.call_count == MAX_CONNECTION_ATTEMPTS - 1
        assert mock_logger.warning.call_count == MAX_CONNECTION_ATTEMPTS + 1
        assert "Could not connect" in mock_logger.warning.call_args_list[-1].args[0]

    @pytest.mark.unit
    def test_sleeps_with_configured_delay_between_attempts(self) -> None:
        mock_client = MagicMock()
        mock_client.admin.command.side_effect = [ServerSelectionTimeoutError("down"), {"ok": 1}]
        with (
            patch("src.startup.check_connections.MongoClient", return_value=mock_client),
            patch("src.startup.check_connections.time.sleep") as mock_sleep,
            patch("src.startup.check_connections.logger"),
        ):
            check_mongo_connection(MONGO_URI)
        mock_sleep.assert_called_once_with(RETRY_DELAY_SECONDS)

    @pytest.mark.unit
    def test_closes_client_after_each_attempt(self) -> None:
        mock_client = MagicMock()
        mock_client.admin.command.side_effect = ServerSelectionTimeoutError("down")
        with (
            patch("src.startup.check_connections.MongoClient", return_value=mock_client),
            patch("src.startup.check_connections.time.sleep"),
            patch("src.startup.check_connections.logger"),
        ):
            check_mongo_connection(MONGO_URI)
        assert mock_client.close.call_count == MAX_CONNECTION_ATTEMPTS


class TestCheckConnections:
    @pytest.mark.unit
    def test_checks_mongo_with_uri_from_app_config(self) -> None:
        mock_app = MagicMock()
        mock_app.config = {"MONGO_URI": MONGO_URI}
        with patch("src.startup.check_connections.check_mongo_connection") as mock_check:
            check_connections(mock_app)
        mock_check.assert_called_once_with(MONGO_URI)


class TestCheckConnectionsGating:
    @pytest.mark.unit
    def test_create_app_skips_check_when_check_connections_is_false(self) -> None:
        with patch("app.check_connections") as mock_check:
            create_app("testing")
        mock_check.assert_not_called()

    @pytest.mark.unit
    def test_create_app_runs_check_when_check_connections_is_true(self) -> None:
        with patch("app.check_connections") as mock_check:
            app = create_app("production")
        mock_check.assert_called_once_with(app)
