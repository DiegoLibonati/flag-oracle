import pytest

from src.configs.default_config import DefaultConfig
from src.configs.testing_config import TestingConfig


class TestTestingConfig:
    @pytest.mark.unit
    def test_inherits_from_default_config(self) -> None:
        assert issubclass(TestingConfig, DefaultConfig)

    @pytest.mark.unit
    def test_testing_is_true(self) -> None:
        assert TestingConfig.TESTING is True

    @pytest.mark.unit
    def test_debug_is_true(self) -> None:
        assert TestingConfig.DEBUG is True

    @pytest.mark.unit
    def test_env_is_testing(self) -> None:
        assert TestingConfig.ENV == "testing"

    @pytest.mark.unit
    def test_mongo_uri_is_loaded_from_environment(self) -> None:
        assert isinstance(TestingConfig.MONGO_URI, str)
        assert TestingConfig.MONGO_URI.startswith("mongodb://")

    @pytest.mark.unit
    def test_mongo_db_name_is_string(self) -> None:
        assert isinstance(TestingConfig.MONGO_DB_NAME, str)
        assert TestingConfig.MONGO_DB_NAME != ""

    @pytest.mark.unit
    def test_seed_default_data_inherits_false(self) -> None:
        assert TestingConfig.SEED_DEFAULT_DATA is False

    @pytest.mark.unit
    def test_check_connections_is_false(self) -> None:
        assert TestingConfig.CHECK_CONNECTIONS is False
