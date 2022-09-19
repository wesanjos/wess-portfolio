import NavbarLink from '../../atoms/NavbarLink';

export default function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar__container">
        <li>
          <NavbarLink title="Home" id="home" />
        </li>
        <li>
          <NavbarLink title="Sobre mim" id="sobre" />
        </li>
        <li>
          <NavbarLink title="Portfólio" id="portfolio" />
        </li>
      </ul>
    </nav>
  );
}
