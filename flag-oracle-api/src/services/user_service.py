from typing import Any

from bson import ObjectId
from pymongo.results import DeleteResult, InsertOneResult, UpdateResult

from src.constants.codes import CODE_ALREADY_EXISTS_USER, CODE_NOT_FOUND_USER
from src.constants.messages import (
    MESSAGE_ALREADY_EXISTS_USER,
    MESSAGE_NOT_FOUND_USER,
)
from src.data_access.user_dao import UserDAO
from src.models.user_model import UserModel
from src.utils.exceptions import ConflictAPIError, NotFoundAPIError


class UserService:
    @staticmethod
    def add_user(user: UserModel) -> InsertOneResult:
        existing = UserDAO.find_one_by_username(user.username)
        if existing:
            raise ConflictAPIError(
                code=CODE_ALREADY_EXISTS_USER,
                message=MESSAGE_ALREADY_EXISTS_USER,
            )
        return UserDAO.insert_one(user.model_dump())

    @staticmethod
    def get_all_users() -> list[dict[str, Any]]:
        return UserDAO.find()

    @staticmethod
    def get_user_by_username(username: str) -> list[dict[str, Any]]:
        return UserDAO.find_one_by_username(username)

    @staticmethod
    def get_top_users(mode_name: str) -> list[dict[str, Any]]:
        data = []

        for user in UserService.get_all_users():
            _id = user.get("_id")
            username = user.get("username")
            total_score = user.get("total_score")
            scores = user.get("scores")

            user_in_top = {}

            user_in_top["_id"] = str(_id)
            user_in_top["username"] = username

            if mode_name == "General":
                user_in_top["score"] = total_score
            else:
                user_in_top["score"] = scores.get(mode_name, 0)

            data.append(user_in_top)

        if not data:
            return []

        data.sort(key=lambda x: x["score"], reverse=True)

        return data[:10]

    @staticmethod
    def update_user_scores_by_username(username: str, values: dict[str, Any]) -> UpdateResult:
        return UserDAO.update_one_by_username(username, values)

    @staticmethod
    def delete_user_by_id(_id: ObjectId) -> DeleteResult:
        existing = UserDAO.find_one_by_id(_id)

        if not existing:
            raise NotFoundAPIError(code=CODE_NOT_FOUND_USER, message=MESSAGE_NOT_FOUND_USER)

        return UserDAO.delete_one_by_id(_id)
