import useWindowSize from "@/hooks/isMobile";

function Feature() {
  const isMobile = useWindowSize();
  return (
    <>
      <section className=" text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
            <div className="flex flex-col justify-center text-center md:text-left">
              <h2 className="text-3xl font-bold mb-4">
                Current Season Player Stats
              </h2>
              <p className="text-lg text-gray-300">
                Quickly view
                <span className="text-bpGreen"> player prop hit rates</span> for
                players based on current season stats.{" "}
                <span className="text-bpYellow">
                  Last 10 game and H2H stats
                </span>{" "}
                also included.
              </p>
            </div>
            <div className="md:px-4 ">
              <img
                src={`${
                  isMobile
                    ? "/LandingAssets/MobileView.png"
                    : "/LandingAssets/DesktopView2.png"
                }`}
                alt="Current Season Player Stats"
                className="w-full"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-16 items-center mb-16">
            <div className="flex flex-col justify-center text-center md:text-left">
              <h2 className="text-3xl font-bold mb-4">Daily Props</h2>
              <p className="text-lg text-gray-300">
                Player props obtained through{" "}
                <span className="text-[#8000FF]">PrizePicks</span> and update
                regularly throught the day.
              </p>
            </div>
            <div className="flex flex-col justify-center text-center md:text-left">
              <h2 className="text-3xl font-bold mb-4">Historical Data</h2>
              <p className="text-lg text-gray-300">
                Historical data from the{" "}
                <span className="text-bpYellow">last two seasons</span> for{" "}
                <span className="text-bpGreen">each individual player</span>{" "}
                corresponding to the selected player prop.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Feature;
