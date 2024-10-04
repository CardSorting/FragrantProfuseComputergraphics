# app/services/session_service.py

import uuid
from sqlalchemy.exc import SQLAlchemyError
from app.models.chat_session import ChatSession
from app import db

class SessionService:
    """
    Service class to handle chat sessions.
    """

    def get_or_create_session(self, session_id, personality_id):
        """
        Retrieve an existing chat session or create a new one.

        Args:
            session_id (str): The session ID.
            personality_id (int): The ID of the chatbot personality.

        Returns:
            Tuple[ChatSession, str]: The chat session object and the session ID.

        Raises:
            SQLAlchemyError: If a database error occurs.
        """
        try:
            if not session_id:
                session_id = str(uuid.uuid4())

            chat_session = ChatSession.query.filter_by(session_id=session_id, personality_id=personality_id).first()
            if not chat_session:
                chat_session = ChatSession(
                    session_id=session_id,
                    personality_id=personality_id,
                    chat_history=[]
                )
                db.session.add(chat_session)
                db.session.commit()
            return chat_session, session_id
        except SQLAlchemyError as e:
            db.session.rollback()
            raise e

    def get_chat_history(self, session_id, personality_id):
        """
        Retrieve chat history for a given session and personality.

        Args:
            session_id (str): The session ID.
            personality_id (int): The ID of the chatbot personality.

        Returns:
            List[Dict[str, str]]: The chat history.

        Raises:
            SQLAlchemyError: If a database error occurs.
        """
        try:
            chat_session = ChatSession.query.filter_by(session_id=session_id, personality_id=personality_id).first()
            if not chat_session:
                return None
            return chat_session.chat_history
        except SQLAlchemyError as e:
            raise e