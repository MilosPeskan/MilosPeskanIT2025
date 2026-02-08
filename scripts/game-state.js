import { CONFIG, LYNCH_MESSAGE, MESSAGES, ORDER_OF_ROLES, ROLE_IDS, WIN_MESSAGE } from './constants.js';
import { PlayerClass } from './player-manager.js';
import { IconManager } from './utils/icon-manager.js';

export class GameState{
    constructor() {
        this.playerObjects = []; //lista PlayerClass objekata
        this.players = []; //string player name
        this.roles = [];  //int index uloge
        this.nightOrder = []; //redosled id od uloga za budjenje 
        this.lynchVotes = 0;
        this.currentPlayerIndex = 0;
        this.iconManager = new IconManager;
        this.executionTarget = null;
        this.executionerPlayer = null;
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
        if(this.roles.length > 0){
            this.roles.pop();
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
        return this.getCurrentRole() == ROLE_IDS.DZELAT;
    }

    getExecutionTarget(){
        return this.executionTarget.name;
    }

    generateExecutionTarget(){
        const filterExecutioner = this.playerObjects.filter((_, index) => this.roles[index] != ROLE_IDS.DZELAT)
        this.executionTarget = filterExecutioner[Math.floor((Math.random()*filterExecutioner.length))];
    }

    getExecutioner(){
        for(const player of this.playerObjects){

        }
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
        return this.playerObjects.filter(p => p.isAlive);
    }

    /**
    * Dobavi sve mrtve igrače
    */
    getDeadPlayers() {
        return this.playerObjects.filter(p => !p.isAlive);
    }

    getNumberOfAlivePlayers(){
        return this.getAlivePlayers().length;
    }

    getLynchVotes(){
        return this.lynchVotes;
    }

    addLynchVote(player){
        const maxVotes = this.getNumberOfAlivePlayers();

        if(this.lynchVotes < maxVotes){
            player.addLynchVote();
            this.lynchVotes++;
        }
    }

    removeLynchVote(player){
        if(player.votes > 0){
            player.removeLynchVote();
            this.lynchVotes--;
        }
    }

    resetLynch(){
        this.lynchVotes = 0;
        for(const player of this.getAlivePlayers()){
            player.resetVotes();
        }
    }

    handleLynch(){
        const alivePlayers = this.getAlivePlayers();
        const maxVote = Math.max(...alivePlayers.map(p => p.getLynchVotes()))

        if(maxVote === 0){
            return LYNCH_MESSAGE.NO_VOTES;
        }

        const topVoted = alivePlayers.filter(p => p.getLynchVotes() === maxVote);
        const listOfNames = topVoted.map(p => p.name);

        this.resetLynch();

        if(topVoted.length > 1) return LYNCH_MESSAGE.TIE(maxVote, listOfNames.slice(0, -1), listOfNames.at(-1));
        else{
            topVoted[0].kill();
            return this.checkLynchWinCondition(topVoted[0], maxVote);
        }
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
        
        if (mafia.length === 0) return this.townWin();
        if (mafia.length >= town.length || mafia.length === town.length && alive.length === 2) return this.mafiaWin();
        
        return null; // Igra se nastavlja
    }

    checkLynchWinCondition(player, votes){
        if(player.roleId == ROLE_IDS.LUDAK) return this.jesterWin(player, votes);
        if(player === this.executionTarget) return this.executionerWin(player, votes);
        if(this.checkWinCondition()) return LYNCH_MESSAGE.LYNCHED(player.name, votes) + `\n` + this.checkWinCondition();
        return LYNCH_MESSAGE.LYNCHED(player.name, votes);
    }

    townWin(){
        return WIN_MESSAGE.TOWN_WIN;
    }

    mafiaWin(){
        return WIN_MESSAGE.MAFIA_WIN;
    }

    jesterWin(player, votes){
        return LYNCH_MESSAGE.JESTER(votes, player.name)
    }

    executionerWin(player, votes){

        return LYNCH_MESSAGE.EXECUTIONER(votes, player.name, )
    }
}