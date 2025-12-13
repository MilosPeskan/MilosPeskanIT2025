
let players = [];
let index = 0;
let buttonRole = true;
let noOfRoles = 0;
let rolePool = [];
let progressor = 0;
let orderOfRoles = [20, 11, 18, 7, 1, 14, 6, 19, 17, 2, 13, 4, 15, 8, 12, 16];
let sortedRoles = [];
let playerObjects = [];

let actionPickPlayer = false;
let actionShowRole = false;
let actionDousePlayer = false;
let actionBewitchPlayer = false;
let actionPickTarget = false;
let actionSeVisited = false;
let actionRememberRole = false;
let burning = false;

let ubijeni = [];
let posecujeMafija;
let metaEgzekutora;

const form = document.getElementById("playerInputForm");
const playerNameInput = document.getElementById("inputName");
const deskripcija = document.getElementById("deskripcija");
const playersList = document.getElementById("listOfPlayers");
const playersListContainer = document.getElementById("playerListDivider");
const inputButton = document.getElementById("addPlayer");
const start = document.getElementById("startButton");
const back = document.getElementById("back");
const reveal = document.getElementById("revealRole");
const playerName = document.getElementById("player");
const roleHolder = document.getElementById("roleHolder");
const warning = document.getElementById("warning");
const settings = document.getElementById("settingsButton");
const cardHolder = document.getElementById("cardHolder")
const displayName = document.getElementById("displayName");
const displayAlignment = document.getElementById("displayAlignment");
const displayDesc = document.getElementById("displayDesc");
const playerHolder = document.getElementById("playerHolder");
const quit = document.getElementById("cancelManager");
const cancel = document.getElementById("cancel");
const nightButton = document.getElementById("nightButton");
const wakeUpRole = document.getElementById("wakeUpRole");
const infoRole = document.getElementById("infoRole");
const action = document.getElementById("action");
const backToManager = document.getElementById("backToManager");
const secondAction = document.getElementById("secondAction");
const targetExecution = document.getElementById("meta");

const mainMenu = document.getElementById("mainMenu");
const selectionMenu = document.getElementById("roleSelection");
const settingsMenu = document.getElementById("settingsMenu");
const managerMenu = document.getElementById("managerMenu");
const playerInfoMenu = document.getElementById("playerInfoMenu");
const nightMenu = document.getElementById("nightMenu");

const colorDead = "#4B4B4B";
const colorMafia = "#8f3636ff";
const colorNeutral = "#944fa0ff";
const colorTown = "#4CAF50";
const colorCard = "#f9f9f9";
const colorNonSelectable = "#000000ff";
const colorDoused = "#636819ff";
const colorBewitched = "#f1327bff";

const images = [
  'one.png',
  'two.png',
  'three.png',
  'four.png',
  'five.png',
  'six.png'
]

const imagePath = 'resourses/plates/'

import { roles } from "./data.js";

// proverava da li ime postoji u listi i da li je polje za ime popunjeno
form.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = playerNameInput.value.trim();

    if (name !== "") {
        checkIfNameInList(name);
    } 
    else {
        window.alert("Molimo unesite ime igrača!");
    }
});

// funkcija koja proverava da li ime postoji
function checkIfNameInList(name){
    if (players.includes(name)) {
        throwNameExists(name);
        return;
    }

    addNameToList(name);
};

// poruka da ime vec postoji i cisti input field
function throwNameExists(name){
    alert("Igrač " + name + " je već dodat u igru, molimo Vas koristite drugo ime!");

    playerNameInput.value = "";
};

// dodaje ui element igraca u listu na designated field
function addNameToList(name){
    if (players.length === 0){
      deskripcija.style.display = "none"
    }
    const li = document.createElement("li");
    li.textContent = name;
    li.style.backgroundImage = `url('${getRandomImage()}')`;

    const deleteButton = document.createElement('button');
    deleteButton.innerText = "X";
    deleteButton.id = "deleteButton";

    deleteButton.addEventListener("click", () => {
        const nameToDelete = li.firstChild.textContent.trim();
        removePlayer(deleteButton, nameToDelete);
        if (players.length === 0){
          deskripcija.style.display = "block"
        }
    }
    );
    li.appendChild(deleteButton);

    playersList.appendChild(li);

    players.push(name);

    playerNameInput.value = "";

    if (players.length == 20) {
        inputManager(true);
    }
};

