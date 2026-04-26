from typing import Any

import pytest
from bson import ObjectId
from pymongo.database import Database


def create_mode(client, name: str = "Normal") -> str:
    resp = client.post(
        "/api/v1/modes/",
        json={"name": name, "description": f"{name} mode", "multiplier": 10, "timeleft": 90},
    )
    return resp.get_json()["data"]["_id"]


class TestUserAlive:
    @pytest.mark.integration
    def test_returns_200(self, client) -> None:
        response = client.get("/api/v1/users/alive")
        assert response.status_code == 200

    @pytest.mark.integration
    def test_response_contains_blueprint_name(self, client) -> None:
        response = client.get("/api/v1/users/alive")
        data: dict[str, str] = response.get_json()
        assert data["name_bp"] == "Users"


class TestTopGeneral:
    @pytest.mark.integration
    def test_returns_200_with_empty_top(self, client, mongo_db: Database) -> None:
        response = client.get("/api/v1/users/top_global")
        assert response.status_code == 200
        data: dict[str, Any] = response.get_json()
        assert data["code"] == "SUCCESS_GET_GLOBAL_TOP_USER"
        assert data["data"] == []

    @pytest.mark.integration
    def test_returns_top_users_sorted_by_score(self, client, mongo_db: Database) -> None:
        mode_id: str = create_mode(client)
        client.post("/api/v1/users/", json={"mode_id": mode_id, "username": "alice", "password": "pass1", "score": 200})
        client.post("/api/v1/users/", json={"mode_id": mode_id, "username": "bob", "password": "pass2", "score": 100})
        response = client.get("/api/v1/users/top_global")
        data: dict[str, Any] = response.get_json()
        assert data["data"][0]["username"] == "alice"
        assert data["data"][1]["username"] == "bob"


class TestAddUser:
    @pytest.mark.integration
    def test_returns_201_for_valid_user(self, client, mongo_db: Database) -> None:
        mode_id: str = create_mode(client)
        response = client.post(
            "/api/v1/users/",
            json={"mode_id": mode_id, "username": "player1", "password": "secret123", "score": 100},
        )
        assert response.status_code == 201
        data: dict[str, Any] = response.get_json()
        assert data["code"] == "SUCCESS_ADD_USER"
        assert data["data"]["username"] == "player1"
        assert "_id" in data["data"]

    @pytest.mark.integration
    def test_response_does_not_contain_password(self, client, mongo_db: Database) -> None:
        mode_id: str = create_mode(client)
        response = client.post(
            "/api/v1/users/",
            json={"mode_id": mode_id, "username": "player1", "password": "secret123", "score": 100},
        )
        data: dict[str, Any] = response.get_json()
        assert "password" not in data["data"]

    @pytest.mark.integration
    def test_scores_are_initialized_correctly(self, client, mongo_db: Database) -> None:
        mode_id: str = create_mode(client, "Normal")
        response = client.post(
            "/api/v1/users/",
            json={"mode_id": mode_id, "username": "player1", "password": "secret123", "score": 150},
        )
        data: dict[str, Any] = response.get_json()
        assert data["data"]["scores"]["General"] == 150
        assert data["data"]["scores"]["Normal"] == 150
        assert data["data"]["total_score"] == 150

    @pytest.mark.integration
    def test_returns_404_when_mode_not_found(self, client, mongo_db: Database) -> None:
        nonexistent_mode_id: str = str(ObjectId())
        response = client.post(
            "/api/v1/users/",
            json={"mode_id": nonexistent_mode_id, "username": "player1", "password": "secret", "score": 100},
        )
        assert response.status_code == 404
        data: dict[str, Any] = response.get_json()
        assert data["code"] == "NOT_FOUND_MODE"

    @pytest.mark.integration
    def test_returns_409_for_duplicate_username(self, client, mongo_db: Database) -> None:
        mode_id: str = create_mode(client)
        client.post("/api/v1/users/", json={"mode_id": mode_id, "username": "player1", "password": "pass", "score": 100})
        response = client.post("/api/v1/users/", json={"mode_id": mode_id, "username": "player1", "password": "pass", "score": 100})
        assert response.status_code == 409
        data: dict[str, Any] = response.get_json()
        assert data["code"] == "ALREADY_EXISTS_USER"


