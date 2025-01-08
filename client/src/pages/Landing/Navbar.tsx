import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="md:container mx-4 md:mx-auto mt-6 md:my-12 flex flex-row justify-between gap-4 items-center">
      <Link className="flex flex-row gap-2 md:gap-4 items-center" to={"/"}>
        <img src="bp-logo.svg" className="h-8 md:h-16" alt="" />
        <span className="font-bold text-xl md:text-3xl hidden md:block">
          Baller Props
        </span>
      </Link>

      <div className="sports-containers flex flex-row h-fit items-center justify-center gap-4 text-base md:text-xl font-semibold">
        <Link to={"/nba"} className="hover:text-accent-500 transition-all">
          NBA
        </Link>
        {/* <span className="text-gray-400 opacity-75 transition-all">WNBA</span>
        <span className="text-gray-400 opacity-75 transition-all">CBB</span> */}
      </div>
    </div>
  );
};

export default Navbar;
