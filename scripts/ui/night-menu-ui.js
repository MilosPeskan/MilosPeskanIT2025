import { UiController } from "./ui-controller.js";

export class NightMenu extends UiController {
    constructor(rootElement, gameState){
        super(gameState);

        this.rootElement = rootElement;
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements(){
        this.elements = {
            role: this.rootElement.querySelector("#wake-up-role"),
            mainAction: this.rootElement.querySelector("#action"),
            secondaryAction: this.rootElement.querySelector("#second-action")
        }
    }

    attachEventListeners(){
        
    }
}