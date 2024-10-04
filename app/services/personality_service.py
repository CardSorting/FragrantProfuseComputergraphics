# app/services/personality_service.py

from sqlalchemy.exc import SQLAlchemyError
from app.models import ChatbotPersonality, Trait, Interest
from app import db
from flask import current_app  # Import current_app to access app context

class PersonalityService:
    """
    Service class to handle operations related to chatbot personalities.
    """

    def get_all_personalities(self):
        """
        Retrieve all chatbot personalities from the database.

        Returns:
            List[ChatbotPersonality]: A list of all personalities.

        Raises:
            SQLAlchemyError: If a database error occurs.
        """
        try:
            personalities = ChatbotPersonality.query.all()
            current_app.logger.info(f"Fetched {len(personalities)} personalities.")
            return personalities
        except SQLAlchemyError as e:
            db.session.rollback()
            current_app.logger.error(f"Error fetching all personalities: {e}")
            raise e

    def get_personality_by_id(self, personality_id):
        """
        Retrieve a chatbot personality by its ID.

        Args:
            personality_id (int): The ID of the personality.

        Returns:
            ChatbotPersonality: The personality object if found, else None.

        Raises:
            SQLAlchemyError: If a database error occurs.
        """
        try:
            personality = ChatbotPersonality.query.get(personality_id)
            if personality:
                current_app.logger.info(f"Fetched personality: {personality.name}")
            else:
                current_app.logger.warning(f"No personality found with ID {personality_id}.")
            return personality
        except SQLAlchemyError as e:
            db.session.rollback()
            current_app.logger.error(f"Error fetching personality with ID {personality_id}: {e}")
            raise e

    def initialize_default_personalities(self):
        """
        Initialize default personalities in the database if none exist.
        Associates predefined traits and interests with each personality.

        Raises:
            SQLAlchemyError: If a database error occurs during initialization.
        """
        try:
            if ChatbotPersonality.query.count() == 0:
                default_personalities = self.get_default_personalities()
                for personality_data in default_personalities:
                    # Create ChatbotPersonality instance
                    personality = ChatbotPersonality(
                        name=personality_data["name"],
                        description=personality_data["description"],
                        prompt_template=personality_data["prompt_template"],
                        color=personality_data.get("color", "indigo"),  # Default color
                        avatar=personality_data.get("avatar", "default-avatar.png"),  # Default avatar
                        example_conversation=personality_data.get("example_conversation", "")
                    )

                    # Associate traits
                    trait_names = personality_data.get("traits", [])
                    traits = Trait.query.filter(Trait.name.in_(trait_names)).all()
                    if not traits:
                        current_app.logger.warning(f"Traits {trait_names} not found in the database.")
                    personality.traits = traits

                    # Associate interests
                    interest_names = personality_data.get("interests", [])
                    interests = Interest.query.filter(Interest.name.in_(interest_names)).all()
                    if not interests:
                        current_app.logger.warning(f"Interests {interest_names} not found in the database.")
                    personality.interests = interests

                    # Add to session
                    db.session.add(personality)

                # Commit all additions
                db.session.commit()
                current_app.logger.info("Default chatbot personalities initialized successfully.")
            else:
                current_app.logger.info("Chatbot personalities already exist. Initialization skipped.")
        except SQLAlchemyError as e:
            db.session.rollback()
            current_app.logger.error(f"Error initializing default personalities: {e}")
            raise e

    def get_default_personalities(self):
        """
        Return a list of default personalities with their associated traits and interests.

        Returns:
            List[dict]: A list of dictionaries, each representing a personality with its details.
        """
        return [
            {
                "name": "Evelyn",
                "description": "A friendly and knowledgeable assistant ready to help you with anything.",
                "prompt_template": "You are Evelyn, a friendly and helpful assistant. Respond with enthusiasm and positivity.",
                "color": "blue",
                "avatar": "evelyn.png",
                "example_conversation": "User: How can you help me today?\nEvelyn: I'm here to assist you with anything you need!",
                "traits": ["Friendly", "Supportive"],
                "interests": ["Technology", "Education"]
            },
            {
                "name": "Max",
                "description": "A tech-savvy and analytical thinker who loves solving complex problems.",
                "prompt_template": "You are Max, a tech-savvy and analytical assistant. Provide detailed and logical responses.",
                "color": "green",
                "avatar": "max.png",
                "example_conversation": "User: Can you help me debug this code?\nMax: Certainly! Let's walk through it step by step.",
                "traits": ["Analytical", "Tech-Savvy"],
                "interests": ["Programming", "Mathematics"]
            },
            {
                "name": "Luna",
                "description": "A creative and artistic companion who inspires and motivates.",
                "prompt_template": "You are Luna, a creative and artistic assistant. Offer imaginative and inspiring responses.",
                "color": "pink",
                "avatar": "luna.png",
                "example_conversation": "User: I need ideas for my art project.\nLuna: How about exploring abstract expressionism? It allows for a lot of creativity!",
                "traits": ["Creative", "Artistic"],
                "interests": ["Art", "Music"]
            },
            {
                "name": "Oscar",
                "description": "A humorous and witty conversationalist who keeps the chat lively.",
                "prompt_template": "You are Oscar, a humorous and witty assistant. Engage with clever remarks and light-hearted humor.",
                "color": "yellow",
                "avatar": "oscar.png",
                "example_conversation": "User: Tell me a joke.\nOscar: Why don't scientists trust atoms? Because they make up everything!",
                "traits": ["Humorous", "Witty"],
                "interests": ["Comedy", "Games"]
            }
            # Add more personalities as needed
        ]