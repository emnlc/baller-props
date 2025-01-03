from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_utilities import repeat_every

from nba.get_games import get_games
from nba.nba_stats import get_player_stats
from nba.player_lines import player_lines

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

@app.on_event("startup")
@repeat_every(seconds=300) # every ten minutes
def cache_player_stats():
    global STATS_CACHE
    print("Fetching stats. . .")
    STATS_CACHE["players"] = get_player_stats()
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

@app.get("/api/nba/player-logs/{player_name}/{player_team}/{game_key}")
def get_player_logs(player_name: str, player_team: str, game_key: str):
    # Fetch the player data from the cache
    player_data = STATS_CACHE["players"][game_key]["teams"][player_team][player_name]
    
    current_season_logs = player_data.get("current_season_logs", [])
    previous_season_logs = player_data.get("previous_season_logs", [])
    player_id = player_data.get("player_id", -1)

    return {
        "player_id": player_id,
        "current_season_logs": current_season_logs,
        "previous_season_logs": previous_season_logs
    }
    
##############################
# FOR LOCAL DEVELOPMENT ONLY #
##############################
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)