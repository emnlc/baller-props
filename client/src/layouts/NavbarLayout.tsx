import { Outlet } from "react-router-dom";
// import Navbar from "../pages/Landing/Navbar";
import NavbarNew from "@/components/NavbarNew";

export default function NavbarLayout() {
  return (
    <>
      <NavbarNew />
      <Outlet />
    </>
  );
}
