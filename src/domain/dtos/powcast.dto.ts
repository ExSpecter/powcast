export interface IPowcastDto {
  filename: string;
  name: string;
  description: string;
  source: string;
  playtime?: number;

  img?: string;

  created?: number;

  season: number;
  episode: number;

  nextCastId: string;
}
