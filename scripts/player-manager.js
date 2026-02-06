import { ROLES } from "./data.js";

export class PlayerClass{
    constructor(name, roleId, iconPath = null){
        this.name = name;
        this.roleId = roleId;
        this.iconPath = iconPath;

        this.isAlive = true;
        this.statuses = new Set();
        this.visitedBy = [];
    }

    checkIfPlayerAlive(){
        return this.isAlive;
    }

    getRoleData(){
        return ROLES[this.roleId];
    }

    getRoleName(){
        return this.getRoleData().role;
    }

    getRoleAlignment(){
        return this.getRoleData().alignment;
    }

    getRoleDescription(){
        return this.getRoleData().description;
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

    kill(){
        this.isAlive = false;
        this.clearStatuses();
    }
}