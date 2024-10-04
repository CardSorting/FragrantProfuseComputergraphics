# app/__init__.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
import logging

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    """
    Application factory function to create and configure the Flask app.
    """
    app = Flask(
        __name__,
        static_folder='static',        # Relative to the app directory
        template_folder='templates'     # Relative to the app directory
    )

    # Configurations
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL", "sqlite:///app.db")
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", os.urandom(24))
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)

    # Import models to ensure they are registered with SQLAlchemy
    from app.models import (
        chatbot_personality,  # noqa: F401
        trait,
        interest,
        chat_session,
        chat_message,
        user
    )

    # Register blueprints
    from app.routes.chat_routes import chat_bp
    app.register_blueprint(chat_bp)

    # Configure logging
    configure_logging(app)

    return app

def configure_logging(app):
    """
    Configures logging for the Flask application.
    Logs are written to 'logs/chatapp.log'.
    """
    if not os.path.exists('logs'):
        os.mkdir('logs')

    file_handler = logging.FileHandler('logs/chatapp.log')
    file_handler.setLevel(logging.INFO)
    formatter = logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    )
    file_handler.setFormatter(formatter)
    app.logger.addHandler(file_handler)

    # Set the logging level for the app logger
    app.logger.setLevel(logging.INFO)
    app.logger.info('ChatApp startup')