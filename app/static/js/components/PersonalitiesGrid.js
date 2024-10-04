// PersonalitiesGrid.js

export default class PersonalitiesGrid {
    /**
     * Constructs the PersonalitiesGrid instance.
     * @param {ChatApp} chatApp - The ChatApp instance.
     */
    constructor(chatApp) {
        this.chatApp = chatApp;
        this.gridContainer = document.getElementById('personalities-grid');
    }

    /**
     * Renders the personalities grid.
     * @param {Array} personalities - Array of personality objects.
     * @param {Function} selectPersonalityCallback - Callback when a personality is selected.
     */
    renderPersonalities(personalities, selectPersonalityCallback) {
        this.gridContainer.innerHTML = ''; // Clear existing personalities

        personalities.forEach(personality => {
            const card = document.createElement('div');
            card.classList.add(
                `bg-${personality.color}-gradient`,
                'p-6',
                'rounded-lg',
                'shadow-xl-lg',
                'transform',
                'transition',
                'duration-500',
                'hover:scale-105',
                'cursor-pointer',
                'group',
                'relative'
            );
            card.setAttribute('data-personality-id', personality.id);

            const avatar = document.createElement('img');
            avatar.src = personality.avatar;
            avatar.alt = personality.name;
            avatar.classList.add('w-24', 'h-24', 'rounded-full', 'mx-auto', 'mb-4', 'animate-float');

            const name = document.createElement('h3');
            name.classList.add('text-xl', 'font-semibold', 'text-center', 'text-white');
            name.textContent = personality.name;

            const description = document.createElement('p');
            description.classList.add('text-white', 'text-center', 'mt-2');
            description.textContent = personality.description;

            const badge = document.createElement('span');
            badge.classList.add(
                'absolute',
                'top-4',
                'right-4',
                `bg-${personality.color}-600`,
                'text-white',
                'text-xs',
                'px-2',
                'py-1',
                'rounded-full'
            );
            badge.textContent = personality.trait;

            card.appendChild(avatar);
            card.appendChild(name);
            card.appendChild(description);
            card.appendChild(badge);

            // Add event listener for selection
            card.addEventListener('click', () => {
                selectPersonalityCallback(personality);
            });

            this.gridContainer.appendChild(card);
        });
    }
}