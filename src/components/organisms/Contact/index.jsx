import ContactList from "../../molecules/ContactList";
import SectionHeader from "../../molecules/SectionHeader";

export default function Contact() {
  return (
    <section className="contact">
      <SectionHeader title="Contato" />

      <div className="contact__container">
        <p>Interessado pelo meu trabalho? Entre em contato comigo através de um desses meios de contato e retornarei o contato brevemente.</p>

        <ContactList />
      </div>
    </section>
  )
}