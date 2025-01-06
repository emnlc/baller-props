import time
import random
import requests

from collections import defaultdict
from dotenv import load_dotenv
import os

from .get_player_id import get_player_id
from .get_games import get_games
from .get_full_season import get_full_season

load_dotenv()
API_URL = os.getenv("API_URL")

def format_stats(d):
    if isinstance(d, defaultdict):
        return {k: format_stats(v) for k, v in d.items()}
    return d

# games updated at 10am MST 12pm EST
def get_player_stats():
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
                    # print(f"Looking at players for {team}")
                    for player in players:
                        time.sleep(delay)
                        player_id = get_player_id(player_name=str(player), threshold=80)

                        if player_id == None:
                            # print(f"No ID for: {str(player)}")
                            continue # skip current player
                        
                        time.sleep(delay)
                        previous_season_logs, current_season_logs = get_full_season(player_id=player_id)
                        if not previous_season_logs and not current_season_logs:
                            continue # skip player
                        
                        player_stats[player]["player_id"] = player_id
                        player_stats[player]["current_season_logs"] = current_season_logs
                        player_stats[player]["previous_season_logs"] = previous_season_logs
                        
                        # print(f"Logs for {player} obtained.")

                    todays_stats[game_title]["teams"][team] = player_stats
                    todays_stats[game_title]["home_team"] = game["home_tricode"]
                    todays_stats[game_title]["away_team"] = game["away_tricode"]

                    print(f"done with {team}")
    return todays_stats

    ####################################
    # CODE FOR OUTPUTTING TO JSON FILE #
    ####################################
    # output_file = "todays_stats_1.json"

    # with open(output_file, "w") as file:
    #     json.dump(todays_stats, file, indent=4)