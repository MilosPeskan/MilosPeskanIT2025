import { UiController } from "./ui-controller.js";

export class GameMenu extends UiController{
    constructor(rootElement, gameState){
        super(rootElement),

        this.gameState = gameState;
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements(){
        this.elements = {
            nightButton: this.rootElement.querySelector("#night-button"),
            backButton: this.rootElement.querySelector("#cancel-manager"),
            playerCardHolder: this.rootElement.querySelector("#player-holder")
        };
    }

    attachEventListeners(){
        this.addEventListener(this.elements.nightButton, "click", ()=>{
            this.onNightClicked?.();
        })
        this.addEventListener(this.elements.backButton, "click", ()=>{
            this.onBackClick?.();
        })
        this.addEventListener(this.elements.playerCardHolder, "click", (e) => {
            if(e.target.classList.contains("player-card")){
                const div = e.target.closest("div");
                this.onPlayerCardClicked(div._player);
            }
        })
    }

    displayPlayers(){
        this.elements.playerCardHolder.innerHTML = "";

        const columnsPerRow = this.gameState.players.length > 18 ? 5 : 6;
        this.elements.playerCardHolder.style.gridTemplateColumns = `repeat(${columnsPerRow}, 1fr)`;

        for(const player of this.gameState.playerObjects){
            const card = this.createPlayerCard(player);
            this.elements.playerCardHolder.appendChild(card);
        }
    }

    createPlayerCard(player){
        const card = document.createElement("div");
        card.classList.add("player-card");
        card.dataset.name = player.name;
        card._player = player;

        const icon = document.createElement("img");
        icon.classList.add("player-icon");
        icon.src = player.iconPath;

        const name = document.createElement("h3");
        name.classList.add("nametag");
        name.textContent = player.name;

        if(!player.checkIfPlayerAlive()){
            const skull = document.createElement("div");
            skull.classList.add("skull");
            icon.append(skull);
        }

        card.append(icon, name);
        return card;
    }
}