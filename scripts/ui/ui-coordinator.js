import { ActionMenu } from "./action-menu.js";
import { GameMenu } from "./game-menu-ui.js";
import { InfoMenu } from "./information-menu.js";
import { LynchMenu } from "./lynch-menu-ui.js";
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

        this.lynchMenu = new LynchMenu(
            document.getElementById("lynchMenu"),
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
            this.backToMainMenu(this.roleMenu);
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
            this.nightMenu.displayCurrentStep();
        }

        this.gameMenu.onLynchClicked = () => {
            this.transitionTo(this.gameMenu, this.lynchMenu, "grid");
        }

        this.actionMenu.onActionComplete = () => {
            // Akcija izvršena, vrati se na night menu
            this.transitionTo(this.actionMenu, this.nightMenu, "block");
            
            // Automatski pređi na sledeći korak
            this.nightMenu.advanceToNextStep();
        };

        this.actionMenu.onActionSkipped = () => {
            // Akcija preskočena, vrati se na night menu
            this.transitionTo(this.actionMenu, this.nightMenu, "block");
            
            // Automatski pređi na sledeći korak
            this.nightMenu.advanceToNextStep();
        };

        this.nightMenu.onNightComplete = (message) => {
            // Noć je završena, vrati se na game menu
            this.transitionTo(this.nightMenu, this.gameMenu, "grid");
            this.gameMenu.nightPopup(message);
        };

        this.nightMenu.onActionRequested = (roleId, players) => {
            // Otvori action menu za tu ulogu i igrača
            this.transitionTo(this.nightMenu, this.actionMenu, "grid");
            this.actionMenu.setupAction(roleId, players);
        };

        this.lynchMenu.onCancelClicked = () => {
            this.transitionTo(this.lynchMenu, this.gameMenu, "grid");
        }

        this.lynchMenu.onLynchClicked = () => {
            this.transitionTo(this.lynchMenu, this.gameMenu, "grid");
            this.gameMenu.lynchPopup();
        }
    }

    transitionTo(fromController, toController, type){
        fromController.hide();
        toController.show(type);
    }

    backToMainMenu(fromMenu){
        // Reset game state
        this.gameState.players = [];
        this.gameState.pendingRoles = [];
        this.gameState.nightQueue = [];
        this.gameState.nightIndex = 0;
        
        this.transitionTo(fromMenu, this.mainMenu);
    }

    hideAll(){
        this.mainMenu.hide();
        this.roleMenu.hide();
        this.revealMenu.hide();
        this.gameMenu.hide();
        this.infoMenu.hide();
        this.nightMenu.hide();
        this.lynchMenu.hide();
    }

    cleanup(){
        this.mainMenu.cleanup();
        this.roleMenu.cleanup();
        this.revealMenu.cleanup();
        this.gameMenu.cleanup();
        this.infoMenu.cleanup();
        this.nightMenu.cleanup();
        this.lynchMenu.cleanup();
    }
}