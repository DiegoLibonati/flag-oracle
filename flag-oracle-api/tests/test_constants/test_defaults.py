import pytest

from src.constants.defaults import DEFAULT_FLAGS, DEFAULT_MODES


class TestDefaultFlags:
    @pytest.mark.unit
    def test_default_flags_is_a_list(self) -> None:
        assert isinstance(DEFAULT_FLAGS, list)

    @pytest.mark.unit
    def test_default_flags_is_not_empty(self) -> None:
        assert len(DEFAULT_FLAGS) > 0

    @pytest.mark.unit
    def test_each_flag_has_name_field(self) -> None:
        for flag in DEFAULT_FLAGS:
            assert "name" in flag

    @pytest.mark.unit
    def test_each_flag_has_image_field(self) -> None:
        for flag in DEFAULT_FLAGS:
            assert "image" in flag

    @pytest.mark.unit
    def test_each_flag_name_is_non_empty_string(self) -> None:
        for flag in DEFAULT_FLAGS:
            assert isinstance(flag["name"], str)
            assert flag["name"] != ""

    @pytest.mark.unit
    def test_each_flag_image_is_non_empty_string(self) -> None:
        for flag in DEFAULT_FLAGS:
            assert isinstance(flag["image"], str)
            assert flag["image"] != ""

    @pytest.mark.unit
    def test_flag_names_are_unique(self) -> None:
        names: list[str] = [f["name"] for f in DEFAULT_FLAGS]
        assert len(names) == len(set(names))

    @pytest.mark.unit
    def test_each_flag_has_only_expected_keys(self) -> None:
        expected_keys: set[str] = {"name", "image"}
        for flag in DEFAULT_FLAGS:
            assert set(flag.keys()) == expected_keys


class TestDefaultModes:
    @pytest.mark.unit
    def test_default_modes_is_a_list(self) -> None:
        assert isinstance(DEFAULT_MODES, list)

    @pytest.mark.unit
    def test_default_modes_is_not_empty(self) -> None:
        assert len(DEFAULT_MODES) > 0

    @pytest.mark.unit
    def test_each_mode_has_name_field(self) -> None:
        for mode in DEFAULT_MODES:
            assert "name" in mode

    @pytest.mark.unit
    def test_each_mode_has_description_field(self) -> None:
        for mode in DEFAULT_MODES:
            assert "description" in mode

    @pytest.mark.unit
    def test_each_mode_has_multiplier_field(self) -> None:
        for mode in DEFAULT_MODES:
            assert "multiplier" in mode

    @pytest.mark.unit
    def test_each_mode_has_timeleft_field(self) -> None:
        for mode in DEFAULT_MODES:
            assert "timeleft" in mode

    @pytest.mark.unit
    def test_each_mode_name_is_non_empty_string(self) -> None:
        for mode in DEFAULT_MODES:
            assert isinstance(mode["name"], str)
            assert mode["name"] != ""

    @pytest.mark.unit
    def test_each_mode_multiplier_is_positive_int(self) -> None:
        for mode in DEFAULT_MODES:
            assert isinstance(mode["multiplier"], int)
            assert mode["multiplier"] > 0

    @pytest.mark.unit
    def test_each_mode_timeleft_is_positive_int(self) -> None:
        for mode in DEFAULT_MODES:
            assert isinstance(mode["timeleft"], int)
            assert mode["timeleft"] > 0

    @pytest.mark.unit
    def test_mode_names_are_unique(self) -> None:
        names: list[str] = [m["name"] for m in DEFAULT_MODES]
        assert len(names) == len(set(names))

    @pytest.mark.unit
    def test_each_mode_has_only_expected_keys(self) -> None:
        expected_keys: set[str] = {"name", "description", "multiplier", "timeleft"}
        for mode in DEFAULT_MODES:
            assert set(mode.keys()) == expected_keys

    @pytest.mark.unit
    def test_modes_have_different_timeleft_values(self) -> None:
        timelefts: list[int] = [m["timeleft"] for m in DEFAULT_MODES]
        assert len(timelefts) == len(set(timelefts))
