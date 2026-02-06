import { CONFIG, EXECUTIONER_ID, MESSAGES, ORDER_OF_ROLES } from './constants.js';
import { PlayerClass } from './player-manager.js';
import { IconManager } from './utils/icon-manager.js';

export class GameState{
    constructor() {
        this.playerObjects = []; //lista PlayerClass objekata
        this.players = []; //string player name
        this.roles = [];  //int index uloge
        this.nightOrder = [];
        this.currentPlayerIndex = 0;
        this.iconManager = new IconManager;
        this.executionTarget = null;
    }

    //funkcija za dodavanje igraca
    addPlayer(name){
        if(!name){
            throw new Error(MESSAGES.EMPTY_NAME);
        }

        if(name.length > CONFIG.MAX_NAME_LENGTH){
            throw new Error(MESSAGES.NAME_TOO_LONG(CONFIG.MAX_NAME_LENGTH));
        }

        if(this.players.includes(name)){
            throw new Error(MESSAGES.NAME_EXISTS(name));
        }

        if(this.players.length >= CONFIG.MAX_PLAYERS) {
            throw new Error(MESSAGES.MAX_PLAYERS_REACHED(CONFIG.MAX_PLAYERS));
        }

        this.players.push(name);
    }

    // uklanja ime igraca iz liste
    removePlayer(name) {
        const index = this.players.indexOf(name);
        if (index > -1) {
            this.players.splice(index, 1);
        }
    }

    // vraca true ako je dostignut maksimalni broj igraca
    hasMaxNumberOfPlayers(){
        return this.players.length >= CONFIG.MAX_PLAYERS;
    }

    getPlayers(){
        return [...this.players];
    }

    addRole(roleId){
        if(this.roles.length !== this.players.length){
            this.roles.push(String(roleId));
        }
    }

    removeRole(roleId){
        const position = this.roles.indexOf(String(roleId));

        if(position >= 0){
            this.roles.splice(position, 1);
        }
    }

    getSpecificRoleCount(roleID){
        return this.roles.filter((id) => (id === String(roleID))).length;
    }

    getNumberOfMissingRoles(){
        return this.roles.length - this.players.length;
    }

    getCurrentPlayer(){
        return this.players[this.currentPlayerIndex];
    }

    nextPlayer(){
        if(this.currentPlayerIndex < this.players.length){
            this.currentPlayerIndex++;
            return true;
        }
        else{
            return false;
        }
    }

    hasMorePlayers(){
        return this.currentPlayerIndex < this.players.length;
    }

    getCurrentRole(){
        return this.roles[this.currentPlayerIndex];
    }

    isExecutioner(){
        return this.getCurrentRole() == EXECUTIONER_ID;
    }

    getExecutionTarget(){
        return this.executionTarget;
    }

    generateExecutionTarget(){
        const filterExecutioner = this.players.filter((_, index) => this.roles[index] != EXECUTIONER_ID)
        this.executionTarget = filterExecutioner[Math.floor((Math.random()*filterExecutioner.length))];
    }

    resetPlayerIndex(){
        this.currentPlayerIndex = 0;
    }

    initializeGame(){
        this.shuffleArray(this.players);
        this.shuffleArray(this.roles);

        const icons = this.iconManager.getShuffledIcons(this.players.length);

        this.createPlayerObjects(icons);
        this.nightOrder = this.generateNightOrder(this.playerObjects);
        console.log(this.nightOrder);
    }

    createPlayerObjects(icons){
        this.playerObjects = this.players.map((name, index) => {
            return new PlayerClass(
                name,
                this.roles[index],
                icons[index]
            )
        });
    }

    generateNightOrder(players){
        const activeRoleIds = [...new Set(players.map(p => Number(p.roleId)))];
  
        return ORDER_OF_ROLES.filter(roleId => activeRoleIds.includes(roleId));
    }

    shuffleArray(array) {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex !== 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    getAlivePlayers() {
    return this.players.filter(p => p.isAlive);
  }

  /**
   * Dobavi sve mrtve igrače
   */
    getDeadPlayers() {
        return this.playerObjects.filter(p => !p.isAlive);
    }

    /**
     * Dobavi igrače po alignmentu
     */
    getPlayersByAlignment(alignment) {
        return this.playerObjects.filter(p => 
        p.isAlive && p.getAlignment() === alignment
        );
    }

    /**
     * Proveri ko je pobedio
     */
    checkWinCondition() {
        const alive = this.getAlivePlayers();
        const mafia = alive.filter(p => p.isAlignment('Mafija'));
        const town = alive.filter(p => p.isAlignment('Selo'));
        
        if (mafia.length === 0) return 'TOWN_WINS';
        if (mafia.length >= town.length || mafia.length === town.length && alive.length === 2) return 'MAFIA_WINS';
        
        return null; // Igra se nastavlja
    }
}