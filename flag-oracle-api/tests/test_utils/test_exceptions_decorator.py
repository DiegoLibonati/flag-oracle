import pytest
from pymongo.errors import PyMongoError

from src.constants.codes import (
    CODE_ERROR_DATABASE,
    CODE_ERROR_INTERNAL_SERVER,
    CODE_ERROR_PYDANTIC,
)
from src.constants.messages import (
    MESSAGE_ERROR_DATABASE,
    MESSAGE_ERROR_INTERNAL_SERVER,
    MESSAGE_ERROR_PYDANTIC,
)
from src.models.flag_model import FlagModel
from src.utils.exceptions import (
    BusinessAPIError,
    ConflictAPIError,
    InternalAPIError,
    NotFoundAPIError,
    ValidationAPIError,
)
from src.utils.exceptions_decorator import exceptions_decorator


class TestExceptionsDecorator:
    @pytest.mark.unit
    def test_passes_through_normal_return_value(self) -> None:
        @exceptions_decorator
        def fn() -> int:
            return 42

        assert fn() == 42

    @pytest.mark.unit
    def test_converts_pydantic_validation_error_to_validation_api_error(self) -> None:
        @exceptions_decorator
        def fn() -> None:
            FlagModel(name="", image="")

        with pytest.raises(ValidationAPIError):
            fn()

    @pytest.mark.unit
    def test_validation_api_error_has_400_status(self) -> None:
        @exceptions_decorator
        def fn() -> None:
            FlagModel(name="", image="valid_image")

        with pytest.raises(ValidationAPIError) as exc_info:
            fn()
        assert exc_info.value.status_code == 400

    @pytest.mark.unit
    def test_validation_api_error_has_pydantic_code(self) -> None:
        @exceptions_decorator
        def fn() -> None:
            FlagModel(name="", image="x")

        with pytest.raises(ValidationAPIError) as exc_info:
            fn()
        assert exc_info.value.code == CODE_ERROR_PYDANTIC

    @pytest.mark.unit
    def test_validation_api_error_has_pydantic_message(self) -> None:
        @exceptions_decorator
        def fn() -> None:
            FlagModel(name="", image="x")

        with pytest.raises(ValidationAPIError) as exc_info:
            fn()
        assert exc_info.value.message == MESSAGE_ERROR_PYDANTIC

    @pytest.mark.unit
    def test_validation_api_error_payload_contains_details(self) -> None:
        @exceptions_decorator
        def fn() -> None:
            FlagModel(name="", image="x")

        with pytest.raises(ValidationAPIError) as exc_info:
            fn()
        assert "details" in exc_info.value.payload
        assert isinstance(exc_info.value.payload["details"], list)

    @pytest.mark.unit
    def test_converts_pymongo_error_to_internal_api_error(self) -> None:
        @exceptions_decorator
        def fn() -> None:
            raise PyMongoError("db connection failed")

        with pytest.raises(InternalAPIError):
            fn()

    @pytest.mark.unit
    def test_internal_api_error_has_500_status(self) -> None:
        @exceptions_decorator
        def fn() -> None:
            raise PyMongoError("db error")

        with pytest.raises(InternalAPIError) as exc_info:
            fn()
        assert exc_info.value.status_code == 500

    @pytest.mark.unit
    def test_internal_api_error_has_database_code(self) -> None:
        @exceptions_decorator
        def fn() -> None:
            raise PyMongoError("db error")

        with pytest.raises(InternalAPIError) as exc_info:
            fn()
        assert exc_info.value.code == CODE_ERROR_DATABASE

    @pytest.mark.unit
    def test_internal_api_error_has_database_message(self) -> None:
        @exceptions_decorator
        def fn() -> None:
            raise PyMongoError("db error")

        with pytest.raises(InternalAPIError) as exc_info:
            fn()
        assert exc_info.value.message == MESSAGE_ERROR_DATABASE

    @pytest.mark.unit
    def test_wraps_unhandled_exceptions_as_internal_api_error(self) -> None:
        @exceptions_decorator
        def fn() -> None:
            raise ValueError("unhandled error")

        with pytest.raises(InternalAPIError) as exc_info:
            fn()
        assert exc_info.value.status_code == 500
        assert exc_info.value.code == CODE_ERROR_INTERNAL_SERVER
        assert exc_info.value.message == MESSAGE_ERROR_INTERNAL_SERVER
        assert isinstance(exc_info.value.__cause__, ValueError)

    @pytest.mark.unit
    def test_propagates_base_api_error_unchanged(self) -> None:
        original = NotFoundAPIError(code="X", message="not here")

        @exceptions_decorator
        def fn() -> None:
            raise original

        with pytest.raises(NotFoundAPIError) as exc_info:
            fn()
        assert exc_info.value is original

    @pytest.mark.unit
    def test_propagates_validation_api_error_unchanged(self) -> None:
        original = ValidationAPIError(code="X", message="bad")

        @exceptions_decorator
        def fn() -> None:
            raise original

        with pytest.raises(ValidationAPIError) as exc_info:
            fn()
        assert exc_info.value is original

    @pytest.mark.unit
    def test_propagates_conflict_api_error_unchanged(self) -> None:
        original = ConflictAPIError(code="X", message="dupe")

        @exceptions_decorator
        def fn() -> None:
            raise original

        with pytest.raises(ConflictAPIError) as exc_info:
            fn()
        assert exc_info.value is original

    @pytest.mark.unit
    def test_propagates_business_api_error_unchanged(self) -> None:
        original = BusinessAPIError(code="X", message="rule")

        @exceptions_decorator
        def fn() -> None:
            raise original

        with pytest.raises(BusinessAPIError) as exc_info:
            fn()
        assert exc_info.value is original

    @pytest.mark.unit
    def test_propagates_internal_api_error_unchanged(self) -> None:
        original = InternalAPIError(code="X", message="boom")

        @exceptions_decorator
        def fn() -> None:
            raise original

        with pytest.raises(InternalAPIError) as exc_info:
            fn()
        assert exc_info.value is original

    @pytest.mark.unit
    def test_preserves_original_function_name(self) -> None:
        @exceptions_decorator
        def my_function() -> None:
            pass

        assert my_function.__name__ == "my_function"

    @pytest.mark.unit
    def test_passes_args_and_kwargs_to_wrapped_function(self) -> None:
        @exceptions_decorator
        def fn(a: int, b: int = 0) -> int:
            return a + b

        assert fn(3, b=7) == 10
