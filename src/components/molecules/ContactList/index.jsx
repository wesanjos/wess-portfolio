import Image from 'next/image';

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
          <Image
            src="/assets/icons/icon-linkedin.svg"
            alt="Ícone do LinkedIn"
            width={26}
            height={26}
          />
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
          <Image
            src="/assets/icons/icon-mail.svg"
            alt="Ícone de E-mail"
            width={26}
            height={26}
          />
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
          <Image
            src="/assets/icons/icon-github.svg"
            alt="Ícone do GitHub"
            width={26}
            height={26}
          />
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
          <Image
            src="/assets/icons/icon-resume.svg"
            alt="Ícone do Currículo"
            width={26}
            height={26}
          />
          Currículo
        </a>
      </li>
    </ul>
  );
}
