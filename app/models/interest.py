from app import db

class Interest(db.Model):
    """
    Model representing a unique interest that can be associated with multiple chatbot personalities.
    """
    __tablename__ = 'interests'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    def __repr__(self):
        return f"<Interest {self.name}>"