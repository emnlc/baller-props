import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
  faHome,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const NavbarNew = () => {
  // State to manage the navbar's visibility
  const [nav, setNav] = useState(false);

  // Toggle function to handle the navbar's display
  const handleNav = () => {
    setNav(!nav);
  };

  // Array containing navigation items
  const navItems = [{ id: 1, text: "NBA", url: "/nba" }];

  return (
    <div className="md:container mx-4 md:mx-auto my-4 sm:my-6 flex flex-row justify-between gap-4 items-center z-50 ">
      {/* Logo */}
      <Link
        to={"/"}
        className="text-xl font-bold text-white hidden sm:block hover:text-accent-500 transition-colors"
      >
        Baller Props
      </Link>
      <Link to={"/"}>
        <img src="bp-logo.svg" className="h-8 ml-2 sm:hidden" alt="" />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-4 font-semibold">
        {navItems.map((item) => (
          <Button
            key={item.id}
            className="px-6 rounded-lg transition-all hover:bg-accent-500 "
            onClick={handleNav}
            size={"sm"}
            asChild
          >
            <Link to={item.url}>{item.text}</Link>
          </Button>
        ))}

        <Link className="flex" to={"/account"}>
          <FontAwesomeIcon
            className="text-3xl transition-colors hover:text-accent-500"
            icon={faCircleUser}
          />
        </Link>
      </div>

      {/* Mobile Navigation Icon */}
      <div onClick={handleNav} className="block md:hidden">
        {nav ? (
          <FontAwesomeIcon className="text-2xl mr-2" icon={faXmark} />
        ) : (
          <FontAwesomeIcon className="text-2xl mr-2" icon={faBars} />
        )}
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={
          nav
            ? "fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500 flex flex-col justify-between z-50 "
            : "ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%] z-50 flex flex-col justify-between "
        }
      >
        {/* Mobile Logo */}
        <div>
          <h1 className="w-full text-2xl font-bold text-white m-4">
            Baller Props
          </h1>

          {/* Mobile Navigation Items */}

          {navItems.map((item) => (
            <div
              key={item.id}
              className="border-b w-full flex duration-300 hover:text-black cursor-pointer border-gray-600"
            >
              <Link
                className="w-full p-4 hover:bg-accent-500 "
                onClick={handleNav}
                to={item.url}
              >
                {item.text}
              </Link>
            </div>
          ))}
        </div>

        <div className="pb-4 px-4 flex flex-row items-center gap-4">
          <Link to={"/"}>
            <FontAwesomeIcon className="text-2xl" icon={faHome} />
          </Link>

          <Link to={"/account"}>
            <FontAwesomeIcon className="text-2xl" icon={faCircleUser} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavbarNew;
