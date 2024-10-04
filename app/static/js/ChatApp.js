// ChatApp.js

import ChatService from './ChatService.js';
import UIManager from './UIManager.js';
import EventHandlers from './EventHandlers.js';
import Utilities from './Utilities.js';

// Import components
import AutoResizingInput from './components/AutoResizingInput.js';
import EmojiPanel from './components/EmojiPanel.js';
import SearchBar from './components/SearchBar.js';
import BackgroundBlur from './components/BackgroundBlur.js';
import ThemeSelector from './components/ThemeSelector.js';
import EngagementPoints from './components/EngagementPoints.js';
import PersonalitiesGrid from './components/PersonalitiesGrid.js';

/**
 * The main ChatApp class orchestrates all functionalities of the chat application.
 */
class ChatApp {
    /**
     * Constructs the ChatApp instance.
     */
    constructor() {
        // Initialize state variables
        this.currentPersonality = null;
        this.currentSessionId = null;
        this.isDarkMode = false;
        this.engagementPoints = 0;

        // Initialize utility classes
        this.chatService = new ChatService();
        this.uiManager = new UIManager(this);
        this.utilities = new Utilities();

        // Initialize event handlers
        this.eventHandlers = new EventHandlers(this);

        // Initialize components
        this.autoResizingInput = new AutoResizingInput();
        this.emojiPanel = new EmojiPanel(this);
        this.searchBar = new SearchBar(this);
        this.backgroundBlur = new BackgroundBlur();
        this.themeSelector = new ThemeSelector(this);
        this.engagementPointsDisplay = new EngagementPoints(this);
        this.personalitiesGrid = new PersonalitiesGrid(this);

        // Bind methods to maintain context
        this.resetChatInput = this.resetChatInput.bind(this);
        this.selectPersonality = this.selectPersonality.bind(this);

        // Initialize the application
        this.init();
    }

    /**
     * Initializes the application by setting up event listeners and components.
     */
    init() {
        document.addEventListener('DOMContentLoaded', async () => {
            try {
                await this.fetchAndDisplayPersonalities();
                this.bindUIElements();
                this.initializeComponents();
            } catch (error) {
                console.error('Initialization error:', error);
            }
        });
    }

    /**
     * Fetches personalities from the backend and displays them in the UI.
     */
    async fetchAndDisplayPersonalities() {
        try {
            const personalities = await this.chatService.getPersonalities();
            this.personalitiesGrid.renderPersonalities(personalities, this.selectPersonality);
        } catch (error) {
            console.error('Error fetching personalities:', error);
            this.uiManager.displayError('Failed to load chatbot personalities. Please try again later.');
        }
    }

    /**
     * Handles the selection of a personality.
     * @param {Object} personality - The selected personality object.
     */
    async selectPersonality(personality) {
        if (!personality || !personality.id || !personality.name) {
            console.warn('Invalid personality selected:', personality);
            return;
        }

        this.currentPersonality = personality.id;
        this.currentSessionId = null;
        document.title = `Chat with ${personality.name}`;

        // Clear previous chat history
        this.uiManager.clearChatMessages();

        // Initialize chat with the selected personality
        try {
            await this.chatService.loadChatHistory(this.currentPersonality, this.currentSessionId, this.uiManager);
            this.engagementPointsDisplay.initialize();
        } catch (error) {
            console.error('Error initializing chat:', error);
            this.uiManager.displayError('Failed to initialize chat session. Please try again.');
        }
    }

    /**
     * Binds UI elements to their respective event handlers.
     */
    bindUIElements() {
        this.chatForm = document.getElementById('chat-form');
        this.chatInput = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-button');
        this.clearChatButton = document.getElementById('clear-chat');
        this.toggleThemeButton = document.getElementById('toggle-theme');

        if (this.chatForm) {
            this.chatForm.addEventListener('submit', this.eventHandlers.handleChatSubmit.bind(this.eventHandlers));
        }

        if (this.clearChatButton) {
            this.clearChatButton.addEventListener('click', this.eventHandlers.clearChat.bind(this.eventHandlers));
        }

        if (this.toggleThemeButton) {
            this.toggleThemeButton.addEventListener('click', this.eventHandlers.toggleTheme.bind(this.eventHandlers));
        }

        if (this.chatInput) {
            this.chatInput.addEventListener('input', this.eventHandlers.handleChatInput.bind(this.eventHandlers));
        }

        document.addEventListener('keydown', this.eventHandlers.handleKeyboardNavigation.bind(this.eventHandlers));
    }

    /**
     * Initializes all UI components.
     */
    initializeComponents() {
        if (this.chatInput) {
            this.autoResizingInput.initialize(this.chatInput);
        }
        this.emojiPanel.initialize();
        this.searchBar.initialize();
        this.backgroundBlur.initialize();
        this.themeSelector.initialize();
        this.engagementPointsDisplay.initialize();
    }

    /**
     * Resets the chat input field to its default state.
     */
    resetChatInput() {
        if (this.chatInput) {
            this.chatInput.value = '';
            this.chatInput.style.height = 'auto';
            this.sendButton.classList.add('opacity-0', 'scale-95');
            this.sendButton.classList.remove('opacity-100', 'scale-100');
            this.chatInput.focus();
        }
    }
}

// Initialize the ChatApp instance
new ChatApp();