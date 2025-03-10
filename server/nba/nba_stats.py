import time
import random
import requests
import time
from datetime import datetime
import pytz

from collections import defaultdict
from dotenv import load_dotenv
import os

from .get_player_id import get_player_id
from .get_games import get_games
from .get_full_season import get_full_season
from .get_missing_games import get_missing_games

from supabase import Client
import json
load_dotenv()
API_URL = os.getenv("API_URL")

def format_stats(d):
    if isinstance(d, defaultdict):
        return {k: format_stats(v) for k, v in d.items()}
    return d

# games updated at 10am MST 12pm EST
def get_player_stats(supabase: Client, current_cache):
    delay = random.uniform(0.25, 0.5)
    games = get_games()
    data = None
    res = requests.get(API_URL)
    if res.status_code == 200:
        data = res.json()
    else:
        print(f"Failed to get data: {res.status_code}")
        data = None

    todays_stats = defaultdict(lambda: defaultdict(lambda: defaultdict(dict)))
    for date in games:
        for game in games[date]:
            game_title = game["game_key"]
            if game_title in data:
                for team in data[game_title]:   
                    player_stats = defaultdict(lambda: defaultdict(lambda: {"lines": {}, "player_id": None}))             
                    players = data[game_title][team]
                    for player in players:
                        # print(f"checking: {player}")
                        
                        # CHECK IF PLAYER IS IN DATABASE
                        res = supabase.table("NBA").select("id").eq("player_name", player).execute()
                        
                        # IF PLAYER HAS EXISTING DATA
                        if len(res.data) > 0:
                            player_data = res.data[0]
                            player_id = player_data.get("id")
                            
                            # UPDATE PLAYER GAME LOG IF NEEDED
                            updated = get_missing_games(supabase=supabase, player_id=player_id, team=team)
                            
                            # SKIP IF ALREADY IN CACHE AND NOT UPDATED
                            if not updated and player in current_cache.get(game_title, {}).get("teams", {}).get(team, {}):
                                player_stats[player] = current_cache[game_title]["teams"][team][player]
                                continue
                            
                            # GET PLAYER DATA FROM DATABASE
                            res = supabase.table("NBA").select("current_season_game_logs, previous_season_game_logs").eq("id", player_id).execute()

                            # ADD PLAYER DATA TO player_stats CACHE
                            if res.data:
                                current_season_logs = res.data[0]["current_season_game_logs"]
                                previous_season_logs = res.data[0]["previous_season_game_logs"]
                                player_stats[player]["player_id"] = player_id
                                player_stats[player]["current_season_logs"] = json.loads(current_season_logs)
                                player_stats[player]["previous_season_logs"] = json.loads(previous_season_logs)
                                
                            # go to next player after getting data from database
                            continue 
                        
                        time.sleep(delay)
                        player_id = get_player_id(player_name=str(player), threshold=80)
                        if player_id == None:
                            print(f"{player} has no ID")
                            continue # skip current player
                        
                        time.sleep(delay)
                        # GET PLAYER GAME LOGS
                        previous_season_logs, current_season_logs = get_full_season(player_id=player_id)
                        if not previous_season_logs and not current_season_logs:
                            continue # skip player
                        
                        pst_timezone = pytz.timezone("US/Pacific")
                        # insert game logs into NBA table
                        supabase.table("NBA").insert(
                            {
                                "id": player_id,
                                "player_name": player,
                                "team_tricode": team,
                                "current_season_game_logs": json.dumps(current_season_logs),
                                "previous_season_game_logs": json.dumps(previous_season_logs),
                                "last_updated": datetime.now(pst_timezone).strftime("%Y-%m-%d")
                            }
                        ).execute()
                        
                        # Store in local cache
                        player_stats[player]["player_id"] = player_id
                        player_stats[player]["current_season_logs"] = current_season_logs
                        player_stats[player]["previous_season_logs"] = previous_season_logs
                        
                    todays_stats[game_title]["teams"][team] = player_stats
                    todays_stats[game_title]["home_team"] = game["home_tricode"]
                    todays_stats[game_title]["away_team"] = game["away_tricode"]
                    
    return todays_stats