// vraca random sliku za pozadinu igraca
function getRandomImage() {
  const randomIndex = Math.floor(Math.random() * images.length);
  return imagePath + images[randomIndex];
}

// blokira ili omogucava dodavanje novih igraca
function inputManager(flip){
    playerNameInput.disabled = flip;
    inputButton.disabled = flip;
};

// funkcija za uklanjanje igraca iz liste
function removePlayer(item, name) {
    item.parentElement.remove();
    players = players.filter(item => item !== name);
    inputManager(false);
};


// dugme za zapocinjanje igre i logika o ulogama
start.addEventListener("click", function(e) {
    e.preventDefault();

    if (noOfRoles != 0) {
      window.alert(`Potrebno je dodati još ${noOfRoles} uloga`)
    }
    else {
      selectionMenu.style.display = "flex";
      settingsMenu.style.display = "none";    

      if (rolePool.includes("10")) {
        let filteredPool = rolePool.filter(r => r !== "10");
        metaEgzekutora = players[filteredPool[Math.floor(Math.random() * filteredPool.length)]];
        console.log(metaEgzekutora)
      }

      shuffleArray(players);
      shuffleArray(rolePool);
      
      index = 0;
      playerName.textContent = players[index];
      displayRole(rolePool[index])
      constructPlayerObject();
    }
});

// funkcija za prikazivanje uloga igracima
function displayRole(index){
    displayName.textContent = `Uloga: ${roles[index].role}`;    
    displayAlignment.textContent = `Strana: ${roles[index].alignment}`;
    displayDesc.textContent = roles[index].description;

    if (index == 10){
    console.log(index)
    targetExecution.textContent = `Meta egzekucije: ${metaEgzekutora}`;
  } else{
    targetExecution.textContent = "";
  }
}

// logika dugmeta za pocetak odabira uloga
settings.addEventListener("click", function(e) {
    e.preventDefault();

    listRolesInSettings();

    displayNoRolesAndPlayers();

    transitionMenu(mainMenu, settingsMenu, "grid") ;
});

// prikazuje odnos igraca i uloga koje su dodate
function displayNoRolesAndPlayers () {
  start.textContent = `${rolePool.length} \\ ${players.length}`;
}

// dugme za vracanje unazad
back.addEventListener("click", function(e) {
    e.preventDefault();

    transitionMenu(selectionMenu,mainMenu, "flex");

    reset();
});

// resetuje meni za prikaz uloga
function reset() {
  warning.textContent = "Kliknite na dugme da sakrijete svoju ulogu i predajte telefon igraču koji je sledeći naveden";
  warning.style.display = "none";
  rolePool = []
};

// logika dugmeta za prikaz uloga
reveal.addEventListener("click", function () {
    if (buttonRole) {
        showRole();
    } else {
        hideRole();
    }
    buttonRole = !buttonRole;
});

// funkcija sa logikom o prikazu i sakrivanju informacija o ulozi
function showRole() {
    warning.style.display = "flex";
    roleHolder.style.display = "block";
    displayRole(rolePool[index]);

    if (index === players.length - 1) {
        warning.textContent = "Kliknite na dugme da sakrijete svoju ulogu i predajte uređaj naratoru";
    } else {
        warning.textContent = "Kliknite na dugme da sakrijete svoju ulogu i predajte uređaj sledećem igraču.";
    }
}

// nznm
function hideRole() {
    transitionMenu(warning, roleHolder, "none")
    if (index === players.length - 1) {
        transitionMenu(selectionMenu, managerMenu, "grid")
        listManagerMenu();
    } else {
        displayPlayer();
    }
}

// funkcija za prikaz imena igraca
function displayPlayer() {
    index += 1;
    playerName.textContent = players[index];
};

