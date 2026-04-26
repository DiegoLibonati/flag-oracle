import pytest
from pydantic import ValidationError

from src.models.flag_model import FlagModel


class TestFlagModel:
    @pytest.mark.unit
    def test_valid_flag_is_created(self) -> None:
        flag: FlagModel = FlagModel(name="Argentina", image="http://img.test/ar.png")
        assert flag.name == "Argentina"
        assert flag.image == "http://img.test/ar.png"

    @pytest.mark.unit
    def test_empty_name_raises_validation_error(self) -> None:
        with pytest.raises(ValidationError):
            FlagModel(name="", image="http://img.test/ar.png")

    @pytest.mark.unit
    def test_empty_image_raises_validation_error(self) -> None:
        with pytest.raises(ValidationError):
            FlagModel(name="Argentina", image="")

    @pytest.mark.unit
    def test_whitespace_only_name_raises_validation_error(self) -> None:
        with pytest.raises(ValidationError):
            FlagModel(name="   ", image="http://img.test/ar.png")

    @pytest.mark.unit
    def test_whitespace_only_image_raises_validation_error(self) -> None:
        with pytest.raises(ValidationError):
            FlagModel(name="Argentina", image="   ")

    @pytest.mark.unit
    def test_name_is_stripped_of_whitespace(self) -> None:
        flag: FlagModel = FlagModel(name="  Argentina  ", image="http://img.test/ar.png")
        assert flag.name == "Argentina"

    @pytest.mark.unit
    def test_image_is_stripped_of_whitespace(self) -> None:
        flag: FlagModel = FlagModel(name="Argentina", image="  http://img.test/ar.png  ")
        assert flag.image == "http://img.test/ar.png"

    @pytest.mark.unit
    def test_missing_name_raises_validation_error(self) -> None:
        with pytest.raises(ValidationError):
            FlagModel(image="http://img.test/ar.png")

    @pytest.mark.unit
    def test_missing_image_raises_validation_error(self) -> None:
        with pytest.raises(ValidationError):
            FlagModel(name="Argentina")

    @pytest.mark.unit
    def test_model_dump_returns_correct_dict(self) -> None:
        flag: FlagModel = FlagModel(name="Argentina", image="http://img.test/ar.png")
        data: dict[str, str] = flag.model_dump()
        assert data == {"name": "Argentina", "image": "http://img.test/ar.png"}
