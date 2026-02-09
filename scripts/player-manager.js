import { ROLES } from "./data.js";

export class PlayerClass{
    static nextId = 1;
    constructor(name, roleId, iconPath = null){
        this.id = PlayerClass.nextId++;
        this.name = name;
        this.roleId = roleId;
        this.iconPath = iconPath;

        this.isAlive = true;
        this.statuses = new Set();
        this.visitedBy = [];
        this.votes = 0;
    }

    checkIfPlayerAlive(){
        return this.isAlive;
    }

    getRoleData(){
        if (this.roleId === null) return null;
        return ROLES[this.roleId];
    }

    getRoleName(){
        const roleData = this.getRoleData();
        return roleData ? roleData.role : null;
    }

    getRoleAlignment(){
        const roleData = this.getRoleData();
        return roleData ? roleData.alignment : null;
    }

    getRoleDescription(){
        const roleData = this.getRoleData();
        return roleData ? roleData.description : null;
    }

    isAlignment(alignment){
        return this.getRoleAlignment() == alignment;
    }

    hasStatus(status){
        return this.statuses.has(status);
    }

    addStatus(status){
        this.statuses.add(status);
    }

    removeStatus(status){
        this.statuses.delete(status);
    }

    clearStatuses(){
        this.statuses.clear();
    }

    addLynchVote(){
        this.votes++;
    }

    removeLynchVote(){
        this.votes--;
    }

    getLynchVotes(){
        return this.votes;
    }

    resetVotes(){
        this.votes = 0;
    }

    kill(){
        this.isAlive = false;
        this.clearStatuses();
    }
}