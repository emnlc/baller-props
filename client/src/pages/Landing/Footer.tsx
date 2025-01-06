import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-background-950 text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-end items-center md:items-center ">
          <div className="font-bold md:text-right">Available Sports</div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4 ">
          <div className="flex justify-center">
            <span></span>
            <span></span>
          </div>

          <div className="flex ">
            <Link
              className="transition-all text-white hover:text-accent-500"
              to={"/nba"}
            >
              <span>NBA</span>
            </Link>
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
