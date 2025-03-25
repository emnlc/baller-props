import { motion } from "framer-motion";

function Feature() {
  return (
    <>
      <div id="feature-section" className="my-16 flex flex-col gap-8 pt-16">
        <section className="flex flex-col gap-8 md:flex-row ">
          <h1 className="flex-1 text-3xl md:text-5xl font-bold bg-gradient-to-br from-white to-background-400 text-transparent bg-clip-text">
            Stop the Guesswork. Close the Tabs.
          </h1>
          <p className="flex-1 text-lg font-medium text-background-400">
            Decisions don’t have to be complicated. Baller Props gives you
            real-time insights into player performance, hit rates, and game
            trends — all in one place. No more bouncing between ESPN and other
            websites or relying on gut feelings.{" "}
            <span className="text-white">
              Just clear, actionable data to help you make smarter, informed
              picks with ease.
            </span>
          </p>
        </section>

        <section className="flex flex-col md:flex-row mt-16 gap-8">
          <div className="flex-1 flex flex-col justify-between bg-background-900 border border-background-800 rounded-xl p-6 pb-12 md:py-12">
            <div className="my-12 flex flex-row justify-around">
              <motion.img
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                className="w-16 rounded-lg "
                src="sportsbook/prizepicks.png"
                alt=""
              />
              <motion.img
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                className="w-16 rounded-lg black-and-white "
                src="sportsbook/underdog.png"
                alt=""
              />
              <motion.img
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                className="w-16 rounded-lg black-and-white"
                src="sportsbook/draftkings.png"
                alt=""
              />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold bg-gradient-to-br from-white to-background-400 text-transparent bg-clip-text">
                Integrated sportsbook
              </h3>
              <p className="text-background-400">
                Currently, Baller Props integrates PrizePicks lines, with plans
                to support additional sportsbooks in the future.
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col md:flex-row bg-background-900 border border-background-800 rounded-xl px-6 py-12">
            <div className="flex-1 mb-6 md:my-0 flex flex-row justify-around">
              <ol className="relative border-s border-background-500 dark:border-gray-700">
                <li className="mb-10 ms-4">
                  <div className="absolute w-3 h-3 bg-bpGreenRange-200 rounded-full mt-1.5 -start-1.5 border border-background-500 dark:border-gray-900 dark:bg-gray-700"></div>
                  <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                    February 2025
                  </time>
                  <h3 className="text-lg font-semibold ">NBA</h3>
                </li>
                <li className="mb-10 ms-4">
                  <div className="absolute w-3 h-3 bg-bpRedRange-200 rounded-full mt-1.5 -start-1.5 border border-background-500 dark:border-gray-900 dark:bg-gray-700"></div>
                  <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                    ETA: Mid May
                  </time>
                  <h3 className="text-lg font-semibold ">WNBA</h3>
                </li>

                <li className="mb-10 ms-4">
                  <div className="absolute w-3 h-3 bg-bpRedRange-200 rounded-full mt-1.5 -start-1.5 border border-background-500 dark:border-gray-900 dark:bg-gray-700"></div>
                  <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                    ETA: TBA
                  </time>
                  <h3 className="text-lg font-semibold ">MLB</h3>
                </li>
              </ol>
            </div>

            <div className="flex-1 flex flex-col gap-2 justify-center">
              <h3 className="text-lg font-semibold bg-gradient-to-br from-white to-background-400 text-transparent bg-clip-text">
                Supported Sports
              </h3>
              <p className="text-background-400">
                Baller Props is regularly updated to support more sports.
                Currently, NBA is supported, with plans to add WNBA and MLB in
                the near future.
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-5 gap-y-8 md:gap-8">
          <div className="col-span-1 md:col-span-2 flex-1 flex flex-col gap-8 bg-background-900 border border-background-800 rounded-xl p-6 pb-12 md:py-12">
            <div className="flex-1">
              <img
                src="bars.png"
                className="rounded-xl border border-background-800"
                alt=""
              />
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <h1 className="text-lg font-semibold bg-gradient-to-br from-white to-background-400 text-transparent bg-clip-text">
                Historical data
              </h1>
              <p className="text-background-400">
                Leverage past performance and matchup insights to spot winning
                player props.
              </p>
            </div>
          </div>

          <div className="col-span-2 gap-8 flex-1 flex flex-col bg-background-900 border border-background-800 rounded-xl p-6 pb-12 md:py-12">
            <div className="flex-1">
              <img
                src="averages.png"
                className="rounded-2xl border border-background-800"
                alt=""
              />
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <h1 className="text-lg font-semibold bg-gradient-to-br from-white to-background-400 text-transparent bg-clip-text">
                See How the Line Stacks Up
              </h1>
              <p className="text-background-400">
                Compare a player’s prop line against their recent averages to
                see if there's value. Identify trends, over/under differentials,
                and smart opportunities with ease.
              </p>
            </div>
          </div>

          <div className="col-span-1 flex flex-col gap-8">
            <div className="bg-background-900 border border-background-800 rounded-xl flex-1 p-6 flex flex-col justify-center gap-2">
              <h1 className="text-lg font-semibold bg-gradient-to-br from-white to-background-400 text-transparent bg-clip-text">
                Daily Lines
              </h1>
              <p className="text-background-400">
                Player prop lines are updated every ten minutes, ensuring you
                always have the latest data available.
              </p>
            </div>

            <div className="bg-background-900 border border-background-800 rounded-xl flex-1 p-6 flex flex-col justify-center gap-2">
              <h1 className="text-lg font-semibold bg-gradient-to-br from-white to-background-400 text-transparent bg-clip-text">
                Modifier Filters
              </h1>
              <p className="text-background-400">
                Filter lines for goblin and demons or sort based on L5, L10, L15
                games, current season, last season, or H2H stats.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Feature;
