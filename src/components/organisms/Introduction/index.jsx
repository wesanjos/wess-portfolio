import PresentationPhoto from '../../molecules/PresentationPhoto';
import SectionHeader from '../../molecules/SectionHeader';

export default function Introduction() {
  return (
    <section className="introduction" id="sobre">
      <SectionHeader title="Sobre mim" subtitle="Introdução" />

      <div className="introduction__container">
        <PresentationPhoto />

        <div className="textAboutMe">
          <p>
            Opaa, prazer! Sou desenvolvedor front-end a mais de 2 anos focado em
            web.
          </p>
          <p>
            Atualmente realizo desenvolvimento de sites para diversos clientes
            junto a empresa que faço parte. Buscamos criar páginas de forma
            eficiente e com extrema qualidade.
          </p>
          <p>
            Meu objetivo como desenvolvedor é criar páginas bem estruturadas e
            fluídas com tecnologias modernas (React e Next.js)
          </p>
          <p>
            Além de utilizar tecnologias modernas, busco realizar implementações
            de novos conhecimentos e aprimorar as experiências dos usuários.
          </p>
        </div>
      </div>
    </section>
  );
}
