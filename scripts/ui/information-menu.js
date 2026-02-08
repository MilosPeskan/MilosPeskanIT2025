import { ROLE_IDS } from "../constants.js";
import { UiController } from "./ui-controller.js";

export class InfoMenu extends UiController{
    constructor(rootElement, gameState){
        super(rootElement),
        this.gameState = gameState;

        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements(){
        this.elements = {
            infoRole: this.rootElement.querySelector("#info-holder"),
            name: this.rootElement.querySelector("#info-name"),
            role: this.rootElement.querySelector("#info-role"),
            alignment: this.rootElement.querySelector("#info-alignment"),
            desc: this.rootElement.querySelector("#info-desc"),
            target: this.rootElement.querySelector("#info-target"),
            backButton: this.rootElement.querySelector("#back-to-manager")
        }
    }

    attachEventListeners(){
        this.addEventListener(this.elements.backButton, "click", ()=>{
            this.onBackClicked?.();
        })
    }

    displayInfo(player){
        this.displaySearched(player);

        if(player.roleId == ROLE_IDS.DZELAT){
            this.elements.target.style.display = "block";
            this.elements.target.textContent = `Tvoja meta je: ${this.gameState.getExecutionTarget()}`;
        }
    }

    displaySearched(player){
        this.elements.name.textContent = player.name;
        this.elements.role.textContent = player.getRoleName();
        this.elements.alignment.textContent = player.getRoleAlignment();
        this.elements.desc.textContent = player.getRoleDescription();
    }

    show(displayType){
        super.show(displayType);
        this.elements.target.style.display = "none";
    }
}