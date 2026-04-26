from typing import Any

import pytest
from bson import ObjectId
from pymongo.database import Database


class TestFlagAlive:
    @pytest.mark.integration
    def test_returns_200(self, client) -> None:
        response = client.get("/api/v1/flags/alive")
        assert response.status_code == 200

    @pytest.mark.integration
    def test_response_contains_message(self, client) -> None:
        response = client.get("/api/v1/flags/alive")
        data: dict[str, str] = response.get_json()
        assert data["message"] == "I am Alive!"

    @pytest.mark.integration
    def test_response_contains_blueprint_name(self, client) -> None:
        response = client.get("/api/v1/flags/alive")
        data: dict[str, str] = response.get_json()
        assert data["name_bp"] == "Flags"


class TestGetFlags:
    @pytest.mark.integration
    def test_returns_200_with_empty_list(self, client, mongo_db: Database) -> None:
        response = client.get("/api/v1/flags/")
        assert response.status_code == 200
        data: dict[str, Any] = response.get_json()
        assert data["code"] == "SUCCESS_GET_ALL_FLAGS"
        assert data["data"] == []

    @pytest.mark.integration
    def test_returns_flags_when_data_exists(self, client, mongo_db: Database) -> None:
        client.post("/api/v1/flags/", json={"name": "Argentina", "image": "http://img.test/ar.png"})
        response = client.get("/api/v1/flags/")
        assert response.status_code == 200
        data: dict[str, Any] = response.get_json()
        assert len(data["data"]) == 1
        assert data["data"][0]["name"] == "Argentina"


class TestAddFlag:
    @pytest.mark.integration
    def test_returns_201_for_valid_flag(self, client, mongo_db: Database) -> None:
        response = client.post("/api/v1/flags/", json={"name": "Argentina", "image": "http://img.test/ar.png"})
        assert response.status_code == 201
        data: dict[str, Any] = response.get_json()
        assert data["code"] == "SUCCESS_ADD_FLAG"
        assert data["data"]["name"] == "Argentina"
        assert "_id" in data["data"]

    @pytest.mark.integration
    def test_returns_409_for_duplicate_flag(self, client, mongo_db: Database) -> None:
        client.post("/api/v1/flags/", json={"name": "Argentina", "image": "http://img.test/ar.png"})
        response = client.post("/api/v1/flags/", json={"name": "Argentina", "image": "http://img.test/ar.png"})
        assert response.status_code == 409
        data: dict[str, Any] = response.get_json()
        assert data["code"] == "ALREADY_EXISTS_FLAG"

    @pytest.mark.integration
    def test_returns_400_for_empty_name(self, client, mongo_db: Database) -> None:
        response = client.post("/api/v1/flags/", json={"name": "", "image": "http://img.test/ar.png"})
        assert response.status_code == 400
        data: dict[str, Any] = response.get_json()
        assert data["code"] == "ERROR_PYDANTIC"

    @pytest.mark.integration
    def test_returns_400_for_missing_image(self, client, mongo_db: Database) -> None:
        response = client.post("/api/v1/flags/", json={"name": "Argentina"})
        assert response.status_code == 400


class TestGetRandomFlags:
    @pytest.mark.integration
    def test_returns_200_with_flags(self, client, mongo_db: Database) -> None:
        client.post("/api/v1/flags/", json={"name": "Argentina", "image": "http://img.test/ar.png"})
        client.post("/api/v1/flags/", json={"name": "Brasil", "image": "http://img.test/br.png"})
        client.post("/api/v1/flags/", json={"name": "Peru", "image": "http://img.test/pe.png"})
        response = client.get("/api/v1/flags/random/2")
        assert response.status_code == 200
        data: dict[str, Any] = response.get_json()
        assert data["code"] == "SUCCESS_GET_ALL_FLAGS"
        assert len(data["data"]) == 2

    @pytest.mark.integration
    def test_returns_400_for_non_integer_quantity(self, client) -> None:
        response = client.get("/api/v1/flags/random/abc")
        assert response.status_code == 400
        data: dict[str, Any] = response.get_json()
        assert data["code"] == "NOT_VALID_INTEGER"

    @pytest.mark.integration
    def test_returns_400_for_zero_quantity(self, client) -> None:
        response = client.get("/api/v1/flags/random/0")
        assert response.status_code == 400

    @pytest.mark.integration
    def test_returns_400_for_negative_quantity(self, client) -> None:
        response = client.get("/api/v1/flags/random/-1")
        assert response.status_code == 400


class TestDeleteFlag:
    @pytest.mark.integration
    def test_returns_200_when_flag_deleted(self, client, mongo_db: Database) -> None:
        post_resp = client.post("/api/v1/flags/", json={"name": "Argentina", "image": "http://img.test/ar.png"})
        flag_id: str = post_resp.get_json()["data"]["_id"]
        response = client.delete(f"/api/v1/flags/{flag_id}")
        assert response.status_code == 200
        data: dict[str, Any] = response.get_json()
        assert data["code"] == "SUCCESS_DELETE_FLAG"

    @pytest.mark.integration
    def test_returns_404_when_flag_does_not_exist(self, client, mongo_db: Database) -> None:
        nonexistent_id: str = str(ObjectId())
        response = client.delete(f"/api/v1/flags/{nonexistent_id}")
        assert response.status_code == 404
        data: dict[str, Any] = response.get_json()
        assert data["code"] == "NOT_FOUND_FLAG"

    @pytest.mark.integration
    def test_flag_is_no_longer_returned_after_deletion(self, client, mongo_db: Database) -> None:
        post_resp = client.post("/api/v1/flags/", json={"name": "Argentina", "image": "http://img.test/ar.png"})
        flag_id: str = post_resp.get_json()["data"]["_id"]
        client.delete(f"/api/v1/flags/{flag_id}")
        get_resp = client.get("/api/v1/flags/")
        assert get_resp.get_json()["data"] == []
