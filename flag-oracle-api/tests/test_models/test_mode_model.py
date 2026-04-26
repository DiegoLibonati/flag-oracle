import pytest
from pydantic import ValidationError

from src.models.mode_model import ModeModel


class TestModeModel:
    @pytest.mark.unit
    def test_valid_mode_is_created(self) -> None:
        mode: ModeModel = ModeModel(name="Normal", description="Normal mode", multiplier=10, timeleft=90)
        assert mode.name == "Normal"
        assert mode.description == "Normal mode"
        assert mode.multiplier == 10
        assert mode.timeleft == 90

    @pytest.mark.unit
    def test_empty_name_raises_validation_error(self) -> None:
        with pytest.raises(ValidationError):
            ModeModel(name="", description="desc", multiplier=10, timeleft=90)

    @pytest.mark.unit
    def test_empty_description_raises_validation_error(self) -> None:
        with pytest.raises(ValidationError):
            ModeModel(name="Normal", description="", multiplier=10, timeleft=90)

    @pytest.mark.unit
    def test_whitespace_only_name_raises_validation_error(self) -> None:
        with pytest.raises(ValidationError):
            ModeModel(name="   ", description="desc", multiplier=10, timeleft=90)

    @pytest.mark.unit
    def test_name_is_stripped_of_whitespace(self) -> None:
        mode: ModeModel = ModeModel(name="  Normal  ", description="desc", multiplier=10, timeleft=90)
        assert mode.name == "Normal"

    @pytest.mark.unit
    def test_missing_multiplier_raises_validation_error(self) -> None:
        with pytest.raises(ValidationError):
            ModeModel(name="Normal", description="desc", timeleft=90)

    @pytest.mark.unit
    def test_missing_timeleft_raises_validation_error(self) -> None:
        with pytest.raises(ValidationError):
            ModeModel(name="Normal", description="desc", multiplier=10)

    @pytest.mark.unit
    def test_missing_name_raises_validation_error(self) -> None:
        with pytest.raises(ValidationError):
            ModeModel(description="desc", multiplier=10, timeleft=90)

    @pytest.mark.unit
    def test_model_dump_returns_correct_dict(self) -> None:
        mode: ModeModel = ModeModel(name="Normal", description="Normal mode", multiplier=10, timeleft=90)
        data: dict[str, str | int] = mode.model_dump()
        assert data == {"name": "Normal", "description": "Normal mode", "multiplier": 10, "timeleft": 90}
