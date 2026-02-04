"""
MongoDB connection utility for direct pymongo usage.
This bypasses Django ORM and uses pymongo directly for MongoDB operations.
"""
import os
import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from django.conf import settings

logger = logging.getLogger(__name__)


class MongoDB:
    """MongoDB connection singleton with proper error handling."""
    _instance = None
    _client = None
    _db = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MongoDB, cls).__new__(cls)
        return cls._instance

    def connect(self):
        """Establish connection to MongoDB Atlas with retry logic."""
        if self._client is None:
            mongo_uri = settings.MONGO_URI
            if not mongo_uri:
                error_msg = "MONGO_URI not set in environment variables"
                logger.error(error_msg)
                raise ValueError(error_msg)
            
            try:
                logger.info(f"Connecting to MongoDB: {settings.MONGO_DB_NAME}")
                # Add serverSelectionTimeoutMS for faster failure in production
                self._client = MongoClient(
                    mongo_uri,
                    serverSelectionTimeoutMS=5000,
                    connectTimeoutMS=10000,
                    socketTimeoutMS=10000,
                )
                self._db = self._client[settings.MONGO_DB_NAME]
                
                # Test connection
                self._client.admin.command('ping')
                logger.info("MongoDB connection successful")
            except (ConnectionFailure, ServerSelectionTimeoutError) as e:
                error_msg = f"Failed to connect to MongoDB: {str(e)}"
                logger.error(error_msg)
                self._client = None
                self._db = None
                raise ValueError(error_msg)
            except Exception as e:
                error_msg = f"Unexpected error connecting to MongoDB: {str(e)}"
                logger.error(error_msg)
                self._client = None
                self._db = None
                raise ValueError(error_msg)
        return self._db

    def get_db(self):
        """Get MongoDB database instance, reconnecting if necessary."""
        if self._db is None:
            self.connect()
        else:
            # Verify connection is still alive
            try:
                self._client.admin.command('ping')
            except Exception as e:
                logger.warning(f"MongoDB connection lost, reconnecting: {str(e)}")
                self._client = None
                self._db = None
                self.connect()
        return self._db

    def get_collection(self, collection_name):
        """Get a specific collection with connection verification."""
        try:
            db = self.get_db()
            if db is None:
                raise ValueError("MongoDB database connection not available")
            return db[collection_name]
        except Exception as e:
            logger.error(f"Error getting collection {collection_name}: {str(e)}")
            raise

    def close(self):
        """Close MongoDB connection."""
        if self._client:
            try:
                self._client.close()
                logger.info("MongoDB connection closed")
            except Exception as e:
                logger.error(f"Error closing MongoDB connection: {str(e)}")
            finally:
                self._client = None
                self._db = None


# Global MongoDB instance
mongodb = MongoDB()

# Initialize connection at module import (important for production)
try:
    mongodb.connect()
except Exception as e:
    logger.error(f"Failed to initialize MongoDB connection: {str(e)}")
    # Don't raise here - let it fail on first use instead
