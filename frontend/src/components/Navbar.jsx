import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link className="text-white" to="/">
            Inicio
          </Link>
        </li>
        <li>
          <Link className="text-white" to="/dashboard">
            Dashboard
          </Link>
        </li>
        <li>
          <Link className="text-white" to="/store">
            Tienda
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
