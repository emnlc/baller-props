# RYAN DUNN 1642346
from datetime import datetime
import pytz
from nba_api.stats.endpoints import PlayerGameLogs
from supabase import Client
import json

def get_missing_game_logs(player_id):
    season_types = ["Playoffs", "Regular Season", "Pre Season"]
    game_logs = []
    
    for season_type in season_types:
        try:
            game_logs_df = PlayerGameLogs(
                player_id_nullable=player_id, 
                season_nullable="2024-25",
                season_type_nullable=season_type,
            ).get_data_frames()[0]
            
            if not game_logs_df.empty:
                for _, row in game_logs_df[::-1].iterrows():
                    current_game = {
                        "Minutes": int(row["MIN"]),
                        "Points": int(row["PTS"]),
                        "FG Made": int(row["FGM"]),
                        "FG Attempted": int(row["FGA"]),
                        "Offensive Rebounds": int(row["OREB"]),
                        "Defensive Rebounds": int(row["DREB"]),
                        "Rebounds": int(row["REB"]),
                        "Assists": int(row["AST"]),
                        "3-PT Made": int(row["FG3M"]),
                        "3-PT Attempted": int(row["FG3A"]),
                        "Pts+Rebs": int(row["PTS"]) + int(row["REB"]),
                        "Pts+Asts": int(row["PTS"]) + int(row["AST"]),
                        "Rebs+Asts": int(row["REB"]) + int(row["AST"]),
                        "Pts+Rebs+Asts": int(row["PTS"]) + int(row["REB"]) + int(row["AST"]),
                        "Fantasy Score": float(row["NBA_FANTASY_PTS"]),
                        "Blocked Shots": int(row["BLK"]),
                        "Steals": int(row["STL"]),
                        "Blks+Stls": int(row["STL"]) + int(row["BLK"]),
                        "Turnovers": int(row["TOV"]),
                        "Free Throws Made": int(row["FTM"]),
                        "MATCHUP": row["MATCHUP"],
                        "GAME_DATE": row["GAME_DATE"],
                        "SeasonType": season_type
                    }
                    game_logs.append(current_game)
                
        except Exception as e:
            print(f"Error fetching logs for {player_id} during {season_type}: {e}")
            return
            
    return game_logs
print(
    get_missing_game_logs(1642346)
)