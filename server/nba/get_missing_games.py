from datetime import datetime
import pytz
from nba_api.stats.endpoints import PlayerGameLogs
from supabase import Client
import json

def get_missing_game_logs(player_id, date_from):
    season_types = ["Playoffs", "Regular Season", "Pre Season"]
    game_logs = []
    
    for season_type in season_types:
        try:
            game_logs_df = PlayerGameLogs(
                player_id_nullable=player_id, 
                season_nullable="2024-25",
                season_type_nullable=season_type,
                date_from_nullable=date_from
            ).get_data_frames()[0]
            
            if not game_logs_df.empty:
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
            
    return game_logs


def get_missing_games(supabase: Client, player_id, team):
    updated = False

    # Fetch the current game logs and last updated date from Supabase
    res = supabase.table("NBA").select("current_season_game_logs, last_updated").eq("id", player_id).execute()
    if not res.data:
        print(f"No data found for player ID {player_id}")
        return updated

    last_updated_str = res.data[0]["last_updated"]
    last_updated = datetime.strptime(last_updated_str, "%Y-%m-%d").date()
    
    pst_timezone = pytz.timezone('US/Pacific')
    current_date = datetime.now(pst_timezone).date()
    
    if last_updated >= current_date:
        print(f"{player_id} already updated")
        return updated
    
    date_from = last_updated.strftime("%m/%d/%Y")
    missing_game_logs = get_missing_game_logs(player_id, date_from=date_from)
    
    if missing_game_logs:
        supabase_game_log_text = res.data[0]["current_season_game_logs"]
        supabase_game_logs = json.loads(supabase_game_log_text)
        
        # Check if the last game log in Supabase matches the first new game log
        if supabase_game_logs and supabase_game_logs[-1]["GAME_DATE"] != missing_game_logs[0]["GAME_DATE"]:
            updated = True
            # Extend the list of games
            supabase_game_logs.extend(missing_game_logs)
            updated_logs = json.dumps(supabase_game_logs)
            
            # Update the Supabase table
            try:
                supabase.table("NBA").update({
                    "current_season_game_logs": updated_logs,
                    "last_updated": current_date.isoformat(),
                    "team_tricode": team
                }).eq("id", player_id).execute()
                print(f"Successfully updated player ID {player_id}")
            except Exception as e:
                print(f"Error updating player ID {player_id}: {e}")
    
    # Update the Supabase table
    try:
        supabase.table("NBA").update({
            "last_updated": current_date.isoformat()
        }).eq("id", player_id).execute()
        print(f"Successfully updated player ID {player_id}")
    except Exception as e:
        print(f"Error updating player ID {player_id}: {e}")
    
    return updated