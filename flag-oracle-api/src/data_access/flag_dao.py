from typing import Any

from bson import ObjectId
from pymongo.results import DeleteResult, InsertOneResult

from src.configs.mongo_config import mongo


class FlagDAO:
    @staticmethod
    def insert_one(flag: dict[str, Any]) -> InsertOneResult:
        return mongo.db.flags.insert_one(flag)

    @staticmethod
    def find() -> list[dict[str, Any]]:
        return FlagDAO.parse_flags(list(mongo.db.flags.find()))

    @staticmethod
    def find_random(quantity: int) -> list[dict[str, Any]]:
        return FlagDAO.parse_flags(list(mongo.db.flags.aggregate([{"$sample": {"size": quantity}}])))

    @staticmethod
    def find_one_by_id(_id: str) -> dict[str, Any] | None:
        return FlagDAO.parse_flag(mongo.db.flags.find_one({"_id": ObjectId(_id)}))

    @staticmethod
    def find_one_by_name(name: str) -> dict[str, Any] | None:
        return FlagDAO.parse_flag(mongo.db.flags.find_one({"name": {"$regex": f"^{name}$", "$options": "i"}}))

    @staticmethod
    def delete_one_by_id(_id: str) -> DeleteResult:
        return mongo.db.flags.delete_one({"_id": ObjectId(_id)})

    @staticmethod
    def parse_flags(flags: list[dict[str, Any]]) -> list[dict[str, Any]]:
        return [parsed for flag in flags if (parsed := FlagDAO.parse_flag(flag)) is not None]

    @staticmethod
    def parse_flag(flag: dict[str, Any] | None) -> dict[str, Any] | None:
        if not flag:
            return None

        return {
            **{k: v for k, v in flag.items() if k != "_id"},
            "_id": str(flag["_id"]),
        }
