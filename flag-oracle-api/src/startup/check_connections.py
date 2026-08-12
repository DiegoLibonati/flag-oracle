import time

from flask import Flask
from pymongo import MongoClient
from pymongo.errors import PyMongoError

from src.configs.logger_config import setup_logger

logger = setup_logger(__name__)

MAX_CONNECTION_ATTEMPTS = 5
RETRY_DELAY_SECONDS = 2
CONNECT_TIMEOUT_MS = 3000

MONGO_SERVICE_NAME = "MongoDB"


def check_mongo_connection(mongo_uri: str) -> bool:
    for attempt in range(1, MAX_CONNECTION_ATTEMPTS + 1):
        client: MongoClient | None = None
        try:
            client = MongoClient(mongo_uri, serverSelectionTimeoutMS=CONNECT_TIMEOUT_MS)
            client.admin.command("ping")
            logger.info(
                "%s connection verified on attempt %d/%d.", MONGO_SERVICE_NAME, attempt, MAX_CONNECTION_ATTEMPTS
            )
            return True
        except PyMongoError:
            logger.warning("%s connection attempt %d/%d failed.", MONGO_SERVICE_NAME, attempt, MAX_CONNECTION_ATTEMPTS)
            if attempt < MAX_CONNECTION_ATTEMPTS:
                time.sleep(RETRY_DELAY_SECONDS)
        finally:
            if client is not None:
                client.close()

    logger.warning(
        "Could not connect to %s after %d attempts. The app will continue running, "
        "but %s-dependent features will fail until the connection is available.",
        MONGO_SERVICE_NAME,
        MAX_CONNECTION_ATTEMPTS,
        MONGO_SERVICE_NAME,
    )
    return False


def check_connections(app: Flask) -> None:
    check_mongo_connection(app.config["MONGO_URI"])
