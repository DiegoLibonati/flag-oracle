import pytest
from flask import Blueprint, Flask

from src.blueprints.routes import register_routes
from src.blueprints.v1.flag_bp import flag_bp
from src.blueprints.v1.mode_bp import mode_bp
from src.blueprints.v1.user_bp import user_bp


class TestRegisterRoutes:
    @pytest.mark.unit
    def test_registers_flags_blueprint_at_v1_prefix(self) -> None:
        app: Flask = Flask(__name__)
        register_routes(app)
        rules: list[str] = [str(rule) for rule in app.url_map.iter_rules()]
        assert any(rule.startswith("/api/v1/flags") for rule in rules)

    @pytest.mark.unit
    def test_registers_modes_blueprint_at_v1_prefix(self) -> None:
        app: Flask = Flask(__name__)
        register_routes(app)
        rules: list[str] = [str(rule) for rule in app.url_map.iter_rules()]
        assert any(rule.startswith("/api/v1/modes") for rule in rules)

    @pytest.mark.unit
    def test_registers_users_blueprint_at_v1_prefix(self) -> None:
        app: Flask = Flask(__name__)
        register_routes(app)
        rules: list[str] = [str(rule) for rule in app.url_map.iter_rules()]
        assert any(rule.startswith("/api/v1/users") for rule in rules)

    @pytest.mark.unit
    def test_all_three_blueprints_are_registered(self) -> None:
        app: Flask = Flask(__name__)
        register_routes(app)
        rules: list[str] = [str(rule) for rule in app.url_map.iter_rules()]
        prefixes: list[str] = ["/api/v1/flags", "/api/v1/modes", "/api/v1/users"]
        for prefix in prefixes:
            assert any(rule.startswith(prefix) for rule in rules)


class TestFlagBlueprint:
    @pytest.mark.unit
    def test_flag_bp_is_blueprint_instance(self) -> None:
        assert isinstance(flag_bp, Blueprint)

    @pytest.mark.unit
    def test_flag_bp_registers_alive_route(self) -> None:
        app: Flask = Flask(__name__)
        app.register_blueprint(flag_bp, url_prefix="/api/v1/flags")
        rules: list[str] = [str(rule) for rule in app.url_map.iter_rules()]
        assert "/api/v1/flags/alive" in rules

    @pytest.mark.unit
    def test_flag_bp_registers_root_route(self) -> None:
        app: Flask = Flask(__name__)
        app.register_blueprint(flag_bp, url_prefix="/api/v1/flags")
        rules: list[str] = [str(rule) for rule in app.url_map.iter_rules()]
        assert "/api/v1/flags/" in rules

    @pytest.mark.unit
    def test_flag_bp_registers_random_route(self) -> None:
        app: Flask = Flask(__name__)
        app.register_blueprint(flag_bp, url_prefix="/api/v1/flags")
        rules: list[str] = [str(rule) for rule in app.url_map.iter_rules()]
        assert any("random" in rule for rule in rules)

    @pytest.mark.unit
    def test_flag_bp_registers_delete_route(self) -> None:
        app: Flask = Flask(__name__)
        app.register_blueprint(flag_bp, url_prefix="/api/v1/flags")
        methods_by_rule: dict[str, set[str]] = {str(rule): rule.methods for rule in app.url_map.iter_rules()}
        id_rules: list[str] = [r for r in methods_by_rule if r == "/api/v1/flags/<id>"]
        assert any("DELETE" in methods_by_rule[r] for r in id_rules)


class TestModeBlueprint:
    @pytest.mark.unit
    def test_mode_bp_is_blueprint_instance(self) -> None:
        assert isinstance(mode_bp, Blueprint)

    @pytest.mark.unit
    def test_mode_bp_registers_alive_route(self) -> None:
        app: Flask = Flask(__name__)
        app.register_blueprint(mode_bp, url_prefix="/api/v1/modes")
        rules: list[str] = [str(rule) for rule in app.url_map.iter_rules()]
        assert "/api/v1/modes/alive" in rules

    @pytest.mark.unit
    def test_mode_bp_registers_root_route(self) -> None:
        app: Flask = Flask(__name__)
        app.register_blueprint(mode_bp, url_prefix="/api/v1/modes")
        rules: list[str] = [str(rule) for rule in app.url_map.iter_rules()]
        assert "/api/v1/modes/" in rules

    @pytest.mark.unit
    def test_mode_bp_registers_id_route(self) -> None:
        app: Flask = Flask(__name__)
        app.register_blueprint(mode_bp, url_prefix="/api/v1/modes")
        rules: list[str] = [str(rule) for rule in app.url_map.iter_rules()]
        assert "/api/v1/modes/<id>" in rules

    @pytest.mark.unit
    def test_mode_bp_registers_top_route(self) -> None:
        app: Flask = Flask(__name__)
        app.register_blueprint(mode_bp, url_prefix="/api/v1/modes")
        rules: list[str] = [str(rule) for rule in app.url_map.iter_rules()]
        assert "/api/v1/modes/<id>/top" in rules


class TestUserBlueprint:
    @pytest.mark.unit
    def test_user_bp_is_blueprint_instance(self) -> None:
        assert isinstance(user_bp, Blueprint)

    @pytest.mark.unit
    def test_user_bp_registers_alive_route(self) -> None:
        app: Flask = Flask(__name__)
        app.register_blueprint(user_bp, url_prefix="/api/v1/users")
        rules: list[str] = [str(rule) for rule in app.url_map.iter_rules()]
        assert "/api/v1/users/alive" in rules

    @pytest.mark.unit
    def test_user_bp_registers_top_global_route(self) -> None:
        app: Flask = Flask(__name__)
        app.register_blueprint(user_bp, url_prefix="/api/v1/users")
        rules: list[str] = [str(rule) for rule in app.url_map.iter_rules()]
        assert "/api/v1/users/top_global" in rules

    @pytest.mark.unit
    def test_user_bp_registers_root_post_route(self) -> None:
        app: Flask = Flask(__name__)
        app.register_blueprint(user_bp, url_prefix="/api/v1/users")
        assert any(str(rule) == "/api/v1/users/" and "POST" in rule.methods for rule in app.url_map.iter_rules())

    @pytest.mark.unit
    def test_user_bp_registers_root_patch_route(self) -> None:
        app: Flask = Flask(__name__)
        app.register_blueprint(user_bp, url_prefix="/api/v1/users")
        methods_by_rule: dict[str, set[str]] = {str(rule): rule.methods for rule in app.url_map.iter_rules()}
        assert "PATCH" in methods_by_rule.get("/api/v1/users/", set())

    @pytest.mark.unit
    def test_user_bp_registers_delete_route(self) -> None:
        app: Flask = Flask(__name__)
        app.register_blueprint(user_bp, url_prefix="/api/v1/users")
        methods_by_rule: dict[str, set[str]] = {str(rule): rule.methods for rule in app.url_map.iter_rules()}
        id_rules: list[str] = [r for r in methods_by_rule if r == "/api/v1/users/<id>"]
        assert any("DELETE" in methods_by_rule[r] for r in id_rules)
