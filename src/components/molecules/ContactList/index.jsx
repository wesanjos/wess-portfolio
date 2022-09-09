export default function ContactList() {
  return (
    <div className="contactList">
      <div className="contactList__item">
        <a href="malito:wanjos.andrade@gmail.com" target="_blank" rel="noreferrer">
          <div className="contactList__icon">
            <img src="/assets/icons/icon-mail.svg" alt="E-mail" />
          </div>
          <div className="contactList__wrapper">
            <span>E-mail</span>
            <p>wanjos.andrade@gmail.com</p>
          </div>
        </a>
      </div>
      <div className="contactList__item">
        <a href="https://t.me/SrWess" target="_blank" rel="noreferrer">
          <div className="contactList__icon">
            <img src="/assets/icons/icon-telegram.svg" alt="Telegram" />
          </div>
          <div className="contactList__wrapper">
            <span>Telegram</span>
            <p>@SrWess</p>
          </div>
        </a>
      </div>
    </div>
  );
}
