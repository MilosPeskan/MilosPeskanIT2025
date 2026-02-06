import { UiController } from "./ui-controller.js";

export class ActionMenu extends UiController {
    constructor(rootElement, gameState) {
        super(rootElement);
        this.gameState = gameState;
        this.currentRole = null;
        this.currentPlayer = null;
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        this.elements = {
            roleTitle: this.rootElement.querySelector("#role-title"),
            roleDescription: this.rootElement.querySelector("#role-description"),
            targetHolder: this.rootElement.querySelector("#target-holder"),
            confirmButton: this.rootElement.querySelector("#confirm-action"),
            skipButton: this.rootElement.querySelector("#skip-action"),
            resultDisplay: this.rootElement.querySelector("#action-result")
        };
    }

    attachEventListeners() {
        this.addEventListener(this.elements.targetHolder, "click", (e) => {
            if (e.target.classList.contains("target-card")) {
                this.selectTarget(e.target);
            }
        });

        this.addEventListener(this.elements.confirmButton, "click", () => {
            this.onActionConfirmed?.(this.selectedTarget);
        });

        this.addEventListener(this.elements.skipButton, "click", () => {
            this.onActionSkipped?.();
        });
    }
}