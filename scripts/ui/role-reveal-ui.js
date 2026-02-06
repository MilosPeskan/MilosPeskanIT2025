import { UiController } from "./ui-controller.js";
import { ROLES } from "../data.js";
import { UI_TEXT } from "../constants.js"
import { HoldButton } from "../utils/hold-button.js";

export class RoleRevealMenu extends UiController{
    constructor(rootElement, gameState){
        super(rootElement);

        this.gameState = gameState;
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements(){
        this.elements = {
            player: this.rootElement.querySelector("#player"),
            title: this.rootElement.querySelector("#role-menu-title"),
            name: this.rootElement.querySelector("#display-name"),
            alignment: this.rootElement.querySelector("#display-alignment"),
            desc: this.rootElement.querySelector("#display-desc"),
            executionTarget: this.rootElement.querySelector("#meta"),
            roleHolder: this.rootElement.querySelector("#role-holder"),
            backButton: this.rootElement.querySelector("#back"),
            revealButton: this.rootElement.querySelector("#reveal-role"),
            hideButton: this.rootElement.querySelector("#hide-role"),
            holdButtonHolder: this.rootElement.querySelector("#hold-button-holder"),
            progressMeter: this.rootElement.querySelector("#progress-meter")
        }
    }

    attachEventListeners(){
        this.setupHoldButton();

        this.addEventListener(this.elements.hideButton, "pointerdown", ()=>{
            this.displayPlayerToGo();
        })

        this.addEventListener(this.elements.backButton, "click", ()=>{
            this.handleBackClick();
        })
    }

    handleBackClick(){
        if (confirm('Da li sigurno želite da se vratite? Progres će biti izgubljen.')) {
            this.gameState.resetPlayerIndex();
            this.onBackClick?.();
        }
    }

    setupHoldButton() {
    // Kreiraj hold button
        this.holdButton = new HoldButton(
            this.elements.revealButton
        );

        // Callback kad se zadrži
        this.holdButton.onComplete = () => {
            this.handleRoleReveal();
        };

        // Callback za progress (vizuelni feedback)
        this.holdButton.onProgress = (progress) => {
            this.updateProgress(progress);
        };
    }

    updateProgress(progress) {
        this.elements.progressMeter.style.height = `${progress}%`;
    }

    handleRoleReveal(){
        this.elements.progressMeter.style.height = "0%";

        if(!this.gameState.hasMorePlayers()){
            this.onRevealComplete?.();
            return;
        }
        this.displayRoleDetails();
        this.changeElementDisplayType(this.elements.roleHolder, "block");
        this.changeElementDisplayType(this.elements.hideButton, "block");
        this.changeElementDisplayType(this.elements.holdButtonHolder, "none");
        this.gameState.nextPlayer();
        this.elements.roleHolder.classList.add('revealed');
    }

    displayRoleDetails(){
        this.elements.title.textContent = UI_TEXT.REVEAL_INSTRUCTION;
        const currentRole = this.gameState.getCurrentRole();
        const roleData = ROLES[currentRole];

        this.elements.name.textContent = roleData.role;
        this.elements.alignment.textContent = roleData.alignment;
        this.elements.desc.textContent = roleData.description;

        if(this.gameState.isExecutioner()){
            this.gameState.generateExecutionTarget();
            this.elements.executionTarget.textContent = `Tvoja meta je: ${this.gameState.getExecutionTarget()}`;
            this.changeElementDisplayType(this.elements.executionTarget, "block");
        }
    }

    displayPlayerToGo(){
        this.changeElementDisplayType(this.elements.executionTarget, "none");
        if(this.gameState.hasMorePlayers()){
            this.elements.title.textContent = UI_TEXT.HIDE_INSTRUCTION;
            const playerName = this.gameState.getCurrentPlayer();
            this.elements.player.textContent = playerName;
        }
        else {
            this.elements.title.textContent = UI_TEXT.HIDE_INSTRUCTION_LAST;
            this.elements.player.textContent = UI_TEXT.NARRATOR;
        }
        this.changeElementDisplayType(this.elements.roleHolder, "none");
        this.changeElementDisplayType(this.elements.hideButton, "none");
        this.changeElementDisplayType(this.elements.holdButtonHolder, "block");
    }

    show(displayType){
        super.show(displayType);
        this.gameState.resetPlayerIndex();
        this.displayPlayerToGo();
    }
}