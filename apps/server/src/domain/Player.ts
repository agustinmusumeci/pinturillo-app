import { randomUUID } from "node:crypto";

export class Player {
  private id: string;
  private name: string;
  private score: number;
  private winGames: number;

  constructor(name: string) {
    this.id = randomUUID();
    this.name = name;
    this.score = 0;
    this.winGames = 0;
  }
}
