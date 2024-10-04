# seeds.py

from app import create_app, db
from app.models import Trait, Interest
from sqlalchemy.exc import SQLAlchemyError

def seed_traits():
    traits = [
        {"name": "Friendly"},
        {"name": "Supportive"},
        {"name": "Analytical"},
        {"name": "Tech-Savvy"},
        {"name": "Creative"},
        {"name": "Artistic"},
        {"name": "Humorous"},
        {"name": "Witty"}
        # Add more traits as needed
    ]

    for trait_data in traits:
        existing_trait = Trait.query.filter_by(name=trait_data["name"]).first()
        if not existing_trait:
            trait = Trait(name=trait_data["name"])
            db.session.add(trait)
    try:
        db.session.commit()
        print("Traits seeded successfully.")
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Error seeding traits: {e}")

def seed_interests():
    interests = [
        {"name": "Technology"},
        {"name": "Education"},
        {"name": "Programming"},
        {"name": "Mathematics"},
        {"name": "Art"},
        {"name": "Music"},
        {"name": "Comedy"},
        {"name": "Games"}
        # Add more interests as needed
    ]

    for interest_data in interests:
        existing_interest = Interest.query.filter_by(name=interest_data["name"]).first()
        if not existing_interest:
            interest = Interest(name=interest_data["name"])
            db.session.add(interest)
    try:
        db.session.commit()
        print("Interests seeded successfully.")
    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Error seeding interests: {e}")

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        seed_traits()
        seed_interests()