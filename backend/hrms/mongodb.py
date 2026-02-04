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
                error_msg = "MONGO_URI not set in environment variables"
                print(f"ERROR: {error_msg}")
                raise ValueError(error_msg)
            
            try:
                print(f"Connecting to MongoDB: {settings.MONGO_DB_NAME}")
                self._client = MongoClient(mongo_uri)
                self._db = self._client[settings.MONGO_DB_NAME]
                # Test connection
                self._client.admin.command('ping')
                print("MongoDB connection successful")
            except Exception as e:
                error_msg = f"Failed to connect to MongoDB: {str(e)}"
                print(f"ERROR: {error_msg}")
                raise ValueError(error_msg)
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
