from unittest.mock import MagicMock, patch

import pytest

from src.configs.mongo_config import Mongo, init_mongo, mongo


class TestMongoClass:
    @pytest.mark.unit
    def test_initial_client_is_none(self) -> None:
        instance: Mongo = Mongo()
        assert instance.client is None

    @pytest.mark.unit
    def test_accessing_db_before_init_raises_runtime_error(self) -> None:
        instance: Mongo = Mongo()
        with pytest.raises(RuntimeError):
            _ = instance.db

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
    def test_init_app_calls_mongo_client_with_server_selection_timeout(self) -> None:
        instance: Mongo = Mongo()
        mock_app = MagicMock()
        mongo_uri: str = "mongodb://admin:pass@localhost:27017/mydb"
        mock_app.config = {"MONGO_URI": mongo_uri, "MONGO_DB_NAME": "mydb"}
        with patch("src.configs.mongo_config.MongoClient") as mock_client_class:
            mock_client_class.return_value.__getitem__ = MagicMock()
            instance.init_app(mock_app)
        mock_client_class.assert_called_once_with(mongo_uri, serverSelectionTimeoutMS=5000)

    @pytest.mark.unit
    def test_init_app_does_not_ping_the_server(self) -> None:
        instance: Mongo = Mongo()
        mock_app = MagicMock()
        mock_app.config = {"MONGO_URI": "mongodb://localhost:27017/x", "MONGO_DB_NAME": "x"}
        mock_client = MagicMock()
        with patch("src.configs.mongo_config.MongoClient", return_value=mock_client):
            instance.init_app(mock_app)
        mock_client.admin.command.assert_not_called()

    @pytest.mark.unit
    def test_init_app_uses_db_name_from_config(self) -> None:
        instance: Mongo = Mongo()
        mock_app = MagicMock()
        mock_app.config = {"MONGO_URI": "mongodb://localhost:27017/x", "MONGO_DB_NAME": "chosen_db"}
        mock_client = MagicMock()
        with patch("src.configs.mongo_config.MongoClient", return_value=mock_client):
            instance.init_app(mock_app)
        mock_client.__getitem__.assert_called_once_with("chosen_db")


class TestInitMongo:
    @pytest.mark.unit
    def test_init_mongo_calls_init_app_on_module_singleton(self) -> None:
        mock_app = MagicMock()
        with patch.object(mongo, "init_app") as mock_init_app:
            init_mongo(mock_app)
        mock_init_app.assert_called_once_with(mock_app)


class TestModuleMongoSingleton:
    @pytest.mark.unit
    def test_module_level_mongo_is_instance_of_mongo(self) -> None:
        assert isinstance(mongo, Mongo)
