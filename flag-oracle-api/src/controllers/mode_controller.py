from flask import jsonify, request
from flask.typing import ResponseReturnValue

from src.constants.codes import (
    CODE_NOT_FOUND_MODE,
    CODE_SUCCESS_ADD_MODE,
    CODE_SUCCESS_DELETE_MODE,
    CODE_SUCCESS_GET_ALL_MODES,
    CODE_SUCCESS_GET_MODE,
    CODE_SUCCESS_GET_TOP_MODE,
)
from src.constants.messages import (
    MESSAGE_NOT_FOUND_MODE,
    MESSAGE_SUCCESS_ADD_MODE,
    MESSAGE_SUCCESS_DELETE_MODE,
    MESSAGE_SUCCESS_GET_ALL_MODES,
    MESSAGE_SUCCESS_GET_MODE,
    MESSAGE_SUCCESS_GET_TOP_MODE,
)
from src.models.mode_model import ModeModel
from src.services.mode_service import ModeService
from src.services.user_service import UserService
from src.utils.exceptions import NotFoundAPIError
from src.utils.exceptions_decorator import exceptions_decorator


@exceptions_decorator
def alive() -> ResponseReturnValue:
    response = {
        "message": "I am Alive!",
        "version_bp": "2.0.0",
        "author": "Diego Libonati",
        "name_bp": "Modes",
    }

    return jsonify(response), 200


@exceptions_decorator
def get_modes() -> ResponseReturnValue:
    modes = ModeService.get_all_modes()

    response = {
        "code": CODE_SUCCESS_GET_ALL_MODES,
        "message": MESSAGE_SUCCESS_GET_ALL_MODES,
        "data": modes,
    }

    return jsonify(response), 200


@exceptions_decorator
def find_mode(id: str) -> ResponseReturnValue:
    mode = ModeService.get_mode_by_id(id)

    if not mode:
        raise NotFoundAPIError(code=CODE_NOT_FOUND_MODE, message=MESSAGE_NOT_FOUND_MODE)

    response = {
        "code": CODE_SUCCESS_GET_MODE,
        "message": MESSAGE_SUCCESS_GET_MODE,
        "data": mode,
    }

    return jsonify(response), 200


@exceptions_decorator
def add_mode() -> ResponseReturnValue:
    body = request.json
    mode = ModeModel(**body)

    result = ModeService.add_mode(mode=mode)

    data = {"_id": str(result.inserted_id), **mode.model_dump()}

    response = {
        "code": CODE_SUCCESS_ADD_MODE,
        "message": MESSAGE_SUCCESS_ADD_MODE,
        "data": data,
    }

    return jsonify(response), 201


@exceptions_decorator
def top_mode(id: str) -> ResponseReturnValue:
    mode = ModeService.get_mode_by_id(id)

    if not mode:
        raise NotFoundAPIError(code=CODE_NOT_FOUND_MODE, message=MESSAGE_NOT_FOUND_MODE)

    users = UserService.get_top_users(mode["name"])

    response = {
        "code": CODE_SUCCESS_GET_TOP_MODE,
        "message": MESSAGE_SUCCESS_GET_TOP_MODE,
        "data": users,
    }

    return jsonify(response), 200


@exceptions_decorator
def delete_mode(id: str) -> ResponseReturnValue:
    ModeService.delete_mode_by_id(id)

    response = {
        "code": CODE_SUCCESS_DELETE_MODE,
        "message": MESSAGE_SUCCESS_DELETE_MODE,
    }

    return jsonify(response), 200
