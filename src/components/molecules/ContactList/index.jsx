export default function ContactList() {
  return (
    <ul className="contact-list">
      <li className="contact-list__item">
        <a
          className="contact-list__link"
          href="/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/assets/icons/icon-linkedin.svg" alt="Ícone do LinkedIn" />
          LinkedIn
        </a>
      </li>

      <li className="contact-list__item">
        <a
          className="contact-list__link"
          href="malito:wanjos.andrade@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/assets/icons/icon-mail.svg" alt="Ícone de E-mail" />
          E-mail
        </a>
      </li>

      <li className="contact-list__item">
        <a
          className="contact-list__link"
          href="/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/assets/icons/icon-github.svg" alt="Ícone do GitHub" />
          Github
        </a>
      </li>

      <li className="contact-list__item">
        <a
          className="contact-list__link"
          href="/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/assets/icons/icon-resume.svg" alt="Ícone do Currículo" />
          Currículo
        </a>
      </li>
    </ul>
  );
}
