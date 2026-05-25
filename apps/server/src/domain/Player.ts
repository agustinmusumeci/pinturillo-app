import { randomUUID } from "node:crypto";

export class Player {
  private id: string;
  private name: string;
  private points: number;
  private hasGuessed: boolean;
  private winGames: number;

  constructor(name: string) {
    this.id = randomUUID();
    this.name = name;
    this.points = 0;
    this.hasGuessed = false;
    this.winGames = 0;
  }

  getData(): { id: string; name: string; points: number; hasGuessed: boolean } {
    return { id: this.id, name: this.name, points: this.points, hasGuessed: this.hasGuessed };
  }

  addPoints(points: number) {
    this.points += points;
  }

  setHasGuessed(value: boolean) {
    this.hasGuessed = value;
  }
}
