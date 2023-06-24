import Link from 'next/link';

export default function NavbarLink({ title, id }) {
  return (
    <Link href={id} replace className="navbar__link">
      {title}
    </Link>
  );
}
