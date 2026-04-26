from src.constants.defaults import DEFAULT_FLAGS
from src.models.flag_model import FlagModel
from src.services.flag_service import FlagService


def add_default_flags() -> None:
    flags = FlagService.get_all_flags()

    if flags:
        return

    for default_flag in DEFAULT_FLAGS:
        FlagService.add_flag(FlagModel(**default_flag))