// randomizer za redosled igraca
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// funkcija koja prikazuje listu svih uloga u podesavanjima
function listRolesInSettings() {
  cardHolder.innerHTML = ""; 
  for (const x in roles) {
    const id = x;
    
    const roleCard = document.createElement("div");
    roleCard.classList.add("card");

    const roleName = document.createElement("h3");
    roleName.textContent = roles[x].role;
    roleName.classList.add("roleName");

    const roleAlignment = document.createElement("p");
    roleAlignment.textContent = `Strana: ${roles[x].alignment}`;
    roleAlignment.classList.add("roleAlignment");

    const roleCategory = document.createElement("p");
    roleCategory.textContent = `Tip: ${roles[x].category}`;
    roleCategory.classList.add("roleCategory");

    const roleDescription = document.createElement("p");
    roleDescription.textContent = roles[x].description;
    roleDescription.classList.add("roleDescription");

    const numberDiv = document.createElement("div");
    numberDiv.classList.add("numberDiv")

    const addRole = document.createElement("button");
    addRole.classList.add("addRole");

    const counter = document.createElement("p");
    counter.textContent = 0;
    counter.classList.add("counter");

    const removeRole = document.createElement("button");
    removeRole.classList.add("removeRole");

    noOfRoles = players.length - rolePool.length;

    addRole.addEventListener("click", () => {
      let value = parseInt(counter.textContent);
      if (value < players.length && noOfRoles > 0) {
        counter.textContent = value + 1;
        noOfRoles -= 1;
        rolePool.push(id);
        displayNoRolesAndPlayers();
      }
      else {
        window.alert("Dodavanjem ove uloge bilo bi više uloga nego igrača!")
      }
    });

    removeRole.addEventListener("click", () => {
      let value = parseInt(counter.textContent);
      if (value > 0) {
        counter.textContent = value - 1;
        noOfRoles += 1;
        if ( rolePool.includes(id)){
          removeFirstMatchInPlace(rolePool, id)
        }
        displayNoRolesAndPlayers();
      }
    });

    if (roles[x].alignment === "Selo") {
      roleCard.style.backgroundColor = colorTown;
    } 
    else if (roles[x].alignment === "Mafija") {
      roleCard.style.background = colorMafia;
    } 
    else if (roles[x].alignment === "Neutralno") {
      roleCard.style.backgroundColor = colorNeutral;
    }
    if (x == 20 || x == 11){
      numberDiv.textContent = "Bice dodato"
    }
    else {
      numberDiv.append(removeRole, counter, addRole)
    }
    roleCard.append(roleName, roleAlignment, roleCategory, roleDescription, numberDiv);

    cardHolder.appendChild(roleCard);
  }
}

// funkcija koja uklanja prvu ulogu iz liste uloga koji se poklapa sa ulogom koja je smanjena
function removeFirstMatchInPlace(array, search) {
  const index = array.indexOf(search);
  array.splice(index, 1);
  return array;
}

// dugmer za vracanje na main menu
cancel.addEventListener("click", () =>{
    transitionMenu(settingsMenu, mainMenu, "flex")
    rolePool = [];
})

// dugmer za vracanje na main menu
quit.addEventListener("click", () =>{
  transitionMenu(managerMenu,mainMenu, "flex");
  rolePool = [];
})

// prikazivanje informacija o igracu u meniju za informacije o igracu
function displayPlayerInfo (id, name) {
  infoRole.innerHTML = ""; 

  const infoName = document.createElement("h3");
  infoName.textContent = name;

  const roleInfo = document.createElement("h3");
  roleInfo.textContent = roles[rolePool[id]].role;
  //name.classList.add("roleName");

  const alignment = document.createElement("p");
  alignment.textContent = `Strana: ${roles[rolePool[id]].alignment}`;
  //roleAlignment.classList.add("roleAlignment");

  //const roleCategory = document.createElement("p");
  //roleCategory.textContent = `Tip: ${roles[x].category}`;
  //roleCategory.classList.add("roleCategory");

  const infoDescription = document.createElement("p");
  infoDescription.textContent = roles[rolePool[id]].description;
  //roleDescription.classList.add("roleDescription");

  let elements = [infoName, roleInfo, alignment, infoDescription];

  if (rolePool[id] == 10) {
    let meta = document.createElement("p");
    meta.textContent = `Meta egzekucije: ${metaEgzekutora}`;
    elements.push(meta);
  }

  infoRole.append(...elements);
}

