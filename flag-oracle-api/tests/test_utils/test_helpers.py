import pytest

from src.utils.helpers import is_positive_integer


class TestIsPositiveInteger:
    @pytest.mark.unit
    def test_positive_int_returns_true(self) -> None:
        assert is_positive_integer(5) is True

    @pytest.mark.unit
    def test_negative_int_returns_false(self) -> None:
        assert is_positive_integer(-1) is False

    @pytest.mark.unit
    def test_zero_int_returns_false(self) -> None:
        assert is_positive_integer(0) is False

    @pytest.mark.unit
    def test_positive_string_returns_true(self) -> None:
        assert is_positive_integer("3") is True

    @pytest.mark.unit
    def test_zero_string_returns_false(self) -> None:
        assert is_positive_integer("0") is False

    @pytest.mark.unit
    def test_negative_string_returns_false(self) -> None:
        assert is_positive_integer("-5") is False

    @pytest.mark.unit
    def test_non_digit_string_returns_false(self) -> None:
        assert is_positive_integer("abc") is False

    @pytest.mark.unit
    def test_bool_true_returns_false(self) -> None:
        assert is_positive_integer(True) is False

    @pytest.mark.unit
    def test_bool_false_returns_false(self) -> None:
        assert is_positive_integer(False) is False

    @pytest.mark.unit
    def test_float_returns_false(self) -> None:
        assert is_positive_integer(1.5) is False

    @pytest.mark.unit
    def test_none_returns_false(self) -> None:
        assert is_positive_integer(None) is False

    @pytest.mark.unit
    def test_empty_string_returns_false(self) -> None:
        assert is_positive_integer("") is False

    @pytest.mark.unit
    def test_large_positive_int_returns_true(self) -> None:
        assert is_positive_integer(1000000) is True

    @pytest.mark.unit
    def test_large_positive_string_returns_true(self) -> None:
        assert is_positive_integer("999") is True
