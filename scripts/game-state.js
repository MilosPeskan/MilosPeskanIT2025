import { ALIGNMENT, CONFIG, LYNCH_MESSAGE, MESSAGES, ORDER_OF_ROLES, ROLE_IDS, STATUS, WIN_MESSAGE } from './constants.js';
import { ROLES } from './data.js';
import { PlayerClass } from './player-manager.js';
import { IconManager } from './utils/icon-manager.js';
import { ROLE_BEHAVIOURS } from './utils/role-behaviours.js';

export class GameState{
    constructor() {
        this.players = []; //lista PlayerClass objekata
        this.pendingRoles = [];  //int index uloge
        this.lynchVotes = 0;
        this.currentPlayerIndex = 0;
        this.iconManager = new IconManager;
        this.executionTarget = null;
        this.executionerPlayer = null;

        this.nightQueue = []; //redosled roleId, player za budjenje 
        this.nightIndex = 0;

        this.nightActions = {
            kills: [], // targets marked for kill
            bodyguard: new Map(), // investigator.id -> target.id
            silenced: []
        };

        this.deaths = [];
        this.survived = [];
    }

    //funkcija za dodavanje igraca
    addPlayer(name){
        const sanitizedName = this.sanitizeName(name);

        if(!sanitizedName){
            throw new Error(MESSAGES.EMPTY_NAME);
        }

        if(sanitizedName.length > CONFIG.MAX_NAME_LENGTH){
            throw new Error(MESSAGES.NAME_TOO_LONG(CONFIG.MAX_NAME_LENGTH));
        }

        if(this.players.some(p => p.name === sanitizedName)){
            throw new Error(MESSAGES.NAME_EXISTS(sanitizedName));
        }

        if(this.players.length >= CONFIG.MAX_PLAYERS) {
            throw new Error(MESSAGES.MAX_PLAYERS_REACHED(CONFIG.MAX_PLAYERS));
        }

        this.players.push(new PlayerClass(sanitizedName, null, null));
        return sanitizedName;
    }

    sanitizeName(name) {
        if (!name) return '';
        
        // Ukloni specijalne karaktere, zadrži slova (uključujući naša slova), brojeve i razmake
        let sanitized = name
            .trim()
            .replace(/[^a-zA-ZčćžšđČĆŽŠĐ0-9\s]/g, '')
            .replace(/\s+/g, ' '); // Zameni više razmaka sa jednim
        
        // Prvo slovo veliko, ostala mala
        if (sanitized.length > 0) {
            sanitized = sanitized.charAt(0).toUpperCase() + sanitized.slice(1).toLowerCase();
        }
        
        return sanitized;
    }


    // uklanja ime igraca iz liste
    removePlayer(name) {
        const index = this.players.findIndex(p => p.name === name);
        if (index > -1) {
            this.players.splice(index, 1);
        }
        if(this.pendingRoles.length > 0){
            this.pendingRoles.pop();
        }
    }

    // vraca true ako je dostignut maksimalni broj igraca
    hasMaxNumberOfPlayers(){
        return this.players.length >= CONFIG.MAX_PLAYERS;
    }

    getPlayers(){
        return this.players.map(p => p.name);
    }

    getNumberOfPlayers(){
        return this.players.length;
    }

    addRole(roleId){
        if(this.pendingRoles.length !== this.players.length && this.maxSpecificRole(roleId)){
            this.pendingRoles.push(String(roleId));
        }
    }

    maxSpecificRole(roleId){
        if(ROLES[roleId].hasMaximum){
            return this.getSpecificRoleCount(roleId) < ROLES[roleId].hasMaximum;
        }
        else return true
    }

    removeRole(roleId){
        const position = this.pendingRoles.indexOf(String(roleId));

        if(position >= 0){
            this.pendingRoles.splice(position, 1);
        }
    }

    getSpecificRoleCount(roleID){
        return this.pendingRoles.filter((id) => (id === String(roleID))).length;
    }

    getNumberOfRoles(){
        return this.pendingRoles.length;
    }

