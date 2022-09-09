export default function ContactsFooter() {
  return (
    <div className="contactsFooter">
      <div className="contactsFooter__item">
        <a
          href="malito:wanjos.andrade@gmail.com"
          target="_blank"
          rel="noreferrer"
        >
          <img src="/assets/icons/icon-mail.svg" alt="Ícone de E-mail" />
        </a>
      </div>
      <div className="contactsFooter__item">
        <a
          href="https://www.linkedin.com/in/srwess"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="/assets/icons/icon-linkedin-footer.svg"
            alt="Ícone do LinkedIn"
          />
        </a>
      </div>
      <div className="contactsFooter__item">
        <a href="https://t.me/SrWess" target="_blank" rel="noreferrer">
          <img src="/assets/icons/icon-telegram.svg" alt="Ícone do Telegram" />
        </a>
      </div>
    </div>
  );
}
