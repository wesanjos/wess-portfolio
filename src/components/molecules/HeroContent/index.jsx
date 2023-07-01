import Image from 'next/image';

export default function HeroContent() {
  return (
    <div className="hero-content">
      <div className="hero-content__container">
        <h1 className="name">Prazer, Wesley Anjos</h1>
        <p className="description">
          Desenvolvedor Front-end especializado na criação de interfaces e
          soluções eficazes, constantemente em busca de aprimorar a experiência
          do usuário. Experiência sólida em design e tecnologia, comprometido
          desde a criação do layout até a fase final do desenvolvimento.
        </p>
        <p className="description">
          Trabalhei com marcas renomadas, como Honda, Bradesco, Mondelez e
          Medley.
        </p>

        <p className="current-work">
          Trabalho na
          <a href="/" target="_blank" rel="noopener noreferrer">
            SapientAG2
          </a>
        </p>

        <a href="#work" className="view-works">
          Ver meus trabalhos
        </a>
      </div>

      <div className="hero-content__image">
        <Image
          src="/assets/images/wess-anjos.webp"
          alt="Wesley Anjos"
          priority
          width={444}
          height={523}
        />
      </div>
    </div>
  );
}
