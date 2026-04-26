from flask import Blueprint

from src.controllers.user_controller import (
    add_user,
    alive,
    delete_user,
    modify_user,
    top_general,
)

user_bp = Blueprint("user", __name__)

user_bp.route("/alive", methods=["GET"])(alive)
user_bp.route("/top_global", methods=["GET"])(top_general)
user_bp.route("/", methods=["POST"])(add_user)
user_bp.route("/", methods=["PATCH"])(modify_user)
user_bp.route("/<id>", methods=["DELETE"])(delete_user)
