// EventHandlers.js

export default class EventHandlers {
    /**
     * Constructs the EventHandlers instance.
     * @param {ChatApp} chatApp - The ChatApp instance.
     */
    constructor(chatApp) {
        this.chatApp = chatApp;
    }

    /**
     * Handles the chat form submission.
     * @param {Event} event - The form submission event.
     */
    async handleChatSubmit(event) {
        event.preventDefault();
        const message = this.chatApp.chatInput.value.trim();
        if (!message) return;

        // Append user's message
        this.chatApp.uiManager.appendMessage('user', message);

        // Clear input and reset
        this.chatApp.resetChatInput();

        // Show typing indicator
        this.chatApp.uiManager.typingIndicator.classList.remove('hidden');

        try {
            // Send message via ChatService
            const response = await this.chatApp.chatService.sendMessage(message, this.chatApp.currentPersonality, this.chatApp.currentSessionId);

            // Update session ID if provided
            if (response.sessionId) {
                this.chatApp.currentSessionId = response.sessionId;
            }

            // Append bot's response
            this.chatApp.uiManager.appendMessage('bot', response.response);

            // Handle quick replies if any
            if (response.quickReplies && response.quickReplies.length > 0) {
                this.chatApp.uiManager.displayQuickReplies(response.quickReplies);
            }

            // Hide typing indicator
            this.chatApp.uiManager.typingIndicator.classList.add('hidden');

            // Increment engagement points
            this.chatApp.engagementPoints += 10; // Example increment
            this.chatApp.uiManager.updateEngagementPoints(this.chatApp.engagementPoints);
        } catch (error) {
            console.error('Error handling chat submit:', error);
            this.chatApp.uiManager.displayError('An error occurred while sending your message. Please try again.');
            this.chatApp.uiManager.typingIndicator.classList.add('hidden');
        }
    }

    /**
     * Clears the chat history.
     */
    clearChat() {
        this.chatApp.uiManager.clearChatMessages();
        this.chatApp.engagementPoints = 0;
        this.chatApp.uiManager.updateEngagementPoints(this.chatApp.engagementPoints);
    }

    /**
     * Toggles between light and dark themes.
     */
    toggleTheme() {
        document.body.classList.toggle('dark');
        this.chatApp.isDarkMode = !this.chatApp.isDarkMode;
        // Optionally, persist theme preference to localStorage
        localStorage.setItem('darkMode', this.chatApp.isDarkMode ? 'enabled' : 'disabled');
    }

    /**
     * Handles chat input events, such as showing/hiding the send button based on input.
     */
    handleChatInput() {
        const input = this.chatApp.chatInput.value.trim();
        if (input.length > 0) {
            this.chatApp.sendButton.classList.remove('opacity-0', 'scale-95');
            this.chatApp.sendButton.classList.add('opacity-100', 'scale-100');
        } else {
            this.chatApp.sendButton.classList.remove('opacity-100', 'scale-100');
            this.chatApp.sendButton.classList.add('opacity-0', 'scale-95');
        }
    }

    /**
     * Handles keyboard navigation for accessibility.
     * @param {KeyboardEvent} event - The keyboard event.
     */
    handleKeyboardNavigation(event) {
        if (event.key === 'Escape') {
            // Close any open modals or panels
            this.chatApp.emojiPanel.close();
            this.chatApp.themeSelector.close();
        }
    }
}