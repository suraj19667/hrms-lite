"""
MongoDB connection utility for direct pymongo usage.
This bypasses Django ORM and uses pymongo directly for MongoDB operations.
"""
import os
from pymongo import MongoClient
from django.conf import settings


class MongoDB:
    """MongoDB connection singleton."""
    _instance = None
    _client = None
    _db = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MongoDB, cls).__new__(cls)
        return cls._instance

    def connect(self):
        """Establish connection to MongoDB Atlas."""
        if self._client is None:
            mongo_uri = settings.MONGO_URI
            if not mongo_uri:
                raise ValueError("MONGO_URI not set in environment variables")
            
            self._client = MongoClient(mongo_uri)
            self._db = self._client[settings.MONGO_DB_NAME]
        return self._db

    def get_db(self):
        """Get MongoDB database instance."""
        if self._db is None:
            self.connect()
        return self._db

    def get_collection(self, collection_name):
        """Get a specific collection."""
        db = self.get_db()
        return db[collection_name]

    def close(self):
        """Close MongoDB connection."""
        if self._client:
            self._client.close()
            self._client = None
            self._db = None


# Global MongoDB instance
mongodb = MongoDB()
