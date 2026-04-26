import pytest
from flask import Flask

from src.utils.exceptions import (
    AuthenticationAPIError,
    BaseAPIError,
    BusinessAPIError,
    ConflictAPIError,
    InternalAPIError,
    NotFoundAPIError,
    ValidationAPIError,
)


class TestBaseAPIError:
    @pytest.mark.unit
    def test_default_status_code_is_500(self) -> None:
        error: BaseAPIError = BaseAPIError()
        assert error.status_code == 500

    @pytest.mark.unit
    def test_custom_message_is_stored(self) -> None:
        error: BaseAPIError = BaseAPIError(code="SOME_CODE", message="custom message")
        assert error.message == "custom message"

    @pytest.mark.unit
    def test_custom_code_is_stored(self) -> None:
        error: BaseAPIError = BaseAPIError(code="MY_CODE")
        assert error.code == "MY_CODE"

    @pytest.mark.unit
    def test_custom_status_code_overrides_default(self) -> None:
        error: BaseAPIError = BaseAPIError(code="CODE", status_code=418)
        assert error.status_code == 418

    @pytest.mark.unit
    def test_to_dict_contains_code_and_message(self) -> None:
        error: BaseAPIError = BaseAPIError(code="TEST_CODE", message="test message")
        result: dict[str, str] = error.to_dict()
        assert result["code"] == "TEST_CODE"
        assert result["message"] == "test message"

    @pytest.mark.unit
    def test_to_dict_without_payload_has_no_payload_key(self) -> None:
        error: BaseAPIError = BaseAPIError(code="CODE", message="msg")
        result: dict[str, object] = error.to_dict()
        assert "payload" not in result

    @pytest.mark.unit
    def test_to_dict_with_payload_includes_payload(self) -> None:
        error: BaseAPIError = BaseAPIError(code="CODE", message="msg", payload={"key": "value"})
        result: dict[str, object] = error.to_dict()
        assert "payload" in result
        assert result["payload"]["key"] == "value"

    @pytest.mark.unit
    def test_flask_response_returns_correct_status_code(self) -> None:
        minimal_app: Flask = Flask(__name__)
        with minimal_app.app_context():
            error: BaseAPIError = BaseAPIError(code="CODE", message="msg", status_code=500)
            _, status_code = error.flask_response()
        assert status_code == 500

    @pytest.mark.unit
    def test_flask_response_body_contains_code(self) -> None:
        minimal_app: Flask = Flask(__name__)
        with minimal_app.app_context():
            error: BaseAPIError = BaseAPIError(code="MY_CODE", message="my message")
            response, _ = error.flask_response()
            data: dict[str, str] = response.get_json()
        assert data["code"] == "MY_CODE"


class TestValidationAPIError:
    @pytest.mark.unit
    def test_default_status_code_is_400(self) -> None:
        error: ValidationAPIError = ValidationAPIError(code="CODE")
        assert error.status_code == 400

    @pytest.mark.unit
    def test_is_subclass_of_base_api_error(self) -> None:
        assert issubclass(ValidationAPIError, BaseAPIError)


class TestAuthenticationAPIError:
    @pytest.mark.unit
    def test_default_status_code_is_401(self) -> None:
        error: AuthenticationAPIError = AuthenticationAPIError(code="CODE")
        assert error.status_code == 401

    @pytest.mark.unit
    def test_is_subclass_of_base_api_error(self) -> None:
        assert issubclass(AuthenticationAPIError, BaseAPIError)


class TestNotFoundAPIError:
    @pytest.mark.unit
    def test_default_status_code_is_404(self) -> None:
        error: NotFoundAPIError = NotFoundAPIError(code="CODE")
        assert error.status_code == 404

    @pytest.mark.unit
    def test_is_subclass_of_base_api_error(self) -> None:
        assert issubclass(NotFoundAPIError, BaseAPIError)


class TestConflictAPIError:
    @pytest.mark.unit
    def test_default_status_code_is_409(self) -> None:
        error: ConflictAPIError = ConflictAPIError(code="CODE")
        assert error.status_code == 409

    @pytest.mark.unit
    def test_is_subclass_of_base_api_error(self) -> None:
        assert issubclass(ConflictAPIError, BaseAPIError)


class TestBusinessAPIError:
    @pytest.mark.unit
    def test_default_status_code_is_422(self) -> None:
        error: BusinessAPIError = BusinessAPIError(code="CODE")
        assert error.status_code == 422

    @pytest.mark.unit
    def test_is_subclass_of_base_api_error(self) -> None:
        assert issubclass(BusinessAPIError, BaseAPIError)


class TestInternalAPIError:
    @pytest.mark.unit
    def test_default_status_code_is_500(self) -> None:
        error: InternalAPIError = InternalAPIError(code="CODE")
        assert error.status_code == 500

    @pytest.mark.unit
    def test_is_subclass_of_base_api_error(self) -> None:
        assert issubclass(InternalAPIError, BaseAPIError)
