import Logo from '../../atoms/Logo';
import ContactList from '../../molecules/ContactList';

export default function Footer({ footerText, footerSocial, footerLogo }) {
  return (
    <footer className="footer" id="contact">
      <div className="footer__container">
        <div className="footer__content">
          <p className="text">{footerText}</p>
          <ContactList currentContacts={footerSocial} />
        </div>

        <Logo logoInfo={footerLogo} />
      </div>
    </footer>
  );
}
