from src.constants.defaults import DEFAULT_MODES
from src.models.mode_model import ModeModel
from src.services.mode_service import ModeService


def add_default_modes() -> None:
    modes = ModeService.get_all_modes()

    if modes:
        return

    for default_mode in DEFAULT_MODES:
        ModeService.add_mode(ModeModel(**default_mode))
