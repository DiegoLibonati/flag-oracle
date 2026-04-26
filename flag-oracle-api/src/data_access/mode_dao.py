from typing import Any

from bson import ObjectId
from pymongo.results import DeleteResult, InsertOneResult

from src.configs.mongo_config import mongo


class ModeDAO:
    @staticmethod
    def insert_one(mode: dict[str, Any]) -> InsertOneResult:
        return mongo.db.modes.insert_one(mode)

    @staticmethod
    def find() -> list[dict[str, Any]]:
        return ModeDAO.parse_modes(list(mongo.db.modes.find()))

    @staticmethod
    def find_one_by_id(_id: ObjectId) -> dict[str, Any] | None:
        return ModeDAO.parse_mode(mongo.db.modes.find_one({"_id": ObjectId(_id)}))

    @staticmethod
    def find_one_by_name(name: str) -> dict[str, Any] | None:
        return ModeDAO.parse_mode(mongo.db.modes.find_one({"name": {"$regex": f"^{name}$", "$options": "i"}}))

    @staticmethod
    def delete_one_by_id(_id: ObjectId) -> DeleteResult:
        return mongo.db.modes.delete_one({"_id": ObjectId(_id)})

    @staticmethod
    def parse_modes(modes: list[dict[str, Any]]) -> list[dict[str, Any]]:
        return [ModeDAO.parse_mode(mode) for mode in modes]

    @staticmethod
    def parse_mode(mode: dict[str, Any]) -> dict[str, Any]:
        if not mode:
            return None

        return {
            **{k: v for k, v in mode.items() if k != "_id"},
            "_id": str(mode["_id"]),
        }
