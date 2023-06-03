import NavbarLink from '../../atoms/NavbarLink';

export default function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar__container">
        <li>
          <NavbarLink title="Home" id="home" />
        </li>
        <li>
          <NavbarLink title="Trabalhos" id="work" />
        </li>
        <li>
          <NavbarLink title="Sobre" id="about" />
        </li>
      </ul>
    </nav>
  );
}
