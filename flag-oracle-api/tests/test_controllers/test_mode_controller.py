from typing import Any

import pytest
from bson import ObjectId
from pymongo.database import Database


class TestModeAlive:
    @pytest.mark.integration
    def test_returns_200(self, client) -> None:
        response = client.get("/api/v1/modes/alive")
        assert response.status_code == 200

    @pytest.mark.integration
    def test_response_contains_message(self, client) -> None:
        response = client.get("/api/v1/modes/alive")
        data: dict[str, str] = response.get_json()
        assert data["message"] == "I am Alive!"

    @pytest.mark.integration
    def test_response_contains_blueprint_name(self, client) -> None:
        response = client.get("/api/v1/modes/alive")
        data: dict[str, str] = response.get_json()
        assert data["name_bp"] == "Modes"


class TestGetModes:
    @pytest.mark.integration
    def test_returns_200_with_empty_list(self, client, mongo_db: Database) -> None:
        response = client.get("/api/v1/modes/")
        assert response.status_code == 200
        data: dict[str, Any] = response.get_json()
        assert data["code"] == "SUCCESS_GET_ALL_MODES"
        assert data["data"] == []

    @pytest.mark.integration
    def test_returns_modes_when_data_exists(self, client, mongo_db: Database) -> None:
        client.post("/api/v1/modes/", json={"name": "Normal", "description": "Normal mode", "multiplier": 10, "timeleft": 90})
        response = client.get("/api/v1/modes/")
        assert response.status_code == 200
        data: dict[str, Any] = response.get_json()
        assert len(data["data"]) == 1
        assert data["data"][0]["name"] == "Normal"


class TestFindMode:
    @pytest.mark.integration
    def test_returns_200_when_mode_found(self, client, mongo_db: Database) -> None:
        post_resp = client.post("/api/v1/modes/", json={"name": "Normal", "description": "Normal mode", "multiplier": 10, "timeleft": 90})
        mode_id: str = post_resp.get_json()["data"]["_id"]
        response = client.get(f"/api/v1/modes/{mode_id}")
        assert response.status_code == 200
        data: dict[str, Any] = response.get_json()
        assert data["code"] == "SUCCESS_GET_MODE"
        assert data["data"]["name"] == "Normal"

    @pytest.mark.integration
    def test_returns_404_when_mode_not_found(self, client, mongo_db: Database) -> None:
        nonexistent_id: str = str(ObjectId())
        response = client.get(f"/api/v1/modes/{nonexistent_id}")
        assert response.status_code == 404
        data: dict[str, Any] = response.get_json()
        assert data["code"] == "NOT_FOUND_MODE"


class TestAddMode:
    @pytest.mark.integration
    def test_returns_201_for_valid_mode(self, client, mongo_db: Database) -> None:
        response = client.post("/api/v1/modes/", json={"name": "Normal", "description": "Normal mode", "multiplier": 10, "timeleft": 90})
        assert response.status_code == 201
        data: dict[str, Any] = response.get_json()
        assert data["code"] == "SUCCESS_ADD_MODE"
        assert data["data"]["name"] == "Normal"
        assert "_id" in data["data"]

    @pytest.mark.integration
    def test_returns_409_for_duplicate_mode(self, client, mongo_db: Database) -> None:
        client.post("/api/v1/modes/", json={"name": "Normal", "description": "desc", "multiplier": 10, "timeleft": 90})
        response = client.post("/api/v1/modes/", json={"name": "Normal", "description": "desc", "multiplier": 10, "timeleft": 90})
        assert response.status_code == 409
        data: dict[str, Any] = response.get_json()
        assert data["code"] == "ALREADY_EXISTS_MODE"

    @pytest.mark.integration
    def test_returns_400_for_empty_name(self, client, mongo_db: Database) -> None:
        response = client.post("/api/v1/modes/", json={"name": "", "description": "desc", "multiplier": 10, "timeleft": 90})
        assert response.status_code == 400

    @pytest.mark.integration
    def test_returns_400_for_missing_multiplier(self, client, mongo_db: Database) -> None:
        response = client.post("/api/v1/modes/", json={"name": "Normal", "description": "desc", "timeleft": 90})
        assert response.status_code == 400


class TestTopMode:
    @pytest.mark.integration
    def test_returns_200_with_empty_top(self, client, mongo_db: Database) -> None:
        post_resp = client.post("/api/v1/modes/", json={"name": "Normal", "description": "Normal mode", "multiplier": 10, "timeleft": 90})
        mode_id: str = post_resp.get_json()["data"]["_id"]
        response = client.get(f"/api/v1/modes/{mode_id}/top")
        assert response.status_code == 200
        data: dict[str, Any] = response.get_json()
        assert data["code"] == "SUCCESS_GET_TOP_MODE"
        assert data["data"] == []

    @pytest.mark.integration
    def test_returns_404_when_mode_not_found(self, client, mongo_db: Database) -> None:
        nonexistent_id: str = str(ObjectId())
        response = client.get(f"/api/v1/modes/{nonexistent_id}/top")
        assert response.status_code == 404


class TestDeleteMode:
    @pytest.mark.integration
    def test_returns_200_when_mode_deleted(self, client, mongo_db: Database) -> None:
        post_resp = client.post("/api/v1/modes/", json={"name": "Normal", "description": "Normal mode", "multiplier": 10, "timeleft": 90})
        mode_id: str = post_resp.get_json()["data"]["_id"]
        response = client.delete(f"/api/v1/modes/{mode_id}")
        assert response.status_code == 200
        data: dict[str, Any] = response.get_json()
        assert data["code"] == "SUCCESS_DELETE_MODE"

    @pytest.mark.integration
    def test_returns_404_when_mode_does_not_exist(self, client, mongo_db: Database) -> None:
        nonexistent_id: str = str(ObjectId())
        response = client.delete(f"/api/v1/modes/{nonexistent_id}")
        assert response.status_code == 404
        data: dict[str, Any] = response.get_json()
        assert data["code"] == "NOT_FOUND_MODE"

    @pytest.mark.integration
    def test_mode_is_no_longer_returned_after_deletion(self, client, mongo_db: Database) -> None:
        post_resp = client.post("/api/v1/modes/", json={"name": "Normal", "description": "Normal mode", "multiplier": 10, "timeleft": 90})
        mode_id: str = post_resp.get_json()["data"]["_id"]
        client.delete(f"/api/v1/modes/{mode_id}")
        get_resp = client.get("/api/v1/modes/")
        assert get_resp.get_json()["data"] == []
