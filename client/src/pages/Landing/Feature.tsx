import React from "react";

function Feature() {
  return (
    <>
      <section className="bg-black text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
            <div className="flex flex-col justify-center text-center md:text-left">
              <h2 className="text-3xl font-bold mb-4">
                Current Season Player Stats
              </h2>
              <p className="text-lg text-gray-300">
                Quickly view
                <span className="text-bpGreen"> player prop hit rates</span> for
                players based on current season stats.
                <span className="text-bpYellow">
                  Last 10 game and H2H stats
                </span>
                also included.
              </p>
            </div>
            <div className="p-8">
              <img
                src="/baller props 3.JPG"
                alt="Current Season Player Stats"
                className="w-full h-auto"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
            <div className="p-8">
              <img
                src="/baller props 3.JPG"
                alt="Top 50 Player Props"
                className="w-full h-auto"
              />
            </div>
            <div className="flex flex-col justify-center text-center md:text-left">
              <h2 className="text-3xl font-bold mb-4">
                Top 50 Player Props Spreadsheet
              </h2>
              <p className="text-lg text-gray-300">
                Spreadsheet
                <span className="text-bpYellow"> available each day </span>
                containing the
                <span className="text-bpGreen"> top 50 player props</span> based
                on their last 10 game stats.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Feature;
