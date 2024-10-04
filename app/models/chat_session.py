from app import db
from datetime import datetime
import uuid

class ChatSession(db.Model):
    """
    Model representing a chat session between a user and a chatbot personality.
    """
    __tablename__ = 'chat_sessions'

    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(36), nullable=False, unique=True, default=lambda: str(uuid.uuid4()))
    personality_id = db.Column(db.Integer, db.ForeignKey('chatbot_personalities.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # Optional: If users are authenticated
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    personality = db.relationship('ChatbotPersonality', backref=db.backref('sessions', lazy=True))
    messages = db.relationship('ChatMessage', backref='session', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<ChatSession {self.session_id} | Personality ID {self.personality_id} | User ID {self.user_id}>"