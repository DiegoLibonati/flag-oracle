import pytest

from src.configs.default_config import DefaultConfig
from src.configs.development_config import DevelopmentConfig


class TestDevelopmentConfig:
    @pytest.mark.unit
    def test_inherits_from_default_config(self) -> None:
        assert issubclass(DevelopmentConfig, DefaultConfig)

    @pytest.mark.unit
    def test_debug_is_true(self) -> None:
        assert DevelopmentConfig.DEBUG is True

    @pytest.mark.unit
    def test_env_is_development(self) -> None:
        assert DevelopmentConfig.ENV == "development"

    @pytest.mark.unit
    def test_seed_default_data_is_true(self) -> None:
        assert DevelopmentConfig.SEED_DEFAULT_DATA is True

    @pytest.mark.unit
    def test_check_connections_inherits_true(self) -> None:
        assert DevelopmentConfig.CHECK_CONNECTIONS is True

    @pytest.mark.unit
    def test_testing_inherits_false(self) -> None:
        assert DevelopmentConfig.TESTING is False

    @pytest.mark.unit
    def test_inherits_mongo_uri(self) -> None:
        assert DevelopmentConfig.MONGO_URI == DefaultConfig.MONGO_URI

    @pytest.mark.unit
    def test_inherits_host_and_port(self) -> None:
        assert DevelopmentConfig.HOST == DefaultConfig.HOST
        assert DevelopmentConfig.PORT == DefaultConfig.PORT
