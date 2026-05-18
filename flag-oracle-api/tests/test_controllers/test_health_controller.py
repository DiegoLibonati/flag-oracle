from typing import Any

import pytest
from flask import Flask

from src.constants.codes import CODE_SUCCESS_HEALTH, CODE_SUCCESS_READY
from src.constants.messages import MESSAGE_SUCCESS_HEALTH, MESSAGE_SUCCESS_READY
from src.controllers.health_controller import health, ready


class TestHealthFunction:
    @pytest.mark.unit
    def test_returns_200_status_code(self) -> None:
        minimal_app: Flask = Flask(__name__)
        with minimal_app.app_context():
            _, status_code = health()
        assert status_code == 200

    @pytest.mark.unit
    def test_response_body_contains_health_code(self) -> None:
        minimal_app: Flask = Flask(__name__)
        with minimal_app.app_context():
            response, _ = health()
            data: dict[str, Any] = response.get_json()
        assert data["code"] == CODE_SUCCESS_HEALTH

    @pytest.mark.unit
    def test_response_body_contains_health_message(self) -> None:
        minimal_app: Flask = Flask(__name__)
        with minimal_app.app_context():
            response, _ = health()
            data: dict[str, Any] = response.get_json()
        assert data["message"] == MESSAGE_SUCCESS_HEALTH


class TestReadyFunction:
    @pytest.mark.unit
    def test_returns_200_status_code(self) -> None:
        minimal_app: Flask = Flask(__name__)
        with minimal_app.app_context():
            _, status_code = ready()
        assert status_code == 200

    @pytest.mark.unit
    def test_response_body_contains_ready_code(self) -> None:
        minimal_app: Flask = Flask(__name__)
        with minimal_app.app_context():
            response, _ = ready()
            data: dict[str, Any] = response.get_json()
        assert data["code"] == CODE_SUCCESS_READY

    @pytest.mark.unit
    def test_response_body_contains_ready_message(self) -> None:
        minimal_app: Flask = Flask(__name__)
        with minimal_app.app_context():
            response, _ = ready()
            data: dict[str, Any] = response.get_json()
        assert data["message"] == MESSAGE_SUCCESS_READY


class TestHealthEndpointViaTestClient:
    @pytest.mark.integration
    def test_get_health_returns_200(self, client) -> None:
        response = client.get("/api/v1/health/")
        assert response.status_code == 200

    @pytest.mark.integration
    def test_get_health_returns_success_health_code(self, client) -> None:
        response = client.get("/api/v1/health/")
        data: dict[str, Any] = response.get_json()
        assert data["code"] == CODE_SUCCESS_HEALTH
