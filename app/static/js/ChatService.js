// ChatService.js

export default class ChatService {
    /**
     * Fetches the list of available chatbot personalities from the backend.
     * @returns {Promise<Array>} - A promise that resolves to an array of personality objects.
     */
    async getPersonalities() {
        try {
            const response = await fetch('/personalities');
            if (!response.ok) {
                throw new Error(`Failed to fetch personalities: ${response.statusText}`);
            }
            const personalities = await response.json();
            return personalities;
        } catch (error) {
            console.error('Error in getPersonalities:', error);
            throw error;
        }
    }

    /**
     * Loads the chat history for a given personality and session.
     * @param {number} personalityId - The ID of the selected personality.
     * @param {string|null} sessionId - The current session ID.
     * @param {UIManager} uiManager - The UIManager instance to update the UI.
     * @returns {Promise<void>}
     */
    async loadChatHistory(personalityId, sessionId, uiManager) {
        try {
            const url = `/chat_history/${personalityId}?session_id=${sessionId || ''}`;
            const response = await fetch(url);
            if (!response.ok) {
                if (response.status === 404) {
                    // No existing chat history
                    uiManager.displayInfo('Starting a new chat session.');
                    return;
                }
                throw new Error(`Failed to load chat history: ${response.statusText}`);
            }
            const chatHistory = await response.json();
            chatHistory.forEach(message => {
                const sender = message.user ? 'user' : 'bot';
                const content = message.user || message.bot;
                uiManager.appendMessage(sender, content);
            });
        } catch (error) {
            console.error('Error in loadChatHistory:', error);
            throw error;
        }
    }

    /**
     * Sends a chat message to the backend and retrieves the chatbot's response.
     * @param {string} message - The user's message.
     * @param {number} personalityId - The ID of the selected personality.
     * @param {string|null} sessionId - The current session ID.
     * @returns {Promise<Object>} - An object containing the response, sessionId, and quickReplies.
     */
    async sendMessage(message, personalityId, sessionId) {
        try {
            const payload = {
                message,
                personalityId,
                sessionId
            };

            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to send message: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error in sendMessage:', error);
            throw error;
        }
    }
}