import Image from 'next/image';
import { useParallax } from 'react-scroll-parallax';

import ExperienceList from '../../molecules/ExperienceList';
import FloatingSocial from '../../molecules/FloatingSocial';
import HeroText from '../../molecules/HeroText';

export default function Hero() {
  const { ref } = useParallax({ speed: 20, easing: 'easeOut' });

  return (
    <section className="hero" id="home">
      <div className="hero__container">
        <HeroText />
        <ExperienceList />
      </div>

      <div className="floatingSocial__container" ref={ref}>
        <FloatingSocial
          linkToAction="https://github.com/wesanjos"
          callToAction="Acesse meu GitHub"
          imageSrc="/assets/icons/github-icon.svg"
          altImg="Ícone do GitHub"
        />
        <FloatingSocial
          linkToAction="mailto:wanjos.andrade@gmail.com"
          callToAction="Entre em contato pelo e-mail"
          imageSrc="/assets/icons/gmail-icon.svg"
          altImg="Ícone de E-mail"
        />
        <FloatingSocial
          linkToAction="https://www.linkedin.com/in/wesanjos/"
          callToAction="Conecte-se ao meu LinkedIn"
          imageSrc="/assets/icons/linkedin-icon.svg"
          altImg="Ícone do LinkedIn"
        />
      </div>

      <a href="#sobre" className="hero__scroll">
        <Image
          alt="Rolar para baixo"
          src="/assets/icons/scroll-down.svg"
          width="40"
          height="40"
        />
      </a>
    </section>
  );
}