function constructPlayerObject() {
  for (let x in players) {
    x = {
      name: players[x],
      alive: true,
      role: rolePool[x],
      statuses: []
    }
    playerObjects.append(this);
  }
}

// funkcija koja kreira nametags za sve igrace i handeluje akcije tokom noci vrsene na igracima 
function listManagerMenu(){
  playerHolder.innerHTML = ""; 
  for (let x in players) {

    const playerCard = document.createElement("button");
    playerCard.classList.add("card");
    playerCard.classList.add("infoCard")

    playerCard.dataset.status = "alive"
    playerCard.dataset.role = `${rolePool[x]}`
    playerCard.dataset.id = x;
    playerCard.dataset.name = players[x];

    const cardTitle = document.createElement("h3");
    cardTitle.textContent = roles[rolePool[x]].role;

    playerCard.addEventListener("click", () => {
      if (actionPickPlayer) {
        addStatus(playerCard, action.dataset.purpose);
        addVisited(playerCard.dataset.name, action.dataset.id);
        actionOnPlayer(managerMenu);
        if (action.dataset.id == 4 || action.dataset.id == 5 || action.dataset.id == 6 || action.dataset.id == 7) {
          console.log(action.dataset.id)
          posecujeMafija = playerCard.dataset.name;
        }
      }
      else if (actionDousePlayer) {
        addStatus(playerCard, action.dataset.purpose);
        addVisited(playerCard.dataset.name, action.dataset.id);
        actionOnPlayer(managerMenu);
        secondAction.style.display = "none";
      }
      else if (actionShowRole){
        transitionMenu(managerMenu, playerInfoMenu, "block")
        addVisited(playerCard.dataset.name, action.dataset.id);
        displayPlayerInfo(playerCard.dataset.id, cardTitle.textContent)
      }
      else if (actionBewitchPlayer){
        addStatus(playerCard, action.dataset.purpose);
        addVisited(playerCard.dataset.name, action.dataset.id);
        actionOnPlayer(managerMenu);
        actionPickTarget = true;
      }
      else if (actionPickTarget){
        addStatus(playerCard, action.dataset.purpose);
        actionOnPlayer(managerMenu);
      }
      else if (actionSeVisited){
        seeWhoVIsited(playerCard);
      }
      else if (actionRememberRole){
        adoptRole(playerCard.dataset.role);
      }
      else {
        transitionMenu(managerMenu, playerInfoMenu, "block")
        displayPlayerInfo(playerCard.dataset.id, cardTitle.textContent)
      }
      for (let y of playerHolder.children){
        if(hasStatus(y, "alive")){
          y.disabled = false;
          y.style.backgroundColor = colorCard;
        }
        if(hasStatus(y, "dead")){
          y.disabled = true;
          y.style.backgroundColor = colorNonSelectable;
        }
      }
    })
    playerCard.append(cardTitle);
    playerCard.classList.add("playerStats")
    playerHolder.append(playerCard);
  }
};

// dugme za pocetak noci
nightButton.addEventListener("click", () => {
  progressor = 0;
  transitionMenu(managerMenu, nightMenu, "block")
  roleOrder();
});

let lastRole;

function debugDataset() {
  for (let child of playerHolder.children) {
    console.log(`Element:`, child);

    const data = {};
    for (let key in child.dataset) {
      data[key] = child.dataset[key];
    }

    console.log("Dataset:", data);
  }
  console.log("-------------------")
}

