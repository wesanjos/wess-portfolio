import { useState } from 'react';
import NavbarLink from '../../atoms/NavbarLink';

export default function Navbar() {
  const [menuMobile, setMenuMobile] = useState(false);

  const handleMenuMobile = (event) => {
    event.preventDefault();
    setMenuMobile(!menuMobile);
  };

  return (
    <nav className={`navbar ${menuMobile ? 'active' : ''}`}>
      <ul className="navbar__container">
        <li>
          <NavbarLink title="Home" />
        </li>
        <li>
          <NavbarLink title="Sobre mim" />
        </li>
        <li>
          <NavbarLink title="Portfólio" />
        </li>
        <li>
          <NavbarLink title="Contato" />
        </li>
      </ul>
    </nav>
  );
}
