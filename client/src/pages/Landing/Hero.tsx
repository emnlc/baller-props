import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

import { useState } from "react";

import { motion } from "framer-motion";

import useWindowSize from "@/hooks/isMobile";

const Hero = () => {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useWindowSize();

  return (
    <>
      <div className="flex mt-32 flex-col justify-center items-center text-center gap-10">
        <motion.h1
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1 },
          }}
          initial="hidden"
          animate="visible"
          transition={{
            type: "tween",
            duration: 0.6,
            ease: "easeOut",
          }}
          className="text-4xl md:text-6xl max-w-3xl font-bold bg-gradient-to-br from-white to-background-400 text-transparent bg-clip-text"
        >
          Elevate Your Plays with Better Picks.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.6,
            duration: 0.65,
            ease: "easeOut",
          }}
        >
          <h3 className="text-lg md:text-2xl font-medium max-w-3xl mx-auto text-background-400">
            Tired of tab chaos? Get all the data you need to make smarter picks
            — fast, easy, and hassle-free.
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.6,
            duration: 0.65,
            ease: "easeOut",
          }}
        >
          <Button
            asChild
            size={"lg"}
            className="shadow-buttons bg-black text-background-400 rounded-full"
          >
            <Link to={"/signup"}>Get started</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1,
            duration: 0.65,
            ease: "easeOut",
          }}
        >
          <motion.button
            className="text-background-400 hover:text-white transition-colors flex flex-col items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => {
              const featuresElement =
                document.getElementById("feature-section");
              featuresElement?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Learn more
            <motion.span
              animate={isHovered ? { y: 6 } : { y: 0 }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            >
              <FontAwesomeIcon icon={faArrowDown} />
            </motion.span>
          </motion.button>
        </motion.div>

        {isMobile ? (
          <motion.img
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1,
              duration: 0.65,
              ease: "easeOut",
            }}
            src="hero-mobile.png"
            className=""
            alt=""
          />
        ) : (
          <motion.img
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1,
              duration: 0.65,
              ease: "easeOut",
            }}
            src="hero.png"
            className=""
            alt=""
          />
        )}
      </div>
    </>
  );
};

export default Hero;
