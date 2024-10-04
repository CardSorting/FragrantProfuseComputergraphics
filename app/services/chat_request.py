# app/services/chat_request.py

import os
import openai
import logging

# Configure logging for this module
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
handler = logging.StreamHandler()
formatter = logging.Formatter('[%(asctime)s] %(levelname)s in %(module)s: %(message)s')
handler.setFormatter(formatter)
if not logger.handlers:
    logger.addHandler(handler)

# Set up OpenAI API key and base URL for OpenRouter
openai.api_key = os.getenv("OPENROUTER_API_KEY")  # Ensure this environment variable is set
openai.api_base = "https://openrouter.ai/api/v1"  # OpenRouter API endpoint

def send_openai_request(prompt: str, personality: str) -> str:
    """
    Send a chat completion request to OpenRouter.

    Args:
        prompt (str): The user's message.
        personality (str): Description of the chatbot's personality.

    Returns:
        str: The response from the chatbot.

    Raises:
        ValueError: If the response is empty.
        Exception: For other errors during the API call.
    """
    try:
        response = openai.ChatCompletion.create(
            model="nousresearch/hermes-3-llama-3.1-405b:free",  # Replace with the appropriate model
            messages=[
                {
                    "role": "system",
                    "content": f"You are a chatbot with the following personality: {personality}"
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        # Extract the content from the response
        content = response.choices[0].message.content.strip()

        if not content:
            raise ValueError("OpenRouter returned an empty response.")

        return content
    except Exception as e:
        logger.exception("Error communicating with OpenRouter API.")
        raise e