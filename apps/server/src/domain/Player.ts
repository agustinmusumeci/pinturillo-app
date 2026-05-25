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

  getData(): { id: string; name: string; score: number; hasGuessed: boolean } {
    return { id: this.id, name: this.name, score: this.score, hasGuessed: this.hasGuessed };
  }

  addScore(score: number) {
    this.score += score;
  }

  setHasGuessed(value: boolean) {
    this.hasGuessed = value;
  }
}
