export const CONFIG = {
  MAX_PLAYERS: 20,
  MIN_NAME_LENGHT: 2,
  MAX_NAME_LENGTH: 20
}

export const ROLE_IDS = {
  DETEKTIV: 1,
  DOKTOR: 2,
  SELJAK: 3,
  MAFIJAS: 4,
  KUM: 5,
  SAVETNIK: 6,
  PRATILAC: 7,
  SERIJSKI_UBICA: 8,
  LUDAK: 9,
  DZELAT: 10,
  VESTICA: 11,
  PIROMAN: 12,
  TELOHRANITELJ: 13,
  SERIF: 14,
  SPIJUN: 15,
  TRAGAC: 16,
  MEDIUM: 17,
  ESKORT: 18,
  POGREBNIK: 19,
  AMNEZICAR: 20
}

export const MESSAGES = {
  EMPTY_NAME: "Molimo unesite ime igrača!",
  NAME_EXISTS: (name) => `Igrač ${name} je već dodat u igru. Koristite drugo ime!`,
  NAME_TOO_LONG: (max) => `Ime ne može biti duže od ${max} karaktera!`,
  MAX_PLAYERS_REACHED: (max) => `Dostignut maksimum od ${max} igrača!`
};

export const LYNCH_MESSAGE = {
  NO_VOTES: "Niko nije glasao, glasanje se preskače.",
  LYNCHED: (name, votes) => `Sa ukupno ${votes} glasova, izlasan je igrač ${name}.`,
  TIE: (votes, names, last) => `Niko nije izglasan, ukupno ${votes} glasova imaju ${names} i ${last}.`,
  JESTER: (votes, name) => `Sa ukupno ${votes} glasova, izlasan je igrač ${name}. \n Igrač ${name} je bio ludak, ludak je pobedio!`,
  EXECUTIONER: (votes, name, executioner) => `Sa ukupno ${votes} glasova, izlasan je igrač ${name}. \n Igrač ${name} je bio meta dželata ${executioner}, dželat je pobedio!`,
}

export const WIN_MESSAGE = {
  TOWN_WIN: `Pobedio je grad!`,
  MAFIA_WIN: `Mafija je pobedila!`
}

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
export const DISCUSSION_TIMER = 300; // 5 minuta

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

export const ICON_PATH = "../../resourses/silluetes/";
export const DEAD_ICON_PATH = "../../resourses/silluetes/dead.png";

export const ORDER_OF_ROLES = [20, 11, 18, 7, 1, 14, 6, 19, 17, 2, 13, 4, 15, 8, 12, 16];