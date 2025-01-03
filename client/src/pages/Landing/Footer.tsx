import React from "react";

function Footer() {
  return (
    <footer className="bg-neutral-950 text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-end items-center md:items-center px-8">
          <div className="font-bold text-center md:text-right">
            Available Sports
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4 space-y-4 md:space-y-0">
          <div className="flex space-x-4 justify-center">
            <span></span>
            <span></span>
          </div>

          <div className="flex space-x-4 justify-center">
            <span>NBA</span>
            <span>NFL</span>
            <span>MLB</span>
            <span>WNBA</span>
          </div>
        </div>

        <div className="flex justify-center items-center mt-4">
          <div className="text-gray-400 text-sm">© 2024 Baller Props</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
