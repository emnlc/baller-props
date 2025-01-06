import { Outlet } from "react-router-dom";
import Navbar from "../pages/Landing/Navbar";

export default function NavbarLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
