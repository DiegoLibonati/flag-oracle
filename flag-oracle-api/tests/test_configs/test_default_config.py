import pytest

from src.configs.default_config import DefaultConfig


class TestDefaultConfigAttributes:
    @pytest.mark.unit
    def test_tz_is_string(self) -> None:
        assert isinstance(DefaultConfig.TZ, str)

    @pytest.mark.unit
    def test_mongo_host_is_string(self) -> None:
        assert isinstance(DefaultConfig.MONGO_HOST, str)

    @pytest.mark.unit
    def test_mongo_port_is_int(self) -> None:
        assert isinstance(DefaultConfig.MONGO_PORT, int)

    @pytest.mark.unit
    def test_mongo_user_is_string(self) -> None:
        assert isinstance(DefaultConfig.MONGO_USER, str)

    @pytest.mark.unit
    def test_mongo_pass_is_string(self) -> None:
        assert isinstance(DefaultConfig.MONGO_PASS, str)

    @pytest.mark.unit
    def test_mongo_db_name_is_string(self) -> None:
        assert isinstance(DefaultConfig.MONGO_DB_NAME, str)

    @pytest.mark.unit
    def test_mongo_auth_source_is_string(self) -> None:
        assert isinstance(DefaultConfig.MONGO_AUTH_SOURCE, str)

    @pytest.mark.unit
    def test_mongo_uri_is_built_from_parts(self) -> None:
        assert DefaultConfig.MONGO_HOST in DefaultConfig.MONGO_URI
        assert str(DefaultConfig.MONGO_PORT) in DefaultConfig.MONGO_URI
        assert DefaultConfig.MONGO_USER in DefaultConfig.MONGO_URI
        assert DefaultConfig.MONGO_DB_NAME in DefaultConfig.MONGO_URI

    @pytest.mark.unit
    def test_mongo_uri_starts_with_mongodb_scheme(self) -> None:
        assert DefaultConfig.MONGO_URI.startswith("mongodb://")

    @pytest.mark.unit
    def test_mongo_uri_includes_auth_source(self) -> None:
        assert f"authSource={DefaultConfig.MONGO_AUTH_SOURCE}" in DefaultConfig.MONGO_URI

    @pytest.mark.unit
    def test_json_as_ascii_is_false(self) -> None:
        assert DefaultConfig.JSON_AS_ASCII is False

    @pytest.mark.unit
    def test_host_is_string(self) -> None:
        assert isinstance(DefaultConfig.HOST, str)

    @pytest.mark.unit
    def test_port_is_int(self) -> None:
        assert isinstance(DefaultConfig.PORT, int)

    @pytest.mark.unit
    def test_max_content_length_is_int(self) -> None:
        assert isinstance(DefaultConfig.MAX_CONTENT_LENGTH, int)

    @pytest.mark.unit
    def test_max_content_length_is_positive(self) -> None:
        assert DefaultConfig.MAX_CONTENT_LENGTH > 0

    @pytest.mark.unit
    def test_debug_is_false_by_default(self) -> None:
        assert DefaultConfig.DEBUG is False

    @pytest.mark.unit
    def test_testing_is_false_by_default(self) -> None:
        assert DefaultConfig.TESTING is False

    @pytest.mark.unit
    def test_seed_default_data_is_false_by_default(self) -> None:
        assert DefaultConfig.SEED_DEFAULT_DATA is False


class TestDefaultConfigPytestEnvValues:
    @pytest.mark.unit
    def test_mongo_host_matches_pytest_env(self) -> None:
        assert DefaultConfig.MONGO_HOST == "localhost"

    @pytest.mark.unit
    def test_mongo_port_matches_pytest_env(self) -> None:
        assert DefaultConfig.MONGO_PORT == 27018

    @pytest.mark.unit
    def test_mongo_db_name_matches_pytest_env(self) -> None:
        assert DefaultConfig.MONGO_DB_NAME == "test_db"

    @pytest.mark.unit
    def test_port_matches_pytest_env(self) -> None:
        assert DefaultConfig.PORT == 5050
