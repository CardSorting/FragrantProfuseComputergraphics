// main.js

import ChatService from './modules/ChatService.js';
import UIManager from './modules/UIManager.js';

// Initialize Services
const chatService = new ChatService();
const uiManager = new UIManager();

// Initialize Chat with Personality
function initializeChat(personalityId, personalityName) {
    // Load Chat History
    const sessionId = getSessionId();
    chatService.loadChatHistory(personalityId, sessionId)
        .then(chatHistory => {
            if (chatHistory.length === 0) {
                uiManager.displayInfo('Starting a new chat session.');
            } else {
                chatHistory.forEach(message => {
                    const sender = message.user ? 'user' : 'ai';
                    const content = message.user || message.bot;
                    uiManager.appendMessage(sender, content);
                });
            }
        })
        .catch(error => {
            uiManager.displayInfo('Failed to load chat history.');
        });

    // Set up Event Listeners
    setupEventListeners(personalityId, sessionId);
}

// Get or Create Session ID
function getSessionId() {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = generateSessionId();
        sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
}

// Generate a Random Session ID
function generateSessionId() {
    return 'sess-' + Math.random().toString(36).substr(2, 9);
}

// Setup Event Listeners
function setupEventListeners(personalityId, sessionId) {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const emojiButton = document.getElementById('emoji-button');
    const toggleThemeButton = document.getElementById('toggle-theme');
    const clearChatButton = document.getElementById('clear-chat');

    // Handle Chat Form Submission
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (message === '') return;

        // Display User Message
        uiManager.appendMessage('user', message);
        uiManager.incrementPoints(10); // Increment points
        chatInput.value = '';
        chatInput.focus();

        // Show Typing Indicator
        uiManager.showTypingIndicator();

        try {
            // Send Message to Backend
            const response = await chatService.sendMessage(message, personalityId, sessionId);
            const { response: aiResponse, sessionId: newSessionId, quickReplies } = response;

            // Update Session ID if Changed
            if (newSessionId && newSessionId !== sessionId) {
                sessionStorage.setItem('sessionId', newSessionId);
            }

            // Display AI Response
            uiManager.appendMessage('ai', aiResponse);
            uiManager.incrementPoints(20); // Increment points for AI response

            // Display Quick Replies if Available
            if (quickReplies && quickReplies.length > 0) {
                uiManager.displayQuickReplies(quickReplies);
            }

        } catch (error) {
            uiManager.appendMessage('ai', 'Sorry, something went wrong. Please try again.');
            uiManager.incrementPoints(5); // Increment points for error
        } finally {
            // Hide Typing Indicator
            uiManager.hideTypingIndicator();
        }
    });

    // Handle Emoji Button Click
    emojiButton.addEventListener('click', () => {
        uiManager.toggleEmojiPanel();
    });

    // Initialize Emoji Panel with Emojis
    const emojis = ['😀', '😂', '😍', '👍', '🎉', '🤖', '😎', '🙏', '💡', '🔥'];
    uiManager.initializeEmojiPanel(emojis, (emoji) => {
        chatInput.value += emoji;
    });

    // Handle Theme Toggle Button Click
    toggleThemeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark');
    });

    // Handle Clear Chat Button Click
    clearChatButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear the chat history?')) {
            uiManager.chatMessages.innerHTML = '';
            sessionStorage.removeItem('sessionId');
            uiManager.displayInfo('Chat history cleared.');
            uiManager.incrementPoints(-50); // Deduct points for clearing chat
        }
    });

    // Initialize Theme Selector
    const themes = [
        { name: 'Default', colorClass: 'bg-indigo-500' },
        { name: 'Ocean', colorClass: 'bg-blue-500' },
        { name: 'Forest', colorClass: 'bg-green-500' },
        { name: 'Sunset', colorClass: 'bg-pink-500' },
        { name: 'Amber', colorClass: 'bg-yellow-500' }
    ];
    uiManager.initializeThemeSelector(themes, (theme) => {
        applyTheme(theme);
    });

    // Apply Selected Theme
    function applyTheme(theme) {
        // Update body background
        document.body.classList.remove(
            'bg-indigo-gradient', 'bg-blue-gradient', 'bg-green-gradient',
            'bg-pink-gradient', 'bg-yellow-gradient',
            'dark:bg-indigo-gradient-dark', 'dark:bg-blue-gradient-dark',
            'dark:bg-green-gradient-dark', 'dark:bg-pink-gradient-dark',
            'dark:bg-yellow-gradient-dark'
        );
        document.body.classList.add(`${theme.name.toLowerCase()}-gradient`, `dark:${theme.name.toLowerCase()}-gradient-dark`);

        // Update send button theme
        uiManager.updateTheme({
            primary: theme.colorClass,
            hover: theme.colorClass.replace('500', '700')
        });

        // Optionally, update other themed elements
    }
}

// Initialize Chat on Page Load
document.addEventListener('DOMContentLoaded', () => {
    const personalityId = {{ personality.id }};
    const personalityName = "{{ personality.name }}";
    initializeChat(personalityId, personalityName);
});