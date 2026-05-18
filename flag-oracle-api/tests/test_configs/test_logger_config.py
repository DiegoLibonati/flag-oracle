import logging

import pytest

from src.configs.logger_config import setup_logger


class TestSetupLogger:
    @pytest.mark.unit
    def test_returns_logger_instance(self) -> None:
        logger: logging.Logger = setup_logger("test_logger_returns")
        assert isinstance(logger, logging.Logger)

    @pytest.mark.unit
    def test_uses_default_name_when_not_provided(self) -> None:
        logger: logging.Logger = setup_logger()
        assert logger.name == "flask-app"

    @pytest.mark.unit
    def test_uses_provided_name(self) -> None:
        logger: logging.Logger = setup_logger("custom_logger_name")
        assert logger.name == "custom_logger_name"

    @pytest.mark.unit
    def test_logger_level_is_debug(self) -> None:
        logger: logging.Logger = setup_logger("test_logger_level")
        assert logger.level == logging.DEBUG

    @pytest.mark.unit
    def test_attaches_a_stream_handler(self) -> None:
        logger: logging.Logger = setup_logger("test_logger_stream_handler")
        assert any(isinstance(h, logging.StreamHandler) for h in logger.handlers)

    @pytest.mark.unit
    def test_handler_has_formatter(self) -> None:
        logger: logging.Logger = setup_logger("test_logger_formatter")
        handler: logging.Handler = next(iter(logger.handlers))
        assert handler.formatter is not None

    @pytest.mark.unit
    def test_does_not_duplicate_handlers_on_second_call(self) -> None:
        logger: logging.Logger = setup_logger("test_logger_no_dup")
        initial_count: int = len(logger.handlers)
        same_logger: logging.Logger = setup_logger("test_logger_no_dup")
        assert len(same_logger.handlers) == initial_count

    @pytest.mark.unit
    def test_returns_same_logger_instance_for_same_name(self) -> None:
        logger_a: logging.Logger = setup_logger("test_logger_same_name")
        logger_b: logging.Logger = setup_logger("test_logger_same_name")
        assert logger_a is logger_b
