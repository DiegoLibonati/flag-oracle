import pytest
from pymongo.errors import PyMongoError

from src.constants.codes import CODE_ERROR_DATABASE, CODE_ERROR_PYDANTIC
from src.constants.messages import MESSAGE_ERROR_DATABASE, MESSAGE_ERROR_PYDANTIC
from src.models.flag_model import FlagModel
from src.utils.exceptions import InternalAPIError, ValidationAPIError
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
    def test_preserves_unhandled_exceptions(self) -> None:
        @exceptions_decorator
        def fn() -> None:
            raise ValueError("unhandled error")

        with pytest.raises(ValueError, match="unhandled error"):
            fn()

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