class TestModifyUser:
    @pytest.mark.integration
    def test_returns_200_and_updates_scores(self, client, mongo_db: Database) -> None:
        mode_id: str = create_mode(client, "Normal")
        client.post("/api/v1/users/", json={"mode_id": mode_id, "username": "player1", "password": "secret", "score": 100})
        response = client.patch(
            "/api/v1/users/",
            json={"mode_id": mode_id, "username": "player1", "password": "secret", "score": 200},
        )
        assert response.status_code == 200
        data: dict[str, Any] = response.get_json()
        assert data["code"] == "SUCCESS_UPDATE_USER"
        assert data["data"]["scores"]["Normal"] == 200

    @pytest.mark.integration
    def test_response_does_not_contain_password(self, client, mongo_db: Database) -> None:
        mode_id: str = create_mode(client, "Normal")
        client.post("/api/v1/users/", json={"mode_id": mode_id, "username": "player1", "password": "secret", "score": 100})
        response = client.patch(
            "/api/v1/users/",
            json={"mode_id": mode_id, "username": "player1", "password": "secret", "score": 200},
        )
        data: dict[str, Any] = response.get_json()
        assert "password" not in data["data"]

    @pytest.mark.integration
    def test_returns_404_when_mode_not_found(self, client, mongo_db: Database) -> None:
        nonexistent_mode_id: str = str(ObjectId())
        response = client.patch(
            "/api/v1/users/",
            json={"mode_id": nonexistent_mode_id, "username": "player1", "password": "secret", "score": 200},
        )
        assert response.status_code == 404
        data: dict[str, Any] = response.get_json()
        assert data["code"] == "NOT_FOUND_MODE"

    @pytest.mark.integration
    def test_returns_404_when_user_not_found(self, client, mongo_db: Database) -> None:
        mode_id: str = create_mode(client)
        response = client.patch(
            "/api/v1/users/",
            json={"mode_id": mode_id, "username": "nonexistent", "password": "pass", "score": 100},
        )
        assert response.status_code == 404
        data: dict[str, Any] = response.get_json()
        assert data["code"] == "NOT_FOUND_USER"

    @pytest.mark.integration
    def test_returns_401_when_password_is_wrong(self, client, mongo_db: Database) -> None:
        mode_id: str = create_mode(client, "Normal")
        client.post("/api/v1/users/", json={"mode_id": mode_id, "username": "player1", "password": "correct", "score": 100})
        response = client.patch(
            "/api/v1/users/",
            json={"mode_id": mode_id, "username": "player1", "password": "wrong", "score": 200},
        )
        assert response.status_code == 401
        data: dict[str, Any] = response.get_json()
        assert data["code"] == "ERROR_AUTHENTICATION"


class TestDeleteUser:
    @pytest.mark.integration
    def test_returns_200_when_user_deleted(self, client, mongo_db: Database) -> None:
        mode_id: str = create_mode(client)
        post_resp = client.post("/api/v1/users/", json={"mode_id": mode_id, "username": "player1", "password": "pass", "score": 100})
        user_id: str = post_resp.get_json()["data"]["_id"]
        response = client.delete(f"/api/v1/users/{user_id}")
        assert response.status_code == 200
        data: dict[str, Any] = response.get_json()
        assert data["code"] == "SUCCESS_DELETE_USER"

    @pytest.mark.integration
    def test_returns_404_when_user_does_not_exist(self, client, mongo_db: Database) -> None:
        nonexistent_id: str = str(ObjectId())
        response = client.delete(f"/api/v1/users/{nonexistent_id}")
        assert response.status_code == 404
        data: dict[str, Any] = response.get_json()
        assert data["code"] == "NOT_FOUND_USER"
