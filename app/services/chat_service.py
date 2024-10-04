# app/services/chat_service.py

from sqlalchemy.exc import SQLAlchemyError
from app import db
from app.models.chatbot_personality import ChatbotPersonality
from app.models.chat_session import ChatSession
from app.services.chat_request import send_openai_request  # Ensure correct import path

class ChatService:
    """
    Service class to handle chat message processing and responses.
    """

    def process_chat_message(self, message: str, personality: ChatbotPersonality, chat_session: ChatSession) -> str:
        """
        Process the chat message and get a response from the chatbot.

        Args:
            message (str): The user's message.
            personality (ChatbotPersonality): The chatbot personality.
            chat_session (ChatSession): The current chat session.

        Returns:
            str: The chatbot's response.

        Raises:
            SQLAlchemyError: If a database error occurs.
            Exception: For other errors.
        """
        try:
            if chat_session.chat_history is None:
                chat_session.chat_history = []

            # Build the prompt for the chatbot
            prompt = self.build_prompt(message, personality, chat_session.chat_history)

            # Get response from OpenRouter via send_openai_request
            response = send_openai_request(prompt, personality.description)

            # Update chat history
            chat_session.chat_history.append({"user": message, "bot": response})
            db.session.commit()

            return response
        except SQLAlchemyError as e:
            db.session.rollback()
            raise e
        except Exception as e:
            # Log the exception before raising
            raise e

    def build_prompt(self, message: str, personality: ChatbotPersonality, chat_history: list) -> str:
        """
        Build the prompt to send to the OpenAI API.

        Args:
            message (str): The user's message.
            personality (ChatbotPersonality): The chatbot personality.
            chat_history (list): The chat history.

        Returns:
            str: The constructed prompt.
        """
        history = '\n'.join([f"User: {msg['user']}\nChatbot: {msg['bot']}" for msg in chat_history])
        prompt = f"{personality.prompt_template}\n{history}\nUser: {message}\nChatbot:"
        return prompt

    def generate_quick_replies(self, response: str) -> list:
        """
        Generate quick reply options based on the chatbot's response.

        Args:
            response (str): The chatbot's response.

        Returns:
            list: A list of quick reply options.
        """
        # Placeholder for dynamic quick reply generation logic
        # For now, returning a static list
        return ["Tell me more", "Why is that?", "Can you explain further?"]