// funkcija za budjenje igraca
function wakeUp() {
  console.log("pozvan wakeup")
  if (progressor > sortedRoles.length) {
    transitionMenu(nightMenu, managerMenu, "grid")
  } 
  else if (progressor === sortedRoles.length) {
    calculateNight();
    if(ubijeni.length == 0){
      wakeUpRole.textContent = `Jutro je, niko nije ubijen`;
    }
    else if (ubijeni.length == 1) {
      wakeUpRole.textContent = listAllDead(ubijeni);
      setLastKilled(ubijeni[ubijeni.length - 1]);
    }
    else {
      wakeUpRole.textContent = listAllDead(ubijeni);
      setLastKilled(ubijeni[ubijeni.length - 1]);
    }
    progressor += 1;
    action.textContent = "Nazad"
    cleanup(lastRole);
  }
  else {
    lastRole = sortedRoles[progressor];
    action.disabled = false;
    action.style.display = "block"
    secondAction.style.display = "none"
    secondAction.textContent = "Sledeći"

    if(checkIfBlocked(lastRole)){
      wakeUpRole.textContent = `BLOKIRAN Budi se ${roles[lastRole].role} \n BLOKIRAN`;
      action.style.display = "none"
      secondAction.style.display = "block";
      secondAction.textContent = "Sledeći"
    }
    else if(checkIfDead(lastRole)){
      wakeUpRole.textContent = `MRTAV Budi se ${roles[lastRole].role} MRTAV`;
      action.style.display = "none"
      secondAction.style.display = "block";
      secondAction.textContent = "Sledeći"
    } 
    else if (lastRole == "12"){
      secondAction.style.display = "block";
      secondAction.textContent = "Zapali sve";
      wakeUpRole.textContent = `Budi se ${roles[lastRole].role}`;
    }
    else {
      wakeUpRole.textContent = `Budi se ${roles[lastRole].role}`;
      secondAction.textContent = "Sledeći"
    }
    roleActionCheck();
    progressor += 1;
  }
  //debugDataset();
};

// funkcija koja lista sve ubijene tokom noci
function listAllDead(arr) {
  if (arr.length === 0) return "";
  if (arr.length === 1) return "Jutro je, ubijen je " + arr[0];
  if (arr.length === 2) return "Jutro je, ubijeni su " + arr[0] + " i " + arr[1];
  let newArr = [];
  for (let x of arr){
    newArr.push(arr[x])
  }
  return "Jutro je, ubijeni su " + newArr.slice(0, -1).join(", ") + " i " + newArr[newArr.length - 1];
}

// funkcija koja proverava da li je uloga koja se budi mrtva i onemogucava akcije ako jeste
function checkIfDead(roleId) {
  let foundDead = false;

  for (let x of playerHolder.children) {
    if (x.dataset.role == roleId) {
      if (!hasStatus(x, "dead")) {
        return false;
      } else {
        foundDead = true; 
      }
    }
  }
  return foundDead;
}

// funkcija koja proverava da li je igrac koji se budi blokiran i blokira akcije ako jeste
function checkIfBlocked(who) {
  for (let x of playerHolder.children) {
    if (hasStatus(x, "blokiraj") && x.dataset.role == who){
      return true;
    }
  }
  return false;
}

// postavlja igraca koji je poslednji ubijen
function setLastKilled(nameKilled){
  let player = [...playerHolder.children].find(x => x.dataset.name === nameKilled);
  if (player){
    playerHolder.dataset.mortitianTarget = `${player.dataset.name} ${roles[player.dataset.role].role}`;
  }
}

// cisti podatke o prosloj noci
function cleanup(lastRole) {
  //console.log("last role"+lastRole)
  for (let x of playerHolder.children) {
    console.log(x.dataset.name + "je posetio" + x.dataset.visited)
    if (lastRole == x.dataset.role) {
      x.disabled = false;
      x.style.backgroundColor = colorCard;
    }
    removeStatus(x, "ubij")
    removeStatus(x, "zastiti")
    removeStatus(x, "blokiraj")
    removeStatus(x, "kontrolisi")
    removeStatus(x, "target")
    removeStatus(x, "zastitiZivotom")
    removeStatus(x, "mafijaNapada")
    removeStatus(x, "kogaPosetio")

    posecujeMafija = null;

    if (hasStatus(x, "dead")) {
      x.disabled = true;
      x.style.backgroundColor = colorDead;
    }
  }
  delete action.dataset.purpose;
}

