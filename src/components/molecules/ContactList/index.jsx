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
    </ul>
  );
}
