// EngagementPoints.js

export default class EngagementPoints {
    /**
     * Constructs the EngagementPoints instance.
     * @param {ChatApp} chatApp - The ChatApp instance.
     */
    constructor(chatApp) {
        this.chatApp = chatApp;
        this.pointsDisplay = document.getElementById('points-value');
    }

    /**
     * Initializes the engagement points display.
     */
    initialize() {
        this.updatePointsDisplay(this.chatApp.engagementPoints);
    }

    /**
     * Updates the points display.
     * @param {number} points - The current points value.
     */
    updatePointsDisplay(points) {
        if (this.pointsDisplay) {
            this.pointsDisplay.textContent = points;
        }
    }

    /**
     * Increments the engagement points by a specified amount.
     * @param {number} amount - The amount to increment.
     */
    incrementPoints(amount) {
        this.chatApp.engagementPoints += amount;
        this.updatePointsDisplay(this.chatApp.engagementPoints);
    }

    /**
     * Resets the engagement points to zero.
     */
    resetPoints() {
        this.chatApp.engagementPoints = 0;
        this.updatePointsDisplay(this.chatApp.engagementPoints);
    }
}