from typing import Any

from bson import ObjectId
from pymongo.results import DeleteResult, InsertOneResult, UpdateResult

from src.configs.mongo_config import mongo


class UserDAO:
    @staticmethod
    def insert_one(user: dict[str, Any]) -> InsertOneResult:
        return mongo.db.users.insert_one(user)

    @staticmethod
    def find() -> list[dict[str, Any]]:
        return UserDAO.parse_users(list(mongo.db.users.find()))

    @staticmethod
    def find_one_by_id(_id: ObjectId) -> dict[str, Any] | None:
        return UserDAO.parse_user(mongo.db.users.find_one({"_id": ObjectId(_id)}))

    @staticmethod
    def find_one_by_username(username: str) -> dict[str, Any] | None:
        return UserDAO.parse_user(mongo.db.users.find_one({"username": username}))

    @staticmethod
    def update_one_by_username(username: str, values: dict[str, Any]) -> UpdateResult:
        return mongo.db.users.update_one({"username": username}, {"$set": values})

    @staticmethod
    def delete_one_by_id(_id: ObjectId) -> DeleteResult:
        return mongo.db.users.delete_one({"_id": ObjectId(_id)})

    @staticmethod
    def parse_users(users: list[dict[str, Any]]) -> list[dict[str, Any]]:
        return [UserDAO.parse_user(user) for user in users]

    @staticmethod
    def parse_user(user: dict[str, Any]) -> dict[str, Any]:
        if not user:
            return None

        return {
            **{k: v for k, v in user.items() if k != "_id"},
            "_id": str(user["_id"]),
        }