// funkcija koja racuna ishod noci
function calculateNight() {
  ubijeni = [];
  for (var x of playerHolder.children){
    if (hasStatus(x, "ubij") && hasStatus(x, "zastitiZivotom") && !hasStatus(x, "zastiti")){
      for (var y of playerHolder.children){
        if (y.dataset.role === "13"){
          replaceStatus(y, "alive", "dead");
          ubijeni.push(y.dataset.name);
        }
      }
    }
    else if (hasStatus(x, "ubij") && !hasStatus(x, "zastiti")){
      replaceStatus(x, "alive", "dead");
      ubijeni.push(x.dataset.name);
    }
    else if (burning == true && hasStatus(x, "polij") && hasStatus(x, "alive")) {
      replaceStatus(x, "alive", "dead");
      removeStatus(x, "polij");
      ubijeni.push(x.dataset.name);
    }
  }
}

// vraca na listu igraca
backToManager.addEventListener("click", () => {
  if (actionShowRole){
    actionOnPlayer(playerInfoMenu);
  } else {
    transitionMenu(playerInfoMenu, managerMenu, "grid");
  }
})

// dodaje igraca koji je posetio igraca
function addVisited(visit, visitor) {
  if (!visit) return;
  console.log("role igraca " + visit + " je ")
  console.log("role igraca koji akcija je " + visitor + " " + roles[action.dataset.id].role)
  console.log("-------------------------------")
  for (let x of playerHolder.children) {
    if (x.dataset.role === visitor) {
      x.dataset.visited = visit;
    }
  }
}

// dugme za sekundarnu akciju
secondAction.addEventListener("click", () => {
  switch (action.dataset.purpose) {
    case "polij":
      burning = true;
      break;
    default:
      break;
  }
  wakeUp();
})


// menadzer za akcije
action.addEventListener("click", () => {
  nightMenu.style.display = "none";

  switch (action.dataset.purpose) {
    case "istrazi":
      selectPlayer("actionShowRole");
      break;
    case "zastiti":
      selectPlayer("actionPickPlayer");
      break;
    case "ubij":
      selectPlayer("actionPickPlayer");
      break;
    case "blokiraj":
      selectPlayer("actionPickPlayer");
      break;
    case "kontrolisi":
      selectPlayer("actionControlPlayer");
      break;
    case "polij":
      selectPlayer("actionDousePlayer");
      break;
    case "zastitiZivotom":
      selectPlayer("actionPickPlayer");
      break;
    case "kogaPosetio":
      selectPlayer("actionSeVisited");
      break;
    case "mafijaNapada":
      mafiaAttacksWho();
      break;
    case "wakeUpNext":
      wakeUp()
      transitionMenu(nightMenu, managerMenu, "grid");
      transitionMenu(managerMenu, nightMenu, "block");
      break;
    case "najskorijeUbijen":
      actionMortitian();
      break;
    case "setiSe":
      selectPlayer("actionRemember");
      break;
    case "target":
      selectPlayer("actionPickTarget")
    default:
      wakeUp();
      break;
  }
});


// funkcija za akciju detektiva, saznaje koga ce mafija napasti
function mafiaAttacksWho (){
  transitionMenu(nightMenu, managerMenu, "grid");
  transitionMenu(managerMenu, nightMenu, "block");
  if (posecujeMafija == null || posecujeMafija == undefined){
    wakeUpRole.textContent = "Mafija nikog ne napada ove noći."
  }
  else {
    wakeUpRole.textContent = `Mafija ćе ove noći napasti ${posecujeMafija}`
  }
  action.textContent = "Sledeći"
  action.dataset.purpose = "wakeUpNext";
}

// funkcija za pogrebnika, saznaje ulogu poslednjeg ubijenog igraca
function actionMortitian (){
  transitionMenu(nightMenu, managerMenu, "grid");
  transitionMenu(managerMenu, nightMenu, "block");
  if (playerHolder.dataset.mortitianTarget) {
    let [ime, uloga] = playerHolder.dataset.mortitianTarget.split(" ");
    wakeUpRole.textContent = `Poslednji ubijen igrač ${ime} je bio ${uloga}`;
  } else {
    wakeUpRole.textContent = `Nema mrtvih!`;
  }
  console.log("mortitian")
  action.textContent = "Sledeći"
  action.dataset.purpose = "wakeUpNext";
}

