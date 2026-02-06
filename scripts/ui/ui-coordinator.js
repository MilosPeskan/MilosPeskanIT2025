import { ActionMenu } from "./action-menu.js";
import { GameMenu } from "./game-menu-ui.js";
import { InfoMenu } from "./information-menu.js";
import { MainMenu } from "./main-menu-ui.js";
import { NightMenu } from "./night-menu-ui.js";
import { RoleMenu } from "./role-menu-ui.js";
import { RoleRevealMenu } from "./role-reveal-ui.js";

export class UiCoordinator{
    constructor(gameState){
        this.gameState = gameState;
        this.initializeControlers();
        this.setupCallbacks();
    }

    initializeControlers(){
        this.mainMenu = new MainMenu(
            document.getElementById("mainMenu"),
            this.gameState
        );

        this.roleMenu = new RoleMenu(
            document.getElementById("settingsMenu"),
            this.gameState
        );

        this.revealMenu = new RoleRevealMenu(
            document.getElementById("roleSelection"),
            this.gameState
        );

        this.gameMenu = new GameMenu(
            document.getElementById("managerMenu"),
            this.gameState
        );

        this.infoMenu = new InfoMenu(
            document.getElementById("playerInfoMenu"),
            this.gameState
        );

        this.nightMenu = new NightMenu(
            document.getElementById("nightMenu"),
            this.gameState
        );

        this.actionMenu = new ActionMenu(
            document.getElementById("actionMenu"),
            this.gameState
        );

        this.hideAll();
        this.mainMenu.show("flex");
    }

    /*
    vrednosti menija: 
    main - flex
    role - grid
    reveal - flex
    manager - grid
    info - grid
    night - block

    default - flex
    */
    setupCallbacks(){
        this.mainMenu.onNextClick = () => {
            this.transitionTo(this.mainMenu, this.roleMenu, "grid");
        };

        this.roleMenu.onStartGame = () => {
            this.gameState.initializeGame();
            this.transitionTo(this.roleMenu, this.revealMenu);
        };

        this.roleMenu.onBackClick = () => {
            this.backToMainMenu(this.mainMenu);
        };

        this.revealMenu.onRevealComplete = () => {
            this.transitionTo(this.revealMenu, this.gameMenu, "grid");
            this.gameMenu.displayPlayers();
        };

        this.revealMenu.onBackClick = () => {
            this.backToMainMenu(this.revealMenu);
        };

        this.gameMenu.onBackClick = () => {
            this.backToMainMenu(this.gameMenu);
        };

        this.gameMenu.onPlayerCardClicked = (player) => {
            this.transitionTo(this.gameMenu, this.infoMenu);
            this.infoMenu.displayInfo(player);
        };

        this.infoMenu.onBackClicked = () => {
            this.transitionTo(this.infoMenu, this.gameMenu, "grid");
        };

        this.gameMenu.onNightClicked = () => {
            this.transitionTo(this.gameMenu, this.nightMenu, "block");
        }

        this.nightMenu.onActionClicked = (action) => {
            this.transitionTo(this.nightMenu, this.actionMenu, "grid");
        };
    }

    transitionTo(fromController, toController, type){
        fromController.hide();
        toController.show(type);
    }

    backToMainMenu(fromMenu){
        this.transitionTo(fromMenu, this.mainMenu);
    }

    hideAll(){
        this.mainMenu.hide();
        this.roleMenu.hide();
        this.revealMenu.hide();
        this.gameMenu.hide();
        this.infoMenu.hide();
        this.nightMenu.hide();
    }

    cleanup(){
        this.mainMenu.cleanup();
        this.roleMenu.cleanup();
        this.revealMenu.cleanup();
        this.gameMenu.cleanup();
        this.infoMenu.cleanup();
        this.nightMenu.cleanup();
    }
}