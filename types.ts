export enum GamePhase {
  SETUP = 'SETUP',
  PEEK = 'PEEK',
  PLAYING = 'PLAYING',
  REVEAL = 'REVEAL'
}

export interface Player {
  id: string;
  name: string;
  isTraitor: boolean;
}

export interface Word {
  term: string;
  definition: string;
}

export interface Category {
  id: string;
  name: string;
  icon: any;
  words: Word[];
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentPeekIndex: number;
  secretWord: Word;
  selectedCategoryIds: string[];
}