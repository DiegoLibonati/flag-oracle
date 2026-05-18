import pytest

from src.configs import gunicorn_config


class TestGunicornConfigModuleAttributes:
    @pytest.mark.unit
    def test_bind_is_string(self) -> None:
        assert isinstance(gunicorn_config.bind, str)

    @pytest.mark.unit
    def test_bind_contains_host_and_port(self) -> None:
        assert ":" in gunicorn_config.bind

    @pytest.mark.unit
    def test_bind_uses_pytest_env_port(self) -> None:
        assert gunicorn_config.bind.endswith(":5050")

    @pytest.mark.unit
    def test_workers_is_positive_int(self) -> None:
        assert isinstance(gunicorn_config.workers, int)
        assert gunicorn_config.workers > 0

    @pytest.mark.unit
    def test_threads_is_two(self) -> None:
        assert gunicorn_config.threads == 2

    @pytest.mark.unit
    def test_timeout_is_120(self) -> None:
        assert gunicorn_config.timeout == 120

    @pytest.mark.unit
    def test_graceful_timeout_is_30(self) -> None:
        assert gunicorn_config.graceful_timeout == 30

    @pytest.mark.unit
    def test_accesslog_logs_to_stdout(self) -> None:
        assert gunicorn_config.accesslog == "-"

    @pytest.mark.unit
    def test_errorlog_logs_to_stdout(self) -> None:
        assert gunicorn_config.errorlog == "-"

    @pytest.mark.unit
    def test_loglevel_is_info(self) -> None:
        assert gunicorn_config.loglevel == "info"

    @pytest.mark.unit
    def test_proc_name_is_flag_oracle_api(self) -> None:
        assert gunicorn_config.proc_name == "flag-oracle-api"
