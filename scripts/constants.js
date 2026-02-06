export const CONFIG = {
  MAX_PLAYERS: 20,
  MIN_NAME_LENGHT: 2,
  MAX_NAME_LENGTH: 20
}

export const MESSAGES = {
  EMPTY_NAME: "Molimo unesite ime igrača!",
  NAME_EXISTS: (name) => `Igrač ${name} je već dodat u igru. Koristite drugo ime!`,
  NAME_TOO_LONG: (max) => `Ime ne može biti duže od ${max} karaktera!`,
  MAX_PLAYERS_REACHED: (max) => `Dostignut maksimum od ${max} igrača!`
};

export const UI_TEXT = {
  NARRATOR: "Narator",
  REVEAL_INSTRUCTION: "Zapamtite svoju ulogu i kliknite dugme da je sakrijete",
  HIDE_INSTRUCTION: "Predajte uređaj igraču",
  HIDE_INSTRUCTION_LAST: "Predajte uređaj naratoru"
};

export const IMAGES = [
  'paper1.png'
];

export const IMAGE_PATH = 'resourses/plates/'

export const GAME_PHASE = {
  INPUT_PLAYERS: "input players",
  SELECT_ROLES: "select roles",
  REVEAL_ROLES: "reveal roles",
  GAME_STARTED: "game started"
}

export const COLOR = {
  DEAD: "#4B4B4B",
  MAFIA: "#8f3636ff",
  NEUTRAL: "#944fa0ff",
  TOWN: "#4CAF50",
  CARD: "#f9f9f9",
  NON_SELECTABLE: "#000000ff",
  DOUSED: "#636819ff",
  BEWITCHED: "#f1327bff"
}

export const ROLE_REVEAL_TIMER = 2500; //2.5 sekundi

export const PLAYER_ICONS = [
  "silueta1.png",
  "silueta2.png",
  "silueta3.png",
  "silueta4.png",
  "silueta5.png",
  "silueta6.png",
  "silueta7.png",
  "silueta8.png",
  "silueta9.png",
  "silueta10.png",
  "silueta11.png",
  "silueta12.png",
  "silueta13.png",
  "silueta14.png",
  "silueta15.png",
  "silueta16.png",
  "silueta17.png",
  "silueta18.png",
  "silueta19.png",
  "silueta20.png"
]

export const WIN_MESSAGE ={
  TOWN_WINS: "Pobedio je grad!",
  MAFIA_WINS: "Pobedila je mafija!"
}

export const ICON_PATH = "../../resourses/silluetes/";

export const EXECUTIONER_ID = 10;

export const ORDER_OF_ROLES = [20, 11, 18, 7, 1, 14, 6, 19, 17, 2, 13, 4, 15, 8, 12, 16];