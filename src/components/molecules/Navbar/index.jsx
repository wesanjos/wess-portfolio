import ScrollspyNav from 'react-scrollspy-nav';

import NavbarLink from '../../atoms/NavbarLink';

export default function Navbar() {
  return (
    <nav className="navbar">
      <ScrollspyNav
        scrollTargetIds={['home', 'sobre', 'portfolio', 'contato']}
        offset={-100}
        activeNavClass="-active"
        scrollDuration="400"
        headerBackground="false"
      >
        <ul className="navbar__container">
          <li>
            <NavbarLink title="Home" id="home" />
          </li>
          <li>
            <NavbarLink title="Sobre mim" id="sobre"/>
          </li>
          <li>
            <NavbarLink title="Portfólio" id="portfolio"/>
          </li>
          <li>
            <NavbarLink title="Contato" id="contato"/>
          </li>
        </ul>
      </ScrollspyNav>
    </nav>
  );
}
