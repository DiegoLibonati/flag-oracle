import pytest

from src.constants import messages


class TestSuccessMessages:
    @pytest.mark.unit
    def test_add_flag_message_is_non_empty_string(self) -> None:
        assert isinstance(messages.MESSAGE_SUCCESS_ADD_FLAG, str)
        assert messages.MESSAGE_SUCCESS_ADD_FLAG != ""

    @pytest.mark.unit
    def test_get_all_flags_message_is_non_empty_string(self) -> None:
        assert isinstance(messages.MESSAGE_SUCCESS_GET_ALL_FLAGS, str)
        assert messages.MESSAGE_SUCCESS_GET_ALL_FLAGS != ""

    @pytest.mark.unit
    def test_delete_flag_message_is_non_empty_string(self) -> None:
        assert isinstance(messages.MESSAGE_SUCCESS_DELETE_FLAG, str)

    @pytest.mark.unit
    def test_add_mode_message_is_non_empty_string(self) -> None:
        assert isinstance(messages.MESSAGE_SUCCESS_ADD_MODE, str)

    @pytest.mark.unit
    def test_get_all_modes_message_is_non_empty_string(self) -> None:
        assert isinstance(messages.MESSAGE_SUCCESS_GET_ALL_MODES, str)

    @pytest.mark.unit
    def test_add_user_message_is_non_empty_string(self) -> None:
        assert isinstance(messages.MESSAGE_SUCCESS_ADD_USER, str)

    @pytest.mark.unit
    def test_update_user_message_is_non_empty_string(self) -> None:
        assert isinstance(messages.MESSAGE_SUCCESS_UPDATE_USER, str)

    @pytest.mark.unit
    def test_delete_user_message_is_non_empty_string(self) -> None:
        assert isinstance(messages.MESSAGE_SUCCESS_DELETE_USER, str)


class TestErrorMessages:
    @pytest.mark.unit
    def test_internal_server_error_message_is_non_empty_string(self) -> None:
        assert isinstance(messages.MESSAGE_ERROR_INTERNAL_SERVER, str)
        assert messages.MESSAGE_ERROR_INTERNAL_SERVER != ""

    @pytest.mark.unit
    def test_pydantic_error_message_is_non_empty_string(self) -> None:
        assert isinstance(messages.MESSAGE_ERROR_PYDANTIC, str)

    @pytest.mark.unit
    def test_database_error_message_is_non_empty_string(self) -> None:
        assert isinstance(messages.MESSAGE_ERROR_DATABASE, str)

    @pytest.mark.unit
    def test_authentication_error_message_is_non_empty_string(self) -> None:
        assert isinstance(messages.MESSAGE_ERROR_AUTHENTICATION, str)


class TestNotFoundMessages:
    @pytest.mark.unit
    def test_not_found_flag_message_is_non_empty_string(self) -> None:
        assert isinstance(messages.MESSAGE_NOT_FOUND_FLAG, str)
        assert messages.MESSAGE_NOT_FOUND_FLAG != ""

    @pytest.mark.unit
    def test_not_found_mode_message_is_non_empty_string(self) -> None:
        assert isinstance(messages.MESSAGE_NOT_FOUND_MODE, str)

    @pytest.mark.unit
    def test_not_found_user_message_is_non_empty_string(self) -> None:
        assert isinstance(messages.MESSAGE_NOT_FOUND_USER, str)

    @pytest.mark.unit
    def test_not_valid_integer_message_is_non_empty_string(self) -> None:
        assert isinstance(messages.MESSAGE_NOT_VALID_INTEGER, str)


class TestAlreadyExistsMessages:
    @pytest.mark.unit
    def test_already_exists_flag_message_is_non_empty_string(self) -> None:
        assert isinstance(messages.MESSAGE_ALREADY_EXISTS_FLAG, str)
        assert messages.MESSAGE_ALREADY_EXISTS_FLAG != ""

    @pytest.mark.unit
    def test_already_exists_mode_message_is_non_empty_string(self) -> None:
        assert isinstance(messages.MESSAGE_ALREADY_EXISTS_MODE, str)

    @pytest.mark.unit
    def test_already_exists_user_message_is_non_empty_string(self) -> None:
        assert isinstance(messages.MESSAGE_ALREADY_EXISTS_USER, str)
