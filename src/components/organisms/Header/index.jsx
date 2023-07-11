import Logo from '../../atoms/Logo';
import Navbar from '../../molecules/Navbar';

export default function Header({ menuLogo, menuLinks }) {
  return (
    <header className="header">
      <div className="header__container">
        <Logo logoInfo={menuLogo} />
        <Navbar links={menuLinks} />
      </div>
    </header>
  );
}
