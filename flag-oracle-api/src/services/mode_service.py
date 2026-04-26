from typing import Any

from bson import ObjectId
from pymongo.results import DeleteResult, InsertOneResult

from src.constants.codes import CODE_ALREADY_EXISTS_MODE, CODE_NOT_FOUND_MODE
from src.constants.messages import (
    MESSAGE_ALREADY_EXISTS_MODE,
    MESSAGE_NOT_FOUND_MODE,
)
from src.data_access.mode_dao import ModeDAO
from src.models.mode_model import ModeModel
from src.utils.exceptions import ConflictAPIError, NotFoundAPIError


class ModeService:
    @staticmethod
    def add_mode(mode: ModeModel) -> InsertOneResult:
        existing = ModeDAO.find_one_by_name(mode.name)
        if existing:
            raise ConflictAPIError(
                code=CODE_ALREADY_EXISTS_MODE,
                message=MESSAGE_ALREADY_EXISTS_MODE,
            )
        return ModeDAO.insert_one(mode.model_dump())

    @staticmethod
    def get_all_modes() -> list[dict[str, Any]]:
        return ModeDAO.find()

    @staticmethod
    def get_mode_by_id(_id: ObjectId) -> dict[str, Any] | None:
        return ModeDAO.find_one_by_id(_id)

    @staticmethod
    def get_mode_by_name(name: str) -> dict[str, Any] | None:
        return ModeDAO.find_one_by_name(name)

    @staticmethod
    def delete_mode_by_id(_id: ObjectId) -> DeleteResult:
        existing = ModeDAO.find_one_by_id(_id)

        if not existing:
            raise NotFoundAPIError(code=CODE_NOT_FOUND_MODE, message=MESSAGE_NOT_FOUND_MODE)

        return ModeDAO.delete_one_by_id(_id)
