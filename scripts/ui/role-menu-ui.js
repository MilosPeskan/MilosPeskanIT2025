import { UiController } from "./ui-controller.js";
import { ROLES } from "../data.js";

export class RoleMenu extends UiController{
    constructor(rootElement, gameState){
        super(rootElement)

        this.gameState = gameState;
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements(){
        this.elements = {
            cardHolder: this.rootElement.querySelector("#cardHolder"),
            startButton: this.rootElement.querySelector("#startButton"),
            backButton: this.rootElement.querySelector("#cancel")
        };
    }

    attachEventListeners(){
        this.addEventListener(this.elements.cardHolder, "click", (e) => {
            if(e.target.classList.contains("add-role")){
                const roleID = e.target.dataset.roleId;
                this.handleAddRole(roleID);
            } else if(e.target.classList.contains("remove-role")){
                const roleID = e.target.dataset.roleId;
                this.handleRemoveRole(roleID);
            }
        })

        this.addEventListener(this.elements.startButton, "click", () => {
            this.handleStart();
        })

        this.addEventListener(this.elements.backButton, "click", () =>{
            this.onBackClick?.();
        })
    }

    listRoles(){
        this.elements.cardHolder.innerHTML = "";

        for(const [id, data] of Object.entries(ROLES)){


            const card = this.createRoleCards(id, data);
            this.elements.cardHolder.appendChild(card);
            this.updateRoleCounter(id);
        }

        this.updateCounter();
    }

    // metoda za kreiranje HTML kartica sa ulogama
    createRoleCards(id, data){
        const roleCard = document.createElement("div");
        roleCard.classList = "card";
        roleCard.dataset.roleId = id;
        roleCard.dataset.alignment = data.alignment;
    
        const roleName = document.createElement("h3");
        roleName.textContent = data.role;
        roleName.className = "role-name";
    
        const roleAlignment = document.createElement("p");
        roleAlignment.textContent = `Strana: ${data.alignment}`;
        roleAlignment.className = "role-alignment";
    
        const roleCategory = document.createElement("p");
        roleCategory.textContent = `Tip: ${data.category}`;
        roleCategory.className = "role-category";
    
        const roleDescription = document.createElement("p");
        roleDescription.textContent = data.description;
        roleDescription.className = "role-description";
        
        const controls = this.createRoleControls(id);
    
        roleCard.append(roleName, roleAlignment, roleCategory, roleDescription, controls)
        return roleCard;
    }

    // metoda za kreiranje kontrola za dodavanje uloga
    createRoleControls(roleId){
        const container = document.createElement("div");
        container.className = "number-div";

        const removeRoleButton = document.createElement("button");
        removeRoleButton.className = "remove-role";
        removeRoleButton.dataset.roleId = roleId;

        const counter = document.createElement("span");
        counter.textContent = 0;
        counter.className = "counter";
        counter.dataset.roleId = roleId;
    
        const addRoleButton = document.createElement("button");
        addRoleButton.className = "add-role";
        addRoleButton.dataset.roleId = roleId;

        container.append(removeRoleButton, counter, addRoleButton);

        return container;
    }

    handleAddRole(roleId){
        try{
            this.gameState.addRole(roleId);
            this.updateRoleCounter(roleId);
            this.updateCounter();
        } catch (error){
            alert(error.message)
        }
    }

    handleRemoveRole(roleId){
        try{
            this.gameState.removeRole(roleId);
            this.updateRoleCounter(roleId);
            this.updateCounter();
        } catch (error){
            alert(error.message)
        }
    }

    updateRoleCounter(roleId){
        const counter = this.elements.cardHolder.querySelector(
            `.counter[data-role-id="${roleId}"]`
        );

        if(counter){
            counter.textContent = this.gameState.getSpecificRoleCount(roleId);
        }
    }

    updateCounter(){
        const roleNumber = this.gameState.getNumberOfRoles();
        const playerNumber = this.gameState.getNumberOfPlayers();
        this.elements.startButton.textContent = `${roleNumber} / ${playerNumber}`
        if(roleNumber === playerNumber) {
            this.elements.startButton.textContent = "START";
            this.emphasizeStart()
        
        }
    }

    emphasizeStart(){
        const btn = this.elements.startButton;

        let span = btn.querySelector("span");

        // ako nema, napravi ga
        if (!span) {
            span = document.createElement("span");
            span.textContent = btn.textContent;
            btn.textContent = "";
            btn.appendChild(span);
        }

        // reset animacije
        span.classList.remove("pulse");
        void span.offsetWidth; // reflow
        span.classList.add("pulse");
    }

    handleStart(){
        const missingRoles = this.gameState.getNumberOfMissingRoles();
        if(missingRoles < 0) {
            alert(`Potrebno je dodati još ${missingRoles * -1} uloga!`)
        }
        else {
            this.onStartGame?.();
        }
    }

    show(displayType){
        super.show(displayType);
        this.listRoles();
        this.updateCounter();
    }
}