// funkcija koja menadzuje akcije koje igrac moze izvrsiti nad igracima tokom noci, menja funkciju nameplatea
function selectPlayer (whatAction) {
  transitionMenu(nightMenu, managerMenu, "grid");
  switch (whatAction) {
  case "actionPickPlayer":
    actionPickPlayer = true;
    break;
  case "actionShowRole":
    actionShowRole = true;
    break;
  case "actionDousePlayer":
    actionDousePlayer = true;
    break;
  case "actionControlPlayer":
    actionBewitchPlayer = true;
    break;
  case "actionPickTarget":
    actionPickTarget = true;
    actionBewitchPlayer = false;
    break;
  case "actionSeVisited":
    actionSeVisited = true;
    break;
  case "actionRemember":
    actionRememberRole = true;
    break;
  }
  for (let x of playerHolder.children) {
    if (action.dataset.id == x.dataset.role) {
      x.disabled = true;
      x.style.backgroundColor = colorNonSelectable;
    }
    if (whatAction === "actionDousePlayer" && hasStatus(x, "polij") && !hasStatus(x, "dead")){
      x.disabled = true;
      x.style.backgroundColor = colorDoused;
    }
    if (hasStatus(x, "kontrolisi") && action.dataset.id == x.dataset.role){
      console.log("sad kontrolisani")
      for (let y of playerHolder.children) {
        if(!hasStatus(y, "target")) {
          y.disabled = true;
          y.style.backgroundColor = colorNonSelectable;
        }
      }
    }
    if (hasStatus(x, "kontrolisi") && action.dataset.id == 11){
      x.style.backgroundColor = colorBewitched;
      x.disabled = true;
    }
    if(hasStatus(x, "alive") && action.dataset.id == 20){
      x.disabled = true;
      x.style.backgroundColor = colorNonSelectable;
    }
    if(hasStatus(x, "dead") && action.dataset.id == 20){
      x.disabled = false;
      x.style.backgroundColor = colorCard;
    }
  }
};

// funkcija amnezicara, dobija ulogu igraca kojeg je izabrao
function adoptRole(whatRole) {
  transitionMenu(managerMenu, nightMenu, "block");
  actionRememberRole = false;
  for (let x of playerHolder.children) {
    if (x.dataset.role == 20) {
      x.disabled = false;
      x.style.backgroundColor = colorCard;
      x.dataset.role = whatRole;
    }
  }
  console.log(rolePool)
  console.log(sortedRoles)
  action.disabled = true
  wakeUpRole.textContent = "Tvoja nova uloga je " + roles[whatRole].role + " ti si na strani " + roles[whatRole].alignment;
}

// funkcija tragaca za proveru ko je posetio koga
function seeWhoVIsited(visited){
  transitionMenu(nightMenu, managerMenu, "grid");
  transitionMenu(managerMenu, nightMenu, "block");
  if (visited == null || visited == undefined){
    wakeUpRole.textContent = visited.dataset.name + " nije nikog posetio ove noći."
  }
  else {
    wakeUpRole.textContent = visited.dataset.name + ` je posetio ${visited.dataset.visited} ove noći`
  }
  action.textContent = "Sledeći"
  action.dataset.purpose = "wakeUpNext";
  actionSeVisited = false;
}

// nznm ali game logic je
function actionOnPlayer(hideMenu) {
  transitionMenu(hideMenu, nightMenu, "block");
  actionPickPlayer = false;
  actionShowRole = false;
  actionDousePlayer = false;
  for (let x of playerHolder.children) {
    if (hasStatus(x, "polij") && !hasStatus(x, "dead")){
      x.style.backgroundColor = colorCard;
      x.disabled = false;
    }
    if (!hasStatus(x, "kontrolisi")){
      for (let y of playerHolder.children) {
        if(!hasStatus(y, "target") && !hasStatus(y, "dead")) {
          y.style.backgroundColor = colorCard;
          y.disabled = false;
        }
      }
    }
  }
  if(!actionBewitchPlayer){
    wakeUp();
  }
  else {
    progressor -= 1;
    actionBewitchPlayer = false;
    actionPickTarget = true;
    console.log(actionBewitchPlayer, actionPickTarget)
    roleActionCheck();
  }
}

