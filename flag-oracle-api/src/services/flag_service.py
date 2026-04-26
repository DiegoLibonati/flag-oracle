from typing import Any

from bson import ObjectId
from pymongo.results import DeleteResult, InsertOneResult

from src.constants.codes import CODE_ALREADY_EXISTS_FLAG, CODE_NOT_FOUND_FLAG
from src.constants.messages import (
    MESSAGE_ALREADY_EXISTS_FLAG,
    MESSAGE_NOT_FOUND_FLAG,
)
from src.data_access.flag_dao import FlagDAO
from src.models.flag_model import FlagModel
from src.utils.exceptions import ConflictAPIError, NotFoundAPIError


class FlagService:
    @staticmethod
    def add_flag(flag: FlagModel) -> InsertOneResult:
        existing = FlagDAO.find_one_by_name(flag.name)
        if existing:
            raise ConflictAPIError(
                code=CODE_ALREADY_EXISTS_FLAG,
                message=MESSAGE_ALREADY_EXISTS_FLAG,
            )
        return FlagDAO.insert_one(flag.model_dump())

    @staticmethod
    def get_all_flags() -> list[dict[str, Any]]:
        return FlagDAO.find()

    @staticmethod
    def get_random_flags(quantity: int) -> list[dict[str, Any]]:
        return FlagDAO.find_random(quantity)

    @staticmethod
    def delete_flag_by_id(_id: ObjectId) -> DeleteResult:
        existing = FlagDAO.find_one_by_id(_id)

        if not existing:
            raise NotFoundAPIError(code=CODE_NOT_FOUND_FLAG, message=MESSAGE_NOT_FOUND_FLAG)

        return FlagDAO.delete_one_by_id(_id)
