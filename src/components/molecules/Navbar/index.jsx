import NavbarLink from '../../atoms/NavbarLink';

export default function Navbar() {
  return (
    <nav className="navbar">
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
