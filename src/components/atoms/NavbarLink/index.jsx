import { Link } from 'react-scroll';

export default function NavbarLink({ title, id }) {
  return (
    <Link
      to={id}
      className="navbar__link"
      activeClass="-active"
      spy
      smooth
      offset={-100}
      isDynamic
      duration={200}
    >
      {title}
    </Link>
  );
}
