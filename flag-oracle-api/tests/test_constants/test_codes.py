import pytest

from src.constants import codes


class TestSuccessCodes:
    @pytest.mark.unit
    def test_add_flag_code_exists_and_is_string(self) -> None:
        assert isinstance(codes.CODE_SUCCESS_ADD_FLAG, str)
        assert codes.CODE_SUCCESS_ADD_FLAG != ""

    @pytest.mark.unit
    def test_get_all_flags_code_exists_and_is_string(self) -> None:
        assert isinstance(codes.CODE_SUCCESS_GET_ALL_FLAGS, str)

    @pytest.mark.unit
    def test_delete_flag_code_exists_and_is_string(self) -> None:
        assert isinstance(codes.CODE_SUCCESS_DELETE_FLAG, str)

    @pytest.mark.unit
    def test_add_mode_code_exists_and_is_string(self) -> None:
        assert isinstance(codes.CODE_SUCCESS_ADD_MODE, str)

    @pytest.mark.unit
    def test_get_all_modes_code_exists_and_is_string(self) -> None:
        assert isinstance(codes.CODE_SUCCESS_GET_ALL_MODES, str)

    @pytest.mark.unit
    def test_get_mode_code_exists_and_is_string(self) -> None:
        assert isinstance(codes.CODE_SUCCESS_GET_MODE, str)

    @pytest.mark.unit
    def test_get_top_mode_code_exists_and_is_string(self) -> None:
        assert isinstance(codes.CODE_SUCCESS_GET_TOP_MODE, str)

    @pytest.mark.unit
    def test_delete_mode_code_exists_and_is_string(self) -> None:
        assert isinstance(codes.CODE_SUCCESS_DELETE_MODE, str)

    @pytest.mark.unit
    def test_add_user_code_exists_and_is_string(self) -> None:
        assert isinstance(codes.CODE_SUCCESS_ADD_USER, str)

    @pytest.mark.unit
    def test_update_user_code_exists_and_is_string(self) -> None:
        assert isinstance(codes.CODE_SUCCESS_UPDATE_USER, str)

    @pytest.mark.unit
    def test_delete_user_code_exists_and_is_string(self) -> None:
        assert isinstance(codes.CODE_SUCCESS_DELETE_USER, str)

    @pytest.mark.unit
    def test_get_global_top_user_code_exists_and_is_string(self) -> None:
        assert isinstance(codes.CODE_SUCCESS_GET_GLOBAL_TOP_USER, str)


class TestErrorCodes:
    @pytest.mark.unit
    def test_internal_server_error_code_exists(self) -> None:
        assert isinstance(codes.CODE_ERROR_INTERNAL_SERVER, str)
        assert codes.CODE_ERROR_INTERNAL_SERVER != ""

    @pytest.mark.unit
    def test_pydantic_error_code_exists(self) -> None:
        assert isinstance(codes.CODE_ERROR_PYDANTIC, str)

    @pytest.mark.unit
    def test_database_error_code_exists(self) -> None:
        assert isinstance(codes.CODE_ERROR_DATABASE, str)

    @pytest.mark.unit
    def test_authentication_error_code_exists(self) -> None:
        assert isinstance(codes.CODE_ERROR_AUTHENTICATION, str)


class TestNotFoundCodes:
    @pytest.mark.unit
    def test_not_found_flag_code_exists(self) -> None:
        assert isinstance(codes.CODE_NOT_FOUND_FLAG, str)
        assert codes.CODE_NOT_FOUND_FLAG != ""

    @pytest.mark.unit
    def test_not_found_mode_code_exists(self) -> None:
        assert isinstance(codes.CODE_NOT_FOUND_MODE, str)

    @pytest.mark.unit
    def test_not_found_user_code_exists(self) -> None:
        assert isinstance(codes.CODE_NOT_FOUND_USER, str)

    @pytest.mark.unit
    def test_not_valid_integer_code_exists(self) -> None:
        assert isinstance(codes.CODE_NOT_VALID_INTEGER, str)


class TestAlreadyExistsCodes:
    @pytest.mark.unit
    def test_already_exists_flag_code_exists(self) -> None:
        assert isinstance(codes.CODE_ALREADY_EXISTS_FLAG, str)
        assert codes.CODE_ALREADY_EXISTS_FLAG != ""

    @pytest.mark.unit
    def test_already_exists_mode_code_exists(self) -> None:
        assert isinstance(codes.CODE_ALREADY_EXISTS_MODE, str)

    @pytest.mark.unit
    def test_already_exists_user_code_exists(self) -> None:
        assert isinstance(codes.CODE_ALREADY_EXISTS_USER, str)


class TestCodeUniqueness:
    @pytest.mark.unit
    def test_all_success_codes_are_unique(self) -> None:
        success_codes: list[str] = [
            codes.CODE_SUCCESS_ADD_FLAG,
            codes.CODE_SUCCESS_GET_ALL_FLAGS,
            codes.CODE_SUCCESS_DELETE_FLAG,
            codes.CODE_SUCCESS_ADD_MODE,
            codes.CODE_SUCCESS_GET_ALL_MODES,
            codes.CODE_SUCCESS_GET_MODE,
            codes.CODE_SUCCESS_GET_TOP_MODE,
            codes.CODE_SUCCESS_DELETE_MODE,
            codes.CODE_SUCCESS_ADD_USER,
            codes.CODE_SUCCESS_UPDATE_USER,
            codes.CODE_SUCCESS_DELETE_USER,
            codes.CODE_SUCCESS_GET_GLOBAL_TOP_USER,
        ]
        assert len(success_codes) == len(set(success_codes))

    @pytest.mark.unit
    def test_not_found_codes_are_unique(self) -> None:
        not_found_codes: list[str] = [
            codes.CODE_NOT_FOUND_FLAG,
            codes.CODE_NOT_FOUND_MODE,
            codes.CODE_NOT_FOUND_USER,
        ]
        assert len(not_found_codes) == len(set(not_found_codes))

    @pytest.mark.unit
    def test_already_exists_codes_are_unique(self) -> None:
        already_exists_codes: list[str] = [
            codes.CODE_ALREADY_EXISTS_FLAG,
            codes.CODE_ALREADY_EXISTS_MODE,
            codes.CODE_ALREADY_EXISTS_USER,
        ]
        assert len(already_exists_codes) == len(set(already_exists_codes))
