import logging
from flask import Blueprint, render_template, request, jsonify
from sqlalchemy.exc import SQLAlchemyError

from app.services.chat_service import ChatService
from app.services.personality_service import PersonalityService
from app.services.session_service import SessionService

# Configure logging for this module
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter('[%(asctime)s] %(levelname)s in %(module)s: %(message)s')
handler.setFormatter(formatter)
if not logger.handlers:
    logger.addHandler(handler)

# Initialize services
chat_service = ChatService()
personality_service = PersonalityService()
session_service = SessionService()

# Create a Blueprint for chat routes
chat_bp = Blueprint('chat_bp', __name__, template_folder='templates', static_folder='static')

@chat_bp.route('/')
def index():
    """
    Render the index page with a list of personalities.
    """
    try:
        personalities = personality_service.get_all_personalities()
        return render_template('index.html', personalities=personalities)
    except SQLAlchemyError as e:
        logger.exception("Database error occurred while fetching personalities.")
        return handle_server_error(e)

@chat_bp.route('/chat/<int:personality_id>')
def chat_page(personality_id):
    """
    Render the chat page for a specific personality.
    """
    try:
        personality = personality_service.get_personality_by_id(personality_id)
        return render_template('chat.html', personality=personality)
    except SQLAlchemyError as e:
        logger.exception("Database error occurred while fetching personality.")
        return handle_server_error(e)

@chat_bp.route('/chat', methods=['POST'])
def chat():
    """
    Handle chat messages between the user and the chatbot.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON payload"}), 400

    message = data.get('message')
    personality_id = data.get('personalityId')
    session_id = data.get('sessionId')

    if not message or not personality_id:
        return jsonify({"error": "Message and personality ID are required"}), 400

    try:
        personality = personality_service.get_personality_by_id(personality_id)
        if not personality:
            return jsonify({"error": "Personality not found"}), 404

        chat_session, session_id = session_service.get_or_create_session(session_id, personality_id)
        response = chat_service.process_chat_message(message, personality, chat_session)
        quick_replies = chat_service.generate_quick_replies(response)

        return jsonify({
            "response": response,
            "sessionId": session_id,
            "quickReplies": quick_replies
        }), 200
    except SQLAlchemyError as e:
        logger.exception("Database error during chat processing.")
        return handle_server_error(e)
    except Exception as e:
        logger.exception("An error occurred during chat processing.")
        return handle_server_error(e)

@chat_bp.route('/personalities', methods=['GET'])
def get_personalities():
    """
    Retrieve a list of available personalities.
    """
    try:
        personalities = personality_service.get_all_personalities()
        result = [{
            "id": p.id,
            "name": p.name,
            "description": p.description
        } for p in personalities]
        return jsonify(result), 200
    except SQLAlchemyError as e:
        logger.exception("Database error while fetching personalities.")
        return handle_server_error(e)

@chat_bp.route('/chat_history/<int:personality_id>', methods=['GET'])
def get_chat_history(personality_id):
    """
    Retrieve the chat history for a given session and personality.
    """
    session_id = request.args.get('session_id')
    if not session_id:
        return jsonify({"error": "Session ID is required"}), 400

    try:
        chat_history = session_service.get_chat_history(session_id, personality_id)
        if chat_history is None:
            return jsonify({"error": "Chat session not found"}), 404

        return jsonify(chat_history), 200
    except SQLAlchemyError as e:
        logger.exception("Database error while fetching chat history.")
        return handle_server_error(e)
    except Exception as e:
        logger.exception("An error occurred while fetching chat history.")
        return handle_server_error(e)

def handle_server_error(exception):
    """
    Handle server errors and return a standardized JSON response.
    """
    logger.exception("An internal server error occurred.")
    return jsonify({"error": "An internal server error occurred."}), 500