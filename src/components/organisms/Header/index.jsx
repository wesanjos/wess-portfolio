import Logo from '../../atoms/Logo';
import Navbar from '../../molecules/Navbar';

export default function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <Logo />
        <Navbar />
      </div>
    </header>
  );
}
