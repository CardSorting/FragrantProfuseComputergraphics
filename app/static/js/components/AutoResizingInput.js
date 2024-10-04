// AutoResizingInput.js

export default class AutoResizingInput {
    /**
     * Initializes the auto-resizing functionality for a textarea.
     * @param {HTMLElement} textarea - The textarea element to auto-resize.
     */
    initialize(textarea) {
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        });
    }
}