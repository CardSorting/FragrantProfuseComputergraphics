// EmojiPanel.js

export default class EmojiPanel {
    /**
     * Constructs the EmojiPanel instance.
     * @param {ChatApp} chatApp - The ChatApp instance.
     */
    constructor(chatApp) {
        this.chatApp = chatApp;
        this.emojiPanel = document.getElementById('emoji-panel');
        this.emojiButton = document.getElementById('emoji-button');
    }

    /**
     * Initializes the emoji panel by setting up event listeners.
     */
    initialize() {
        this.emojiButton.addEventListener('click', () => {
            this.toggle();
        });

        // Populate emoji grid
        const emojis = ['😀', '😂', '😍', '👍', '🎉', '🤖', '😎', '🙏', '💡', '🔥'];
        const emojiGrid = document.createElement('div');
        emojiGrid.classList.add('grid', 'grid-cols-5', 'gap-2');
        emojis.forEach(emoji => {
            const emojiButton = document.createElement('button');
            emojiButton.classList.add('emoji', 'text-xl', 'focus:outline-none');
            emojiButton.textContent = emoji;
            emojiButton.addEventListener('click', () => {
                this.insertEmoji(emoji);
            });
            emojiGrid.appendChild(emojiButton);
        });
        this.emojiPanel.appendChild(emojiGrid);
    }

    /**
     * Toggles the visibility of the emoji panel.
     */
    toggle() {
        this.emojiPanel.classList.toggle('hidden');
        this.emojiPanel.classList.toggle('scale-100');
        this.emojiPanel.classList.toggle('opacity-100');
    }

    /**
     * Inserts an emoji into the chat input field.
     * @param {string} emoji - The emoji to insert.
     */
    insertEmoji(emoji) {
        const input = this.chatApp.chatInput;
        input.value += emoji;
        input.dispatchEvent(new Event('input')); // Trigger input event for auto-resizing
        this.toggle(); // Hide emoji panel after selection
    }

    /**
     * Closes the emoji panel.
     */
    close() {
        if (!this.emojiPanel.classList.contains('hidden')) {
            this.toggle();
        }
    }
}