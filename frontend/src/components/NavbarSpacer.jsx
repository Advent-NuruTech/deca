// components/NavbarSpacer.jsx
import React, { useEffect, useState } from "react";

const NavbarSpacer = () => {
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const navbar = document.querySelector("nav"); // Adjust selector to match your navbar
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
  }, []);

  return <div style={{ height: navbarHeight }} />;
};

export default NavbarSpacer;
