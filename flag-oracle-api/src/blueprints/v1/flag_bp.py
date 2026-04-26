from flask import Blueprint

from src.controllers.flag_controller import (
    add_flag,
    alive,
    delete_flag,
    flags,
    get_random_flags,
)

flag_bp = Blueprint("flag", __name__)

flag_bp.route("/alive", methods=["GET"])(alive)
flag_bp.route("/", methods=["GET"])(flags)
flag_bp.route("/", methods=["POST"])(add_flag)
flag_bp.route("/random/<quantity>", methods=["GET"])(get_random_flags)
flag_bp.route("/<id>", methods=["DELETE"])(delete_flag)
