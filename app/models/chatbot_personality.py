from app import db

# Association tables for many-to-many relationships
personality_traits = db.Table('personality_traits',
    db.Column('personality_id', db.Integer, db.ForeignKey('chatbot_personalities.id'), primary_key=True),
    db.Column('trait_id', db.Integer, db.ForeignKey('traits.id'), primary_key=True)
)

personality_interests = db.Table('personality_interests',
    db.Column('personality_id', db.Integer, db.ForeignKey('chatbot_personalities.id'), primary_key=True),
    db.Column('interest_id', db.Integer, db.ForeignKey('interests.id'), primary_key=True)
)

class ChatbotPersonality(db.Model):
    """
    Model representing a chatbot personality.
    """
    __tablename__ = 'chatbot_personalities'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    prompt_template = db.Column(db.Text, nullable=False)
    color = db.Column(db.String(50), nullable=False, default='indigo')  # Default color theme
    avatar = db.Column(db.String(200), nullable=False, default='default-avatar.png')  # Path to avatar image
    example_conversation = db.Column(db.Text, nullable=True)

    # Relationships
    traits = db.relationship('Trait', secondary=personality_traits, lazy='subquery',
                             backref=db.backref('personalities', lazy=True))
    interests = db.relationship('Interest', secondary=personality_interests, lazy='subquery',
                                 backref=db.backref('personalities', lazy=True))

    def __repr__(self):
        return f"<ChatbotPersonality {self.name}>"