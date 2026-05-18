import { Guess } from "./Guess";
import { Player } from "./Player";
import { Trace } from "./Trace";
import { randomUUID } from "node:crypto";


export class Game {
  private id: string;
  private players: Player[];
  private pendingPlayers: Player[];
  private currentDrawer: Player;
  private drawTime: number;
  private currentWord: string;
  private optionWords: string[];
  private words: string[];
  private selectedWords: string[];
  private currentRound: number;
  private totalRounds: number;
  private hasDrawnPlayers: Player[];
  private board: Trace[];
  private guesses: Guess[];

  constructor(
    players: Player[],
    pendingPlayers: Player[] = [],
    currentDrawer: Player,
    drawTime: number,
    currentWord: string,
    optionWords: string[],
    selectedWords: string[],
    currentRound: number,
    totalRounds: number,
    hasDrawnPlayers: Player[],
    board: Trace[],
    guesses: Guess[],
  ) {
    this.id = randomUUID();
    this.players = players;
    this.pendingPlayers = pendingPlayers;
    this.currentDrawer = currentDrawer;
    this.drawTime = drawTime;
    this.currentWord = currentWord;
    this.words = [];
    this.optionWords = [];
    this.selectedWords = [];
    this.currentRound = 1;
    this.totalRounds = totalRounds;
    this.hasDrawnPlayers = [];
    this.board = [];
    this.guesses = [];
  }
}
