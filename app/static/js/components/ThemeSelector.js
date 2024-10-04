// ThemeSelector.js

export default class ThemeSelector {
    /**
     * Constructs the ThemeSelector instance.
     * @param {ChatApp} chatApp - The ChatApp instance.
     */
    constructor(chatApp) {
        this.chatApp = chatApp;
        this.themeSelector = document.getElementById('theme-selector');
    }

    /**
     * Initializes the theme selector by setting up event listeners.
     */
    initialize() {
        // Example: Toggle theme selector visibility
        const toggleThemeButton = document.getElementById('toggle-theme');
        if (toggleThemeButton) {
            toggleThemeButton.addEventListener('click', () => {
                this.toggle();
            });
        }

        // Populate theme options (if multiple themes are available)
        const themes = ['light', 'dark'];
        themes.forEach(theme => {
            const themeButton = document.createElement('button');
            themeButton.classList.add('px-4', 'py-2', 'rounded', 'm-1', 'focus:outline-none');
            themeButton.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
            themeButton.addEventListener('click', () => {
                this.applyTheme(theme);
                this.toggle();
            });
            this.themeSelector.appendChild(themeButton);
        });
    }

    /**
     * Toggles the visibility of the theme selector.
     */
    toggle() {
        this.themeSelector.classList.toggle('hidden');
        this.themeSelector.classList.toggle('scale-100');
        this.themeSelector.classList.toggle('opacity-100');
    }

    /**
     * Applies the selected theme.
     * @param {string} theme - The theme to apply ('light' or 'dark').
     */
    applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark');
            this.chatApp.isDarkMode = true;
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.body.classList.remove('dark');
            this.chatApp.isDarkMode = false;
            localStorage.setItem('darkMode', 'disabled');
        }
    }

    /**
     * Closes the theme selector.
     */
    close() {
        if (!this.themeSelector.classList.contains('hidden')) {
            this.toggle();
        }
    }
}