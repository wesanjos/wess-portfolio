import PresentationPhoto from '../../molecules/PresentationPhoto';
import SectionHeader from '../../molecules/SectionHeader';

export default function Introduction() {
  return (
    <section className="introduction">
      <SectionHeader title="Sobre mim" subtitle="Introdução"/>

      <div className="introduction__container">
        <PresentationPhoto />

        <div className="textAboutMe">
          <p>Sou formado em Gestão de Tecnologia da  Informação,  porém atuo na área de desenvolvimento web.</p>
          <p>Meu objetivo como desenvolvedor é realizar criação de sites de forma eficiente, qualidade e utilizando as tecnologias modernas do mercado.</p>
          <p>Busco desenvolver projetos com simplicidade, responsivo e compatibilidade com diversos navegadores. Além da criação também busco aprimorar a experiência do usuário 😁.</p>
        </div>
      </div>
    </section>
  );
}
