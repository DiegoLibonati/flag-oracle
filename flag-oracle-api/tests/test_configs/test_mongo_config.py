from unittest.mock import MagicMock, patch

import pytest

from src.configs.mongo_config import Mongo


class TestMongoClass:
    @pytest.mark.unit
    def test_initial_client_is_none(self) -> None:
        instance: Mongo = Mongo()
        assert instance.client is None

    @pytest.mark.unit
    def test_initial_db_is_none(self) -> None:
        instance: Mongo = Mongo()
        assert instance.db is None

    @pytest.mark.unit
    def test_init_app_sets_client_and_db(self) -> None:
        instance: Mongo = Mongo()
        mock_app = MagicMock()
        mock_app.config = {
            "MONGO_URI": "mongodb://localhost:27017/testdb",
            "MONGO_DB_NAME": "testdb",
        }
        mock_client = MagicMock()
        mock_db = MagicMock()
        mock_client.__getitem__ = MagicMock(return_value=mock_db)
        with patch("src.configs.mongo_config.MongoClient", return_value=mock_client):
            instance.init_app(mock_app)
        assert instance.client == mock_client
        assert instance.db == mock_db

    @pytest.mark.unit
    def test_init_app_uses_config_values(self) -> None:
        instance: Mongo = Mongo()
        mock_app = MagicMock()
        mongo_uri: str = "mongodb://admin:pass@localhost:27017/mydb"
        mock_app.config = {"MONGO_URI": mongo_uri, "MONGO_DB_NAME": "mydb"}
        with patch("src.configs.mongo_config.MongoClient") as mock_client_class:
            mock_client_class.return_value.__getitem__ = MagicMock()
            instance.init_app(mock_app)
        mock_client_class.assert_called_once_with(mongo_uri)
