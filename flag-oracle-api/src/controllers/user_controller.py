from functools import reduce

from flask import Response, jsonify, request

from src.constants.codes import (
    CODE_ERROR_AUTHENTICATION,
    CODE_NOT_FOUND_MODE,
    CODE_NOT_FOUND_USER,
    CODE_SUCCESS_ADD_USER,
    CODE_SUCCESS_DELETE_USER,
    CODE_SUCCESS_GET_GLOBAL_TOP_USER,
    CODE_SUCCESS_UPDATE_USER,
)
from src.constants.messages import (
    MESSAGE_ERROR_AUTHENTICATION,
    MESSAGE_NOT_FOUND_MODE,
    MESSAGE_NOT_FOUND_USER,
    MESSAGE_SUCCESS_ADD_USER,
    MESSAGE_SUCCESS_DELETE_USER,
    MESSAGE_SUCCESS_GET_GLOBAL_TOP_USER,
    MESSAGE_SUCCESS_UPDATE_USER,
)
from src.models.user_model import UserModel
from src.services.encrypt_service import EncryptService
from src.services.mode_service import ModeService
from src.services.user_service import UserService
from src.utils.exceptions import AuthenticationAPIError, NotFoundAPIError
from src.utils.exceptions_handler import exceptions_handler


@exceptions_handler
def alive() -> Response:
    response = {
        "message": "I am Alive!",
        "version_bp": "2.0.0",
        "author": "Diego Libonati",
        "name_bp": "Users",
    }

    return jsonify(response), 200


@exceptions_handler
def top_general() -> Response:
    users = UserService.get_top_users("General")

    response = {
        "code": CODE_SUCCESS_GET_GLOBAL_TOP_USER,
        "message": MESSAGE_SUCCESS_GET_GLOBAL_TOP_USER,
        "data": users,
    }

    return jsonify(response), 200


@exceptions_handler
def add_user() -> Response:
    body = request.json

    mode_id = body.get("mode_id", "").strip()

    mode = ModeService.get_mode_by_id(mode_id)

    if not mode:
        raise NotFoundAPIError(code=CODE_NOT_FOUND_MODE, message=MESSAGE_NOT_FOUND_MODE)

    username = body.get("username", "").strip()
    password = body.get("password", "").strip()
    score_actual = body.get("score")
    scores = {"General": score_actual, mode["name"]: score_actual}

    user = UserModel(
        **{
            "username": username,
            "password": EncryptService(password).password_hashed,
            "total_score": score_actual,
            "scores": scores,
        }
    )

    result = UserService.add_user(user)

    data = {"_id": str(result.inserted_id), **user.model_dump()}
    del data["password"]

    response = {
        "code": CODE_SUCCESS_ADD_USER,
        "message": MESSAGE_SUCCESS_ADD_USER,
        "data": data,
    }

    return jsonify(response), 201


@exceptions_handler
def modify_user() -> Response:
    body = request.json

    mode_id = body.get("mode_id", "").strip()

    mode = ModeService.get_mode_by_id(mode_id)

    if not mode:
        raise NotFoundAPIError(code=CODE_NOT_FOUND_MODE, message=MESSAGE_NOT_FOUND_MODE)

    username = body.get("username", "").strip()
    password = body.get("password", "").strip()
    score_actual = body.get("score")

    user = UserService.get_user_by_username(username)

    if not user:
        raise NotFoundAPIError(code=CODE_NOT_FOUND_USER, message=MESSAGE_NOT_FOUND_USER)

    if not EncryptService(password=password).valid_password(pwhash=user["password"]):
        raise AuthenticationAPIError(code=CODE_ERROR_AUTHENTICATION, message=MESSAGE_ERROR_AUTHENTICATION)

    mode_name = mode["name"]

    user["scores"][mode_name] = score_actual

    if mode_name not in user["scores"].keys():
        user["scores"]["General"] = user["scores"]["General"] + score_actual
    else:
        user["scores"]["General"] = reduce(lambda a, b: a + b, user["scores"].values()) - user["scores"]["General"]

    user["total_score"] = user["scores"]["General"]

    UserService.update_user_scores_by_username(user["username"], {"scores": user["scores"], "total_score": user["total_score"]})

    user = UserService.get_user_by_username(username)
    del user["password"]

    response = {
        "code": CODE_SUCCESS_UPDATE_USER,
        "message": MESSAGE_SUCCESS_UPDATE_USER,
        "data": user,
    }

    return jsonify(response), 200


@exceptions_handler
def delete_user(id: str) -> Response:
    UserService.delete_user_by_id(id)

    response = {
        "code": CODE_SUCCESS_DELETE_USER,
        "message": MESSAGE_SUCCESS_DELETE_USER,
    }

    return jsonify(response), 200
