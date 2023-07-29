import Image from 'next/image';

export default function ContactList({ currentContacts }) {
  return (
    <ul className="contact-list">
      {currentContacts.map((contact) => (
        <li className="contact-list__item" key={contact.id}>
          <a
            className="contact-list__link"
            href={contact.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={contact.icon.url}
              alt={contact.icon.alt}
              width={contact.icon.width}
              height={contact.icon.height}
              loading="lazy"
            />
            {contact.cta}
          </a>
        </li>
      ))}
      <li className="contact-list__item">
        <a
          className="contact-list__link"
          href="assets/pdf/WesleyAnjos_CV.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="assets/icons/icon-resume.svg"
            alt="Visualizar projeto"
            width={26}
            height={26}
            loading="lazy"
          />
          Currículo
        </a>
      </li>
    </ul>
  );
}
