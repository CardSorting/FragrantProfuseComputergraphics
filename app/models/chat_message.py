from app import db
from datetime import datetime

class ChatMessage(db.Model):
    """
    Model representing a single chat message within a session.
    """
    __tablename__ = 'chat_messages'

    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('chat_sessions.id'), nullable=False)
    sender = db.Column(db.Enum('user', 'bot', name='sender_enum'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<ChatMessage {self.sender} at {self.timestamp}>"