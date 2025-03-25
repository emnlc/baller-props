import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className=" text-white pt-16 border-gradient">
      <div className="flex flex-col gap-8 items-center text-center max-w-xl mx-auto mb-24 md:mb-32">
        <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-br from-white to-background-400 text-transparent bg-clip-text">
          Unlock the edge you’ve been missing.
        </h2>
        <span className="text-background-400">
          Say goodbye to hunches. Smarter picks start with better insights.
        </span>

        <Button
          asChild
          size={"lg"}
          className="shadow-buttons bg-black text-background-400 rounded-full"
        >
          <Link to={"/nba"}>Get started</Link>
        </Button>
      </div>

      {/* Content */}
      <div className="flex flex-col-reverse md:flex-row gap-8 md:gap-16 max-w-6xl mx-auto px-4 relative py-12 border-t border-background-800 ">
        <div className="flex flex-col gap-2 flex-1">
          <div className="text-white text-sm">© 2025 Baller Props</div>
          <p className="text-background-400 text-xs">
            Baller Props is a research tool intended for informational purposes
            only and does not facilitate or endorse real-money betting. If you
            or someone you know is experiencing gambling-related issues, please
            seek support by calling 1-800-GAMBLER.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end flex-1">
          <div className="text-white text-sm">Available Sports</div>
          <Link
            className="text-background-400 text-xs mt-4 hover:text-white hover:underline transition-all"
            to={"/nba"}
          >
            NBA
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
