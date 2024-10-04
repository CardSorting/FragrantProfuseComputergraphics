from app import db

class Trait(db.Model):
    """
    Model representing a unique trait that can be associated with multiple chatbot personalities.
    """
    __tablename__ = 'traits'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    def __repr__(self):
        return f"<Trait {self.name}>"