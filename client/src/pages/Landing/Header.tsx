import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header
      className="relative h-screen bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center md:items-start md:justify-start text-center md:text-left"
      style={{ backgroundImage: `url('/Lebron.JPG')` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <div className="relative z-50 px-4 md:pl-56 md:pt-80">
        <h1 className="text-3xl md:text-6xl font-bold mb-4 text-white">
          View, <span className="text-bpYellow">Analyze</span>, Bet.
          <span className="block mt-4 leading-loose">
            Stay Ahead with <span className="text-green-400">Baller Props</span>
            .
          </span>
        </h1>

        <Link to="/nba">
          <button className="mt-3 px-8 md:px-12 py-3 bg-bpRed rounded-2xl hover:bg-red-600 text-lg md:text-xl text-white transition-colors">
            Get Started
          </button>
        </Link>
      </div>
    </header>
  );
}

export default Header;
