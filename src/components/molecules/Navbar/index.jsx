import NavbarLink from '../../atoms/NavbarLink';

export default function Navbar({ links }) {
  return (
    <nav className="navbar">
      <ul className="navbar__container">
        {links.map((link) => (
          <li key={link.id}>
            <NavbarLink title={link.label} id={link.link} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