// proverava koja je akcija trenutne uloge i menja funkciju dugmeta action
function roleActionCheck() {
  const roleId = sortedRoles[progressor];
  console.log(sortedRoles)
  console.log("id uloge" + roleId)

  switch (roleId) {
    case 1:
      action.textContent = "Istraži";
      action.dataset.purpose = "istrazi";
      break;
    case 2:
      action.textContent = "Zaštiti";
      action.dataset.purpose = "zastiti";
      break;
    case 4:
      action.textContent = "Ubij";
      action.dataset.purpose = "ubij";
      break;
    case 6:
      action.textContent = "Istraži";
      action.dataset.purpose = "istrazi";
      break;
    case 7:
      action.textContent = "Blokiraj";
      action.dataset.purpose = "blokiraj";
      break;
    case 8:
      action.textContent = "Ubij";
      action.dataset.purpose = "ubij";
      break;
    case 11:
      if(actionPickTarget) {
        action.dataset.purpose = "target";
        action.textContent = "Na koga";
      } else {
        action.textContent = "Kontroliši";
        action.dataset.purpose = "kontrolisi";
      }
      break;
    case 12:
      action.textContent = "Polij";
      action.dataset.purpose = "polij";
      break;
    case 13:
      action.textContent = "Zaštiti životom";
      action.dataset.purpose = "zastitiZivotom";
      break;
    case 14:
      action.textContent = "Istraži";
      action.dataset.purpose = "istrazi";
      break;
    case 15:
      action.textContent = "Koga mafija napada";
      action.dataset.purpose = "mafijaNapada";
      break;
    case 16:
      action.textContent = "Koga je posetio";
      action.dataset.purpose = "kogaPosetio";
      break;
    case 18:
      action.textContent = "Blokiraj";
      action.dataset.purpose = "blokiraj";
      break;
    case 19:
      action.textContent = "Istraži";
      action.dataset.purpose = "najskorijeUbijen";
      break;
    case 20:
      let imaMrtvih = false;
      for (let x of playerHolder.children) {
        if (hasStatus(x, "dead")) {
          imaMrtvih = true;
          break;
        }
      }
      if (imaMrtvih) {
        console.log("seti se");
        action.textContent = "Seti se";
        action.dataset.purpose = "setiSe";
        secondAction.style.display = "block";
        secondAction.textContent = "Preskoči";
      } else {
        console.log("sledeci");
        action.textContent = "Budi sledećeg";
        action.dataset.purpose = "wakeUpNext";
      }
      break;
    default:
      action.textContent = "Budi sledećeg";
      action.dataset.purpose = "nista"
  }
  action.dataset.id = roleId;
}

// funkcija za dodavanej statusa
function addStatus(playerCard, status) {
  let statuses = playerCard.dataset.status ? playerCard.dataset.status.split(" ") : [];
  if (!statuses.includes(status)) {
    statuses.push(status);
    playerCard.dataset.status = statuses.join(" ");
  }
}

function removeStatus(playerCard, status) {
  let statuses = playerCard.dataset.status ? playerCard.dataset.status.split(" ") : [];
  statuses = statuses.filter(s => s !== status);
  playerCard.dataset.status = statuses.join(" ");
}

function replaceStatus(playerCard, oldStatus, newStatus) {
  let statuses = playerCard.dataset.status ? playerCard.dataset.status.split(" ") : [];
  statuses = statuses.map(s => s === oldStatus ? newStatus : s);
  playerCard.dataset.status = statuses.join(" ");
}

function hasStatus(playerCard, status) {
  let statuses = playerCard.dataset.status ? playerCard.dataset.status.split(" ") : [];
  return statuses.includes(status);
}

function transitionMenu(hide, show, type){
  hide.style.display = "none";
  show.style.display = type;
};

function roleOrder() {
  sortedRoles = [...new Set(rolePool.map(Number))]
    .filter(ids => orderOfRoles.includes(ids))
    .sort((a, b) => orderOfRoles.indexOf(a) - orderOfRoles.indexOf(b))

  wakeUp();
}