    getNumberOfMissingRoles(){
        return this.getNumberOfRoles() - this.getNumberOfPlayers();
    }

    getCurrentPlayer(){
        return this.players[this.currentPlayerIndex]?.name;
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
        return this.players[this.currentPlayerIndex].roleId;
    }

    isExecutioner(){
        return this.getCurrentRole() == ROLE_IDS.DZELAT;
    }

    getExecutionTarget(){
        return this.executionTarget?.name;
    }

    generateExecutionTarget(){
        const filterExecutioner = this.players.filter(p => p.roleId != ROLE_IDS.DZELAT && p.roleId != ROLE_IDS.LUDAK)
        this.executionTarget = filterExecutioner[Math.floor((Math.random()*filterExecutioner.length))];
    }

    getExecutioner(){
        return this.players.find(p => p.roleId === ROLE_IDS.DZELAT);
    }

    resetPlayerIndex(){
        this.currentPlayerIndex = 0;
    }

    initializeGame(){
        this.shuffleArray(this.players);
        this.shuffleArray(this.pendingRoles);

        const icons = this.iconManager.getShuffledIcons(this.players.length);

        this.players.forEach((player, index) =>{
            player.roleId = this.pendingRoles[index];
            player.iconPath = icons[index];
        });

        this.nightQueue = this.buildNightQueue(this.players);

        this.nightIndex = 0;

        this.pendingRoles = [];
    }

    buildNightQueue(players) {
        const roleGroup = new Map();

        players.forEach((player) => {
            const roleId = Number(player.roleId);

            if(!roleGroup.has(roleId)){
                roleGroup.set(roleId, []);
            }

            roleGroup.get(roleId).push(player);
        })

        this.addAllMafiaToMafiaWakeUp(roleGroup);

        const queue = [];

        ORDER_OF_ROLES.forEach(roleId => {

            if(roleGroup.has(roleId)){

                queue.push({
                    roleId,
                    players: roleGroup.get(roleId)
                });

            }

        });

        return queue;
    }

    addAllMafiaToMafiaWakeUp(roleGroup){
        const allUniqueMafia = this.getAllUniqueMafia();
        if(!roleGroup.has(ROLE_IDS.MAFIJAS) && allUniqueMafia.length > 0){
            roleGroup.set(ROLE_IDS.MAFIJAS, []);
        }
        allUniqueMafia.forEach((player) => {
            roleGroup.get(ROLE_IDS.MAFIJAS).push(player);
        })
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
        return this.players.filter(p => !p.isAlive);
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

        if(topVoted.length > 1) return LYNCH_MESSAGE.TIE(maxVote, listOfNames.slice(0, -1).join(', '), listOfNames.at(-1));
        else{
            topVoted[0].kill();
            return this.checkLynchWinCondition(topVoted[0], maxVote);
        }
    }

    /**
     * Dobavi igrače po alignmentu
     */
    getPlayersByAlignment(alignment) {
        return this.players.filter(p => 
        p.isAlive && p.getRoleAlignment() === alignment
        );
    }

    getRandomPlayerRole(target){
        const playersWithoutTarget = this.players.filter(p => p !== target);
        return ROLES[playersWithoutTarget[Math.floor(Math.random() * playersWithoutTarget.length)].roleId].role;
    }

    getRandomTownRole(){
        const townPlayers = this.players.filter(p => p.getRoleAlignment() == ALIGNMENT.TOWN);
        return ROLES[townPlayers[Math.floor(Math.random() * townPlayers.length)].roleId].role;
    }

    getRandomMafiaRole(){
        const mafiaPlayers = this.players.filter(p => p.getRoleAlignment() == ALIGNMENT.MAFIA && p.roleId != ROLE_IDS.KUM);
        return ROLES[mafiaPlayers[Math.floor(Math.random() * mafiaPlayers.length)].roleId].role;
    }

    getAllUniqueMafia(){
        return this.players.filter(p => 
        p.isAlive && p.isMafiaAligned() && p.roleId != ROLE_IDS.MAFIJAS
        );
    }

