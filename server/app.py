from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_utilities import repeat_every

from nba.get_games import get_games
from nba.nba_stats import get_player_stats
from nba.player_lines import player_lines

import json
import os
from supabase import create_client

app = FastAPI()

# allowed domains
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STATS_CACHE = {
    "players": {},
    "lines": {}
}

supabase = create_client(os.getenv("PROJECT_URL"), os.getenv("API_KEY"))

@app.on_event("startup")
@repeat_every(seconds=420) # seven minute interval
def cache_player_stats():
    global STATS_CACHE
    print("Fetching stats. . .")
    STATS_CACHE["players"] = get_player_stats(supabase=supabase, current_cache=STATS_CACHE["players"])
    print("Finished caching")
    
@app.on_event("startup")
@repeat_every(seconds=180)
def update_player_lines():
    global STATS_CACHE
    print("Updating player lines. . .")
    STATS_CACHE["lines"] = player_lines()
    print("Finished caching")

@app.get("/api/nba/games")
def todays_games():
    games = get_games()
    return games

@app.get("/api/nba/stats")
def player_stats():
    return STATS_CACHE

@app.get("/api/nba/player-logs/{player_name}/{player_team}")
def get_player_logs(player_name: str, player_team: str):
    res = supabase.table("NBA").select("previous_season_game_logs, current_season_game_logs, id").eq("player_name", player_name).eq("team_tricode", player_team).execute()

    if res.data:
        return {
            "player_id": res.data[0]["id"],
            "current_season_logs": json.loads(res.data[0]["current_season_game_logs"]),
            "previous_season_logs": json.loads(res.data[0]["previous_season_game_logs"]),
        }

##############################
# FOR LOCAL DEVELOPMENT ONLY #
##############################
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8080)