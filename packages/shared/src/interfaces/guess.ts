export interface Guess {
  player: { id: string; name: string };
  word: string;
  timestamp: number;
}