    isEveryPlayerWithRoleDead(players){
        return players.every(player => !player.checkIfPlayerAlive());
    }

    isEveryPlayerWithRoleBlocked(players){
        return players.every(player => player.checkIfPlayerBlocked());
    }

    isEveryPlayerActed(players){
        return players.every(player => player.acted === true);
    }

    getPlayersByRoleId(roleId){
        return this.players.filter(p => Number(p.roleId) === roleId);
    }

    getCurrentNightStep(){
        return this.nightQueue[this.nightIndex] || null;
    }

    advanceNight(){
        this.nightIndex++;
    }

    isNightFinished(){
        this.nightIndex >= this.nightQueue.length;
    }

    calculateNight(){
        this.deaths = [];
        this.survived = [];
        this.applyKills();
        return this.showNightResults();
    }

    showNightResults(){
        let message = ""
        if(this.nightActions.silenced.length > 0){
            message += `<p> Igrači koji su ućutkani: ${this.nightActions.silenced.join(', ')}</p>`;
        }
        if(this.deaths.length > 0) {
            message += `<p>Igrači koji su ubijeni: ${this.deaths.join(', ')}</p>`;
        }
        if(this.survived.length > 0){
            message += `<p>Igrači koji su bili napadnuti: ${this.survived.join(', ')}</p>`;
        }
        const win = this.checkWinCondition();
        if(win){
            message += win;
        }
        this.resetNight();
        if(message.length > 0) return message
        else return "Noć je bila mirna."
    }

    resetNight(){
        this.nightIndex = 0;
        this.cleanupNightStatuses();
        this.clearNightActions();
    }

    clearNightActions() {
        this.nightActions = {
            kills: [], 
            bodyguard: new Map(),
            silenced: []
        };
    }

    getRoleBehaviour(roleId) {
        return ROLE_BEHAVIOURS[Number(roleId)];
    }

    setNightButtonAction(id){
        return ROLE_BEHAVIOURS[id];
    }

    applyKills() {
        this.nightActions.kills.forEach(player => {            
            if (player && player.isAlive) {
                // Proveri da li je zaštićen
                if(player.hasStatus(STATUS.IGNITED)){
                    player.kill();
                    this.deaths.push(player.name);
                    console.log(`${player.name} je zapaljen!`);
                } else if (!player.hasStatus(STATUS.PROTECTED)) {
                    const bodyguard = this.checkIfBodyguarded(player)
                    if(bodyguard){
                        bodyguard.kill();
                        this.deaths.push(bodyguard.name);
                        console.log(`${bodyguard.name} je ubijen tokom noći!`);
                        return;
                    }
                    player.kill();
                    this.deaths.push(player.name);
                    console.log(`${player.name} je ubijen tokom noći!`);
                } else {
                    console.log(`${player.name} je bio zaštićen!`);
                    this.survived.push(player.name);
                }
            }
        });
    }

    checkIfBodyguarded(player){
        for(const [key, value] of this.nightActions.bodyguard){
            if (value === player){
                return key;
            }
        }
    }

    cleanupNightStatuses() {
        this.players.forEach(player => {
            player.visitedBy = [];
            player.isBlocked = false;
            player.visitedByMafia = false;
            player.acted = false;
            player.removeStatus(STATUS.PROTECTED);
            player.removeBodyguardedStatuses();
            player.removeStatus(STATUS.ATTACK);
            player.removeStatus(STATUS.TRACKED);
            player.removeStatus(STATUS.CENSORED);
            player.removeStatus(STATUS.DUG_UP);
            player.removeStatus(STATUS.AMESIAC_TARGET);
            player.removeStatus(STATUS.CONFUSED);
            player.removeStatus(STATUS.SILENCED);
            player.removeStatus(STATUS.FALSIFIED);
            player.removeStatus(STATUS.RECORDED);
            player.removeStatus(STATUS.LOCKED_UP);
            player.removeStatus(STATUS.PARASITE_TARGET);
        });
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