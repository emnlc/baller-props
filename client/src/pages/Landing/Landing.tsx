// import Header from "./Header";
import Feature from "./Feature";
import Footer from "./Footer";

import Hero from "./Hero";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Landing = () => {
  return (
    <>
      {/* Background Container */}
      <div className="relative w-full max-h-screen ">
        {/* Gradient Overlay */}
        <div className=" gradient-overlay "></div>

        {/* Content Wrapper */}
        <div className="relative z-10 mx-4 md:container md:mx-auto flex flex-col items-center">
          {/* Navbar */}
          <nav className="w-full flex flex-row items-center justify-between my-4 sm:my-6">
            <Link to={"/"} className="text-xl font-bold sm:block">
              Baller Props
            </Link>
            <div className="flex flex-row items-center text-sm gap-4 md:gap-8">
              <Link
                className="font-medium text-background-400 hover:text-white transition-all"
                to={"/login"}
              >
                Login
              </Link>
              <Button
                asChild
                size={"sm"}
                className="shadow-buttons bg-black text-background-400 rounded-full px-4"
              >
                <Link to={"/signup"}>Get started</Link>
              </Button>
            </div>
          </nav>

          {/* Hero Section */}
          <div className="max-w-7xl">
            <Hero />
            <Feature />
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default Landing;
