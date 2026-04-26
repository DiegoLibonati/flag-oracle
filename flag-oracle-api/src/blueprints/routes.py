from flask import Flask

from src.blueprints.v1.flag_bp import flag_bp
from src.blueprints.v1.mode_bp import mode_bp
from src.blueprints.v1.user_bp import user_bp


def register_routes(app: Flask) -> None:
    prefix = "/api/v1"

    app.register_blueprint(flag_bp, url_prefix=f"{prefix}/flags")
    app.register_blueprint(mode_bp, url_prefix=f"{prefix}/modes")
    app.register_blueprint(user_bp, url_prefix=f"{prefix}/users")
