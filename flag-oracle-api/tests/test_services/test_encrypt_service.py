import pytest

from src.services.encrypt_service import EncryptService


class TestEncryptService:
    @pytest.mark.unit
    def test_password_property_returns_original_value(self) -> None:
        service: EncryptService = EncryptService("mypassword")
        assert service.password == "mypassword"

    @pytest.mark.unit
    def test_password_hashed_differs_from_original(self) -> None:
        service: EncryptService = EncryptService("mypassword")
        assert service.password_hashed != "mypassword"

    @pytest.mark.unit
    def test_password_hashed_is_werkzeug_format(self) -> None:
        service: EncryptService = EncryptService("mypassword")
        hashed: str = service.password_hashed
        assert ":" in hashed

    @pytest.mark.unit
    def test_valid_password_returns_true_for_correct_password(self) -> None:
        service: EncryptService = EncryptService("mypassword")
        hashed: str = service.password_hashed
        assert service.valid_password(hashed) is True

    @pytest.mark.unit
    def test_valid_password_returns_false_for_wrong_password(self) -> None:
        service: EncryptService = EncryptService("mypassword")
        hashed: str = service.password_hashed
        wrong_service: EncryptService = EncryptService("wrongpassword")
        assert wrong_service.valid_password(hashed) is False

    @pytest.mark.unit
    def test_two_hashes_of_same_password_are_different(self) -> None:
        service: EncryptService = EncryptService("mypassword")
        hash1: str = service.password_hashed
        hash2: str = service.password_hashed
        assert hash1 != hash2

    @pytest.mark.unit
    def test_valid_password_cross_instance_check(self) -> None:
        hasher: EncryptService = EncryptService("secret")
        hashed: str = hasher.password_hashed
        verifier: EncryptService = EncryptService("secret")
        assert verifier.valid_password(hashed) is True
