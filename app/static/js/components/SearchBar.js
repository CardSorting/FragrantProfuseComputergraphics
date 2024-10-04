// SearchBar.js

export default class SearchBar {
    /**
     * Constructs the SearchBar instance.
     * @param {ChatApp} chatApp - The ChatApp instance.
     */
    constructor(chatApp) {
        this.chatApp = chatApp;
        this.searchContainer = document.getElementById('search-container');
        this.searchInput = document.getElementById('search-input');
        this.searchButton = document.getElementById('search-button');
    }

    /**
     * Initializes the search bar by setting up event listeners.
     */
    initialize() {
        this.searchButton.addEventListener('click', () => {
            this.toggleSearch();
        });

        // Debounce the search input to optimize performance
        const debounce = (func, wait) => {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        };

        this.searchInput.addEventListener('input', debounce(() => {
            this.performSearch(this.searchInput.value.trim());
        }, 300));
    }

    /**
     * Toggles the visibility of the search container.
     */
    toggleSearch() {
        this.searchContainer.classList.toggle('max-h-0');
        this.searchContainer.classList.toggle('max-h-40'); // Adjust as needed
    }

    /**
     * Performs the search and highlights matching messages.
     * @param {string} query - The search query.
     */
    performSearch(query) {
        const messages = this.chatApp.uiManager.chatMessagesContainer.querySelectorAll('div > div');
        messages.forEach(msg => {
            const text = msg.textContent.toLowerCase();
            if (text.includes(query.toLowerCase())) {
                msg.classList.add('bg-yellow-200', 'dark:bg-yellow-700');
            } else {
                msg.classList.remove('bg-yellow-200', 'dark:bg-yellow-700');
            }
        });
    }
}