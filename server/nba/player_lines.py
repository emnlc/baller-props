import time
import random
import requests
import os

from collections import defaultdict
from dotenv import load_dotenv

load_dotenv()
API_URL = os.getenv("API_URL")

def player_lines():
    data = None
    res = requests.get(API_URL)
    if res.status_code == 200:
        data = res.json()
    else:
        print(f"Failed to get data: {res.status_code}")
        data = None
        
    lines = {}
    for game in data:
        for team in data[game]:
            for player in data[game][team]:
                lines[player] = data[game][team][player]["props"] 
    
    return lines
    