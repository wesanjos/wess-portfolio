import Logo from '../../atoms/Logo';
import ContactsFooter from '../../molecules/ContactsFooter';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <Logo />

        <p>Projetado e desenvolvido por Wesley Anjos.</p>

        <ContactsFooter />
      </div>
    </footer>
  );
}
