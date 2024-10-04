// UIManager.js

export default class UIManager {
    /**
     * Constructs the UIManager instance.
     * @param {ChatApp} chatApp - The ChatApp instance.
     */
    constructor(chatApp) {
        this.chatApp = chatApp;
        this.chatMessagesContainer = document.getElementById('chat-messages');
        this.typingIndicator = document.getElementById('typing-indicator');
        this.engagementPointsDisplay = document.getElementById('points-value');
    }

    /**
     * Appends a message to the chat.
     * @param {string} sender - 'user' or 'bot'.
     * @param {string} message - The message content.
     */
    appendMessage(sender, message) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('flex', sender === 'bot' ? 'justify-start' : 'justify-end');

        const messageBubble = document.createElement('div');
        messageBubble.classList.add(
            'px-4',
            'py-2',
            'rounded-full',
            'max-w-xs',
            'shadow-md',
            sender === 'bot' ? 'bg-blue-100 dark:bg-blue-700' : 'bg-green-100 dark:bg-green-700',
            'text-gray-800 dark:text-gray-100',
            'animate-fade-in'
        );
        messageBubble.textContent = message;

        messageContainer.appendChild(messageBubble);
        this.chatMessagesContainer.prepend(messageContainer);

        // Scroll to bottom
        this.chatMessagesContainer.scrollTop = 0;
    }

    /**
     * Clears all chat messages from the UI.
     */
    clearChatMessages() {
        this.chatMessagesContainer.innerHTML = '';
    }

    /**
     * Displays an informational message to the user.
     * @param {string} info - The informational text.
     */
    displayInfo(info) {
        const infoContainer = document.createElement('div');
        infoContainer.classList.add('flex', 'justify-center', 'items-center', 'p-4', 'text-gray-600', 'dark:text-gray-300');
        infoContainer.textContent = info;
        this.chatMessagesContainer.prepend(infoContainer);
    }

    /**
     * Displays an error message to the user.
     * @param {string} error - The error message.
     */
    displayError(error) {
        const errorContainer = document.createElement('div');
        errorContainer.classList.add('flex', 'justify-center', 'items-center', 'p-4', 'text-red-600', 'dark:text-red-400');
        errorContainer.textContent = error;
        this.chatMessagesContainer.prepend(errorContainer);
    }

    /**
     * Updates the engagement points displayed to the user.
     * @param {number} points - The current points value.
     */
    updateEngagementPoints(points) {
        if (this.engagementPointsDisplay) {
            this.engagementPointsDisplay.textContent = points;
        }
    }
}