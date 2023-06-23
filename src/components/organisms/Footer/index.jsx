import Logo from '../../atoms/Logo';
import ContactList from '../../molecules/ContactList';

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer__container">
        <div className="footer__content">
          <p className="text">
            Entre em contato comigo para discutir projetos e necessidades
            técnicas.
          </p>
          <ContactList />
        </div>

        <Logo />
      </div>
    </footer>
  );
}
