import React, { useState } from "react";

function Stats() {
  const [selectedPlayer, setSelectedPlayer] = useState("Anthony Davis");
  const [stats, setStats] = useState({
    pts: 29,
    reb: 11.5,
    ast: 2.5,
    pra: 43.5,
  });

  const players = [
    {
      name: "Anthony Davis",
      stats: { pts: 29, reb: 11.5, ast: 2.5, pra: 43.5 },
    },
    { name: "LeBron James", stats: { pts: 25, reb: 8.0, ast: 7.5, pra: 40.5 } },
    {
      name: "Austin Reaves",
      stats: { pts: 15, reb: 5.0, ast: 4.5, pra: 24.5 },
    },
    {
      name: "D'Angelo Russell",
      stats: { pts: 18, reb: 3.0, ast: 6.0, pra: 27.0 },
    },
    {
      name: "Rui Hachimura",
      stats: { pts: 12, reb: 4.0, ast: 1.0, pra: 17.0 },
    },
  ];

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player.name);
    setStats(player.stats);
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">
          Los Angeles Lakers @ Phoenix Suns
        </h1>
      </div>

      <div className="bg-neutral-950">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center space-x-4 overflow-x-auto">
          <div className="w-16 h-16 bg-yellow-400 flex items-center justify-center font-bold">
            LOGO
          </div>

          <div className="flex space-x-4">
            {players.map((player) => (
              <div
                key={player.name}
                className="w-12 h-12 bg-gray-700 cursor-pointer flex items-center justify-center"
                onClick={() => handlePlayerClick(player)}
              >
                <span className="text-sm">{player.name[0]}</span>
              </div>
            ))}
          </div>

          <div className="ml-auto font-bold">Player Props</div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="text-xl font-bold bg-neutral-800 px-4 py-2 rounded">
            {selectedPlayer}
          </div>
          <div className="flex space-x-4">
            <button className="bg-yellow-400 text-black px-3 py-1 rounded font-bold hover:bg-yellow-500">
              {stats.pts} PTS
            </button>
            <button className="bg-neutral-700 px-3 py-1 rounded hover:bg-neutral-600">
              {stats.reb} REB
            </button>
            <button className="bg-neutral-700 px-3 py-1 rounded hover:bg-neutral-600">
              {stats.ast} AST
            </button>
            <button className="bg-neutral-700 px-3 py-1 rounded hover:bg-neutral-600">
              {stats.pra} PRA
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-purple-700 p-8 flex items-center justify-center">
            <h3 className="text-2xl font-bold">BAR CHART</h3>
          </div>

          <div className="bg-neutral-900 p-8">
            <div className="mb-4 text-gray-400">Season</div>
            <div className="mb-4 text-gray-400">Last 10</div>
            <div className="mb-4 text-gray-400">Last 5</div>
            <div className="mb-4 text-gray-400">Last 1</div>
            <div className="mb-4 text-gray-400">H2H</div>
            <h3 className="text-2xl font-bold text-center mt-8">STATS</h3>
          </div>
        </div>
        <div className="flex space-x-4 mt-4">
          <button className="bg-yellow-400 text-black font-bold px-4 py-2 rounded">
            L10
          </button>
          <button className="bg-neutral-700 px-4 py-2 rounded hover:bg-neutral-600">
            L5
          </button>
          <button className="bg-neutral-700 px-4 py-2 rounded hover:bg-neutral-600">
            SZN
          </button>
          <button className="bg-neutral-700 px-4 py-2 rounded hover:bg-neutral-600">
            H2H
          </button>
        </div>
      </div>

      <div className="bg-neutral-950 py-2 px-4">
        <div className="max-w-6xl mx-auto flex justify-end">
          <span className="font-bold">Player Props</span>
        </div>
      </div>
    </div>
  );
}

export default Stats;
