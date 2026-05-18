import pytest

from src.configs.default_config import DefaultConfig
from src.configs.production_config import ProductionConfig


class TestProductionConfig:
    @pytest.mark.unit
    def test_inherits_from_default_config(self) -> None:
        assert issubclass(ProductionConfig, DefaultConfig)

    @pytest.mark.unit
    def test_debug_is_false(self) -> None:
        assert ProductionConfig.DEBUG is False

    @pytest.mark.unit
    def test_env_is_production(self) -> None:
        assert ProductionConfig.ENV == "production"

    @pytest.mark.unit
    def test_testing_inherits_false(self) -> None:
        assert ProductionConfig.TESTING is False

    @pytest.mark.unit
    def test_seed_default_data_inherits_false(self) -> None:
        assert ProductionConfig.SEED_DEFAULT_DATA is False

    @pytest.mark.unit
    def test_inherits_mongo_uri(self) -> None:
        assert ProductionConfig.MONGO_URI == DefaultConfig.MONGO_URI
