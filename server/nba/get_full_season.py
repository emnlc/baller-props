from nba_api.stats.endpoints import playergamelogs
from datetime import datetime

# get a seasons full game_logs
def process_game_logs(player_id, season):
    try:
        game_logs = playergamelogs.PlayerGameLogs(player_id_nullable=player_id, season_nullable=season)
        game_logs_df = game_logs.get_data_frames()[0]
    except Exception as e:
        print(f"Error fetching game logs for player {player_id}: {e}")
        return []
    
    if game_logs_df.empty:
        print(f"No game data available for player {player_id} in season {season}.")
        return []

    # Extract game stats in reverse order
    full_game_logs = []
    for _, row in game_logs_df[::-1].iterrows():
        current_game = {
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
            "Pts+Asts":int(row["PTS"]) + int(row["AST"]),
            "Rebs+Asts": int(row["REB"]) + int(row["AST"]),
            "Pts+Rebs+Asts": int(row["PTS"]) + int(row["REB"]) + int(row["AST"]),
            "Fantasy Score": float(row["NBA_FANTASY_PTS"]),
            "Blocked Shots": int(row["BLK"]),
            "Steals": int(row["STL"]),
            "Blks+Stls": int(row["STL"]) + int(row["BLK"]),
            "Turnovers": int(row["TOV"]),
            "Free Throws Made": int(row["FTM"]),
            
            "MATCHUP": row["MATCHUP"]
        }
        full_game_logs.append(current_game)

    
    # Output result
    return full_game_logs

# Fetch game logs
def get_full_season(player_id):
    # current_year = datetime.now().year
    # next_year = current_year + 1
    # season = f"{current_year}-{str(next_year)[-2:]}"
    # previous_season = f"{current_year-1}-{str(current_year)[-2:]}"
    
    season = "2024-25"
    previous_season = "2023-24"
    
    previous_season_game_logs = process_game_logs(player_id=player_id, season=previous_season)
    current_season_game_logs = process_game_logs(player_id=player_id, season=season)
    
    # Output result
    return (previous_season_game_logs, current_season_game_logs)