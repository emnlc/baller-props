from nba_api.stats.static import players
from rapidfuzz import process
import unicodedata

_player_cache = None
_player_map = None

def normalize_text(text):
    # Normalize text to remove accents
    return unicodedata.normalize('NFKD', text).encode('ASCII', 'ignore').decode('utf-8').lower()

def get_player_id(player_name, threshold=80):
    global _player_cache, _player_map
    
    # Initialize cache 
    if _player_cache is None or _player_map is None:
        print("saving player cache...")
        _player_cache = players.get_active_players()
        _player_map = {
            normalize_text(player["full_name"]): player["id"]
            for player in _player_cache
        }
    
    # Normalize the input player name
    normalized_name = normalize_text(player_name)
    
    # Use fuzzy matching to find the best match
    player_names = list(_player_map.keys())
    match = process.extractOne(normalized_name, player_names, score_cutoff=threshold)
    
    if match:
        # Return the player ID of the best match
        matched_name = match[0]
        return _player_map[matched_name]
    else:
        return None

