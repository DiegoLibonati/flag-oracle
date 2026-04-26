from flask import Blueprint

from src.controllers.mode_controller import (
    add_mode,
    alive,
    delete_mode,
    find_mode,
    get_modes,
    top_mode,
)

mode_bp = Blueprint("mode", __name__)

mode_bp.route("/alive", methods=["GET"])(alive)
mode_bp.route("/", methods=["GET"])(get_modes)
mode_bp.route("/<id>", methods=["GET"])(find_mode)
mode_bp.route("/<id>/top", methods=["GET"])(top_mode)
mode_bp.route("/", methods=["POST"])(add_mode)
mode_bp.route("/<id>", methods=["DELETE"])(delete_mode)
