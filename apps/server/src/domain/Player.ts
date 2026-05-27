import { randomUUID } from "node:crypto";

export class Player {
  private id: string;
  private name: string;
  private score: number;
  private hasGuessed: boolean;
  private winGames: number;

  constructor(name: string) {
    this.id = randomUUID();
    this.name = name;
    this.score = 0;
    this.hasGuessed = false;
    this.winGames = 0;
  }

  getData(): { id: string; name: string; score: number; hasGuessed: boolean; winGames: number } {
    return { id: this.id, name: this.name, score: this.score, hasGuessed: this.hasGuessed, winGames: this.winGames };
  }

  addScore(score: number) {
    this.score += score;
  }

  restarScore() {
    this.score = 0;
  }

  setHasGuessed(value: boolean) {
    this.hasGuessed = value;
  }

  addWinGame() {
    this.winGames += 1;
  }
}
