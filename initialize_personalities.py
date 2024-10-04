# initialize_personalities.py

from app import create_app, db
from app.services.personality_service import PersonalityService
from sqlalchemy.exc import SQLAlchemyError

def initialize_personalities():
    app = create_app()
    with app.app_context():
        service = PersonalityService()
        try:
            service.initialize_default_personalities()
            print("Default personalities initialized successfully.")
        except SQLAlchemyError as e:
            print(f"Error initializing personalities: {e}")

if __name__ == "__main__":
    initialize_personalities()