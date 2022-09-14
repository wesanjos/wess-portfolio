export default function NavbarLink({ title, id }) {
  return (
    <a href={`#${id}`} className="navbar__link">
      {title}
    </a>
  );
}
