export interface GameLog {
  Points: number;
  Rebounds: number;
  Assists: number;
  "3-PT Made": number;
  "Pts+Rebs": number;
  "Pts+Asts": number;
  "Rebs+Asts": number;
  "Pts+Rebs+Asts": number;
  "Fantasy Score": number;
  "Blocked Shots": number;
  Steals: number;
  "Blks+Stls": number;
  Turnovers: number;
  MATCHUP: string;
  Minutes: string;
  GAME_DATE: string;
  SeasonType: string;
}

export interface Game {
  teams: Record<string, Team>;
  away_team: string;
  home_team: string;
}

interface PropDetail {
  stat_type: string;
  line_score: number;
  odds_type: string;
  start_time: string;

  discount_name: string;
  is_promo: boolean;
  flash_sale_line_score: number;
}

interface PlayerProp {
  prop_id: string;
  details: PropDetail;
}

type PlayerProps = PlayerProp[];

export interface TeamPlayer {
  player_id: number;
  current_season_logs: GameLog[];
  previous_season_logs: GameLog[];
}

export interface Team {
  [key: string]: TeamPlayer;
}

export interface gamesData {
  players: Record<string, Game>;
  lines: Record<string, PlayerProps>;